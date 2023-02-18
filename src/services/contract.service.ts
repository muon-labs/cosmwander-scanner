import { ContractModel } from '../models';
import ChainService from './chain.service';
import CodeService from './code.service';
import CosmWasmClient from './cosmwasm.service';
import Contract from '~/interfaces/contract';

class ContractService {
  codeService: CodeService;
  chainService: ChainService;
  constructor() {
    this.codeService = new CodeService();
    this.chainService = new ChainService();
  }

  async getContractDetails(chainName: string, address: string): Promise<Contract> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const contractDetails = await ContractModel.findOne({ address, chain_id: chain_id });
    if (contractDetails) return contractDetails.toObject();
    await this.createContractDetails(chainName, address);
    return await this.getContractDetails(chainName, address);
  }

  async getContractsDetails(chainName: string, addresses: string[]): Promise<Contract[]> {
    const response: Contract[] = [];
    for (const address of addresses) {
      const details = await this.getContractDetails(chainName, address);
      response.push(details);
    }
    return response;
  }

  async getContractSchema(chainName: string, address: string): Promise<unknown> {
    const contract = await this.getContractDetails(chainName, address);
    const codeSchema = await this.codeService.getCodeDetails(chainName, contract.code_id);
    return codeSchema;
  }

  async createContractDetails(chainName: string, address: string): Promise<void> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const client = await CosmWasmClient.connect(chain_id);
    const { codeId: code_id, creator, admin, label, ibcPortId } = await client.getContractDetails(address);
    const { msg, hash } = await client.getInstantiateMsg(address);
    console.log(msg, hash)
    const contract = new ContractModel({ address, code_id, init_msg: msg, tx_hash: hash, chain_id, creator, admin, label, ibcPortId });
    await contract.save();
  }
}

export default ContractService;
