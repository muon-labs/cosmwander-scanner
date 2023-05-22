import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Buffer } from 'buffer';

let instance;

export default class ContractSchemaFinder {
  rpcUrl: string;
  chainId: string;
  queryClient: CosmWasmClient | undefined;
  constructor(RPC_URL: string, CHAIN_ID: string) {
    this.rpcUrl = RPC_URL;
    this.chainId = CHAIN_ID;
  }

  static async getInstance(rpcUrl: string, chainId: string): Promise<ContractSchemaFinder> {
    if (!instance) {
      instance = new ContractSchemaFinder(rpcUrl, chainId);
      await instance.init();
    }
    return instance;
  }

  async init() {
    this.queryClient = await CosmWasmClient.connect(this.rpcUrl);
  }

  async getAllCodes() {
    return this.queryClient!.getCodes();
  }

  async getCodeDetails(code_id: number) {
    return this.queryClient!.getCodeDetails(code_id);
  }

  async getContractsFromCodeId(code_id: number) {
    return this.queryClient!.getContracts(code_id);
  }

  async getMetadataFromContract(address: string, code_id: number) {
    let contract = await this.queryClient!.getContract(address);
    let contractHistory = await this.queryClient!.getContractCodeHistory(address);
    let code = await this.queryClient!.getCodeDetails(code_id);
    let contractName = await this.queryClient!.queryContractRaw(address, Buffer.from('636F6E74726163745F696E666F', 'hex'));

    let parsedName = '';
    try {
      let details = JSON.parse(new TextDecoder().decode(contractName || undefined));
      parsedName = details.contract;
    } catch (e) {
      console.log('Error parsing contract name', e);
    }

    return {
      contractName: parsedName,
      contractAddress: address,
      contractCodeId: code_id,
      contractHistory: contractHistory,
      contract: contract,
      code: code
    };
  }
}
