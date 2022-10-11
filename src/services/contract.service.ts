import { ContractModel, Contract } from '../models';
import ChainService from './chain.service';
import CodeService from './code.service';
import CosmWasmClient from './cosmwasm.service';

class ContractService {
  codeService: CodeService;
  chainService: ChainService;
  constructor() {
    this.codeService = new CodeService();
    this.chainService = new ChainService();
  }

  async getContractDetails(chainName: string, address: string): Promise<Contract> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const contractDetails = await ContractModel.findOne({ address, chain_id });
    if (contractDetails) return contractDetails.toObject();
    await this.createContractDetails(chain_id, address);
    return await this.getContractDetails(chainName, address);
  }

  async getContractSchema(chainName: string, address: string): Promise<unknown> {
    const contract = await this.getContractDetails(chainName, address);
    const codeSchema = await this.codeService.getCodeSchema(chainName, contract.code_id);
    return codeSchema.definition;
  }

  async createContractDetails(chainId: string, address: string): Promise<void> {
    const client = await CosmWasmClient.connect(chainId);
    const { codeId: code_id, creator, admin, label, ibcPortId } = await client.getContractDetails(address);
    const { msg, hash } = await client.getInstantiateMsg(address);
    const contract = new ContractModel({ address, code_id, init_msg: msg, tx_hash: hash, chain_id: chainId, creator, admin, label, ibcPortId });
    await contract.save();
  }
}

export default ContractService;
