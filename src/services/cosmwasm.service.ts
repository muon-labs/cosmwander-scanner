import ChainService, { Chain } from './chain.service';
import { CosmWasmClient as CWClient, SigningCosmWasmClient, CodeDetails, Contract } from '@cosmjs/cosmwasm-stargate';
import { MsgExecuteContractEncodeObject, MsgInstantiateContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { MsgExecuteContract, MsgInstantiateContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { HttpError } from '~/utils/http-error';
import GithubService from './github.service';
import BuilderService from './builder.service';
import { toUtf8 } from '@cosmjs/encoding';
import { tmpdir } from 'os';
import { isExecutedError, isPropertyError, isTypeError } from '~/utils/error-types';
import { sleep } from '~/utils/sleep';
import toJsonSchema from 'to-json-schema';
import { mkdtempSync } from 'fs';
import path from 'path';

class CosmWasmClient {
  chainService: ChainService;
  githubService: GithubService;
  chain: Chain;
  client: CWClient | SigningCosmWasmClient;
  constructor(client: CWClient, chainService: ChainService, chainId: string) {
    this.chainService = chainService;
    this.githubService = new GithubService();
    this.chain = this.chainService.getChainById(chainId);
    this.client = client;
  }

  static async connect(chainId: string): Promise<CosmWasmClient> {
    const chainService = new ChainService();
    const rpc = chainService.getBestRPC(chainId);
    const client = await CWClient.connect(rpc);
    return new CosmWasmClient(client, chainService, chainId);
  }

  static async connectWithSigner(chainId: string): Promise<CosmWasmClient> {
    const chainService = new ChainService();
    const chain = chainService.getChainById(chainId);
    if (!chain.fees?.fee_tokens?.length) throw new HttpError(501);
    const [{ denom }] = chain.fees?.fee_tokens;
    const rpc = chainService.getBestRPC(chainId);
    const wallet = await CosmWasmClient.getWallet(chain.bech32_prefix);
    const client = await SigningCosmWasmClient.connectWithSigner(rpc, wallet, { gasPrice: GasPrice.fromString(`${0.025}${denom}`) });
    return new CosmWasmClient(client, chainService, chainId);
  }

  static async getWallet(bech32Prefix: string): Promise<DirectSecp256k1HdWallet> {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
      prefix: bech32Prefix
    });
    return wallet;
  }

  static buildSchemaFromRepo(code_ref: { repoUrl: string; commitHash: string; repoPath: string }) {
    const cwd = mkdtempSync(path.join(tmpdir()));
    GithubService.verifyRepo(code_ref.repoUrl);
    GithubService.cloneRepo(cwd, code_ref);
    BuilderService.buildRepo(cwd, code_ref.repoPath);
    const schema = BuilderService.getSchema(cwd, code_ref.repoPath);
    GithubService.deleteRepo(cwd);
    return schema;
  }

  async getContractsByCodeId(codeId: number): Promise<readonly string[]> {
    return await this.client.getContracts(codeId);
  }

  async getCodeDetails(codeId: number): Promise<CodeDetails> {
    return await this.client.getCodeDetails(codeId);
  }

  async getContractDetails(address: string): Promise<Contract> {
    return await this.client.getContract(address);
  }

  async getQuerySchemaFromAddress(address: string) {
    const querySchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'QueryMsg',
      oneOf: [] as Record<string, unknown>[]
    };
    try {
      await this.client.queryContractSmart(address, { purposely_incorrect_msg: {} });
    } catch (e) {
      const { message } = e as { message: string };
      if (!message.includes('expected')) return {};
      const messages = [...message.matchAll(/(?<=`)[^`]+(?=`(?:[^`]*`[^`]*`)*[^`]*$)/g)].slice(1);
      querySchema.oneOf = messages.map(([message]) => ({ type: 'object', required: [message], properties: {} }));
    }
    return querySchema;
  }

  async getExecuteSchemaFromAddress(address: string) {
    const executeSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'ExecuteMsg',
      oneOf: [] as Record<string, unknown>[]
    };

    const client = this.client as SigningCosmWasmClient;
    // @ts-ignore
    const signer = client.signer as OfflineSigner;
    const [{ address: userAddress }] = await signer.getAccounts();

    const encodeMsg: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        msg: toUtf8(JSON.stringify({ wasm: { execute: { purposely_incorrect_msg: {} } } })),
        sender: userAddress,
        contract: address,
        funds: []
      })
    };

    try {
      await client.simulate(userAddress, [encodeMsg], undefined);
    } catch (e) {
      const { message } = e as { message: string };
      if (!message.includes('expected')) return {};
      const messages = [...message.matchAll(/(?<=`)[^`]+(?=`(?:[^`]*`[^`]*`)*[^`]*$)/g)].slice(1);
      executeSchema.oneOf = messages.map(([message]) => ({ type: 'object', required: [message], properties: {} }));
    }
    return executeSchema;
  }

  async getInstantiateSchemaFromCodeId(codeId: number) {
    const client = this.client as SigningCosmWasmClient;
    // @ts-ignore
    const signer = client.signer as OfflineSigner;
    const [{ address: userAddress }] = await signer.getAccounts();

    const encodeMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      value: MsgInstantiateContract.fromPartial({
        label: 'test',
        sender: userAddress,
        codeId,
        funds: []
      })
    };

    const msgProperties = await this.#simulateInstantiate(client, encodeMsg, {});
    const instantiateSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'InstantiateMsg',
      ...toJsonSchema(msgProperties)
    };

    return instantiateSchema;
  }

  #simulateInstantiate = async (client: SigningCosmWasmClient, encodeObj: MsgInstantiateContractEncodeObject, msg: Record<string, unknown>) => {
    try {
      encodeObj.value.msg = toUtf8(JSON.stringify(msg));
      await client.simulate(encodeObj.value.sender as string, [encodeObj], undefined);
      return msg;
    } catch (e) {
      const { message: error } = e as { message: string };
      // console.log(error);
      if (isTypeError(error)) {
        const properties = Object.keys(msg);
        const property = properties[properties.length - 1];
        const value = msg[property];
        const newValue = typeof value === 'string' ? 10 : typeof value === 'number' ? [] : {};
        await sleep(2000);
        return await this.#simulateInstantiate(client, encodeObj, { ...msg, [property]: newValue });
      } else if (isPropertyError(error)) {
        const [propertyMatch] = [...error.matchAll(/(?<=`)[^`]+(?=`(?:[^`]*`[^`]*`)*[^`]*$)/g)];
        const [property] = propertyMatch;
        await sleep(2000);
        return await this.#simulateInstantiate(client, encodeObj, { ...msg, [property]: 'string' });
      } else if (isExecutedError(error)) {
        return msg;
      }
    }
  };
}

export default CosmWasmClient;
