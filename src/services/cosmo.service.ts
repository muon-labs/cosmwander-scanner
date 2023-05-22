import {
  BankExtension,
  DistributionExtension,
  QueryClient,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  setupTxExtension,
  StakingExtension,
  TxExtension
} from '@cosmjs/stargate';
import { WasmExtension, setupWasmExtension } from '@cosmjs/cosmwasm-stargate';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { toHex } from '@cosmjs/encoding';

import axios, { AxiosInstance } from 'axios';
import { chains } from 'chain-registry';
import { HttpError } from '~/utils/http-error';

import { CodeDetails } from '~/interfaces/code';
import { ContractDetails } from '~/interfaces/contract';

const endpoints = {
  junotestnet: {
    rpcUrl: 'https://uni-rpc.reece.sh/',
    restUrl: 'https://uni-api.reece.sh/'
  }
};

class CosmoService {
  query: QueryClient & StakingExtension & BankExtension & TxExtension & DistributionExtension & WasmExtension;

  static async getTmClient(rpcUrl: string): Promise<Tendermint34Client> {
    const httpClient = new HttpBatchClient(rpcUrl, { batchSizeLimit: 10 });
    return await Tendermint34Client.create(httpClient);
  }

  static async connect(chainId: string): Promise<CosmoService> {
    const chainInfo = chains.find((chain) => chain.chain_id === chainId);
    if (!chainInfo) throw new HttpError(403, 'Chain not found');
    const urls = endpoints[chainInfo.chain_name];
    const domain = chainInfo.chain_name.includes('testnet') ? 'testcosmos.directory' : 'cosmos.directory';
    const rpcUrl = urls?.rpcUrl || `https://rpc.${domain}/${chainInfo.chain_name}`;
    const restUrl = urls?.restUrl || `https://rest.${domain}/${chainInfo.chain_name}`;
    const tmClient = await this.getTmClient(rpcUrl);
    const httpClient = axios.create({ baseURL: restUrl, timeout: 200000 });
    return new CosmoService(tmClient, httpClient);
  }

  constructor(readonly tmClient: Tendermint34Client, readonly http: AxiosInstance) {
    this.query = QueryClient.withExtensions(
      tmClient,
      setupStakingExtension,
      setupBankExtension,
      setupTxExtension,
      setupWasmExtension,
      setupDistributionExtension
    );
  }

  async getInstantiateTx(address: string) {
    const { data } = await this.http.get<{ tx_responses: any }>(`/cosmos/tx/v1beta1/txs?events=instantiate._contract_address=%27${address}%27`);
    if (!data?.tx_responses.length) throw new HttpError(404, 'Tx not found');
    const {
      tx_responses: [tx]
    } = data;

    return {
      height: tx.height,
      txHash: tx.txhash,
      createdAt: tx.timestamp,
      msg: tx.tx.body.messages[0]
    };
  }

  async getStoreCodeTx(codeId: number) {
    const { data } = await this.http.get<{ tx_responses: any }>(`/cosmos/tx/v1beta1/txs?events=store_code.code_id=%27${codeId}%27`);
    if (!data?.tx_responses.length) throw new HttpError(404, 'Tx storeCode not found');
    const {
      tx_responses: [tx]
    } = data;

    return {
      height: parseInt(tx.height),
      txHash: tx.txhash,
      createdAt: tx.timestamp
    };
  }

  async getContractsByCodeId(codeId: number): Promise<readonly string[]> {
    const { contracts } = await this.query.wasm.listContractsByCodeId(codeId);
    return contracts;
  }

  async getCodeDetails(codeId: number): Promise<CodeDetails> {
    const { codeInfo } = await this.query.wasm.getCode(codeId);
    if (!codeInfo) throw new HttpError(404, 'Code not found');
    const extraInfo = await this.getStoreCodeTx(codeId);
    return {
      codeId: codeId,
      creator: codeInfo.creator,
      checksum: toHex(codeInfo.dataHash),
      height: extraInfo.height,
      txHash: extraInfo.txHash,
      createdAt: extraInfo.createdAt
    };
  }

  async getContractDetails(address: string): Promise<ContractDetails> {
    const { contractInfo } = await this.query.wasm.getContractInfo(address);
    console.log('test', address);
    if (!contractInfo) throw new HttpError(404, 'Contract not found');
    const extraInfo = await this.getInstantiateTx(address);
    return {
      address,
      codeId: contractInfo.codeId.toNumber(),
      creator: contractInfo.creator,
      admin: contractInfo.admin || undefined,
      label: contractInfo.label,
      ibcPortId: contractInfo.ibcPortId || undefined,
      initMsg: extraInfo.msg,
      height: extraInfo.height,
      txHash: extraInfo.txHash,
      createdAt: extraInfo.createdAt
    };
  }
}

export default CosmoService;
