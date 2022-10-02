import { ContractModel, Contract } from '../models';
import CodeService from './code.service';
import CosmWasmClient from './cosmwasm.service';

class ContractService {
  codeService: CodeService;
  constructor() {
    this.codeService = new CodeService();
  }

  async getContractDetails(chainId: string, address: string): Promise<Contract> {
    const contractDetails = await ContractModel.findOne({ address, chain_id: chainId });
    if (contractDetails) return contractDetails;
    await this.fetchContractDetails(chainId, address);
    return await this.getContractDetails(chainId, address);
  }

  async getContractSchema(chainId: string, address: string): Promise<unknown> {
    const contract = await this.getContractDetails(chainId, address);
    const codeSchema = await this.codeService.getCodeSchema(chainId, contract.code_id);
    if (codeSchema?.definition?.execute) return codeSchema.definition;
    await this.fetchContractSchema(chainId, address);
    return await this.getContractSchema(chainId, address);
  }

  async createPartialSchema(chainId: string, address: string): Promise<unknown> {
    const client = await CosmWasmClient.connectWithSigner(chainId);
    const execute = await client.getExecuteSchemaFromAddress(address);
    const query = await client.getQuerySchemaFromAddress(address);
    return {
      execute,
      query,
      instantiate: {}
    };
  }

  async createFullSchema(repository: string): Promise<unknown> {
    return {};
  }

  async fetchContractDetails(chainId: string, address: string): Promise<void> {
    const client = await CosmWasmClient.connect(chainId);
    const { codeId: code_id, creator, admin, label, ibcPortId } = await client.getContractDetails(address);
    const contract = new ContractModel({ code_id, chain_id: chainId, creator, admin, label, ibcPortId });
    await contract.save();
  }

  async fetchContractSchema(chainId: string, address: string): Promise<void> {
    const contract = await this.getContractDetails(chainId, address);
    const code = await this.codeService.getCodeDetails(chainId, contract.code_id);
    const codeDefinition = code.repository ? await this.createFullSchema(code.repository) : await this.createPartialSchema(chainId, address);
    await code.updateOne({ definition: codeDefinition });
  }
}

export default ContractService;
