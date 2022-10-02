import ChainService, { Chain } from './chain.service';
import { CosmWasmClient as CWClient, SigningCosmWasmClient, CodeDetails, Contract } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { GasPrice } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { HttpError } from '~/utils/http-error';

class CosmWasmClient {
  chainService: ChainService;
  chain: Chain;
  client: CWClient | SigningCosmWasmClient;
  constructor(client: CWClient, chainService: ChainService, chainId: string) {
    this.chainService = chainService;
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


static async getWallet (bech32Prefix: string): Promise<DirectSecp256k1HdWallet> {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, { 
    prefix: bech32Prefix
  })
  return wallet
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
      if (!message.includes('expected one of')) return;
      querySchema.oneOf = message
        .split('expected one of ')[1]
        .split(': query wasm contract failed')[0]
        .split(', ')
        .map((msgType: string) => ({
          type: 'object',
          required: [msgType.replace(/`/g, '')],
          properties: {}
        }));
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
    try {
      await client.execute(userAddress, address, { purposely_incorrect_msg: {} }, 'auto');
    } catch (e) {
      const { message } = e as { message: string };
      if (!message.includes('expected one of')) return;
      executeSchema.oneOf = message
        .split('expected one of ')[1]
        .split(': execute wasm contract failed')[0]
        .split(', ')
        .map((msgType: string) => ({
          type: 'object',
          required: [msgType.replace(/`/g, '')],
          properties: {}
        }));
    }
    return executeSchema;
  }
}

export default CosmWasmClient;
