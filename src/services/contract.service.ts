import {ContractModel, Contract } from '../models';
import CodeService from './code.service';
import CosmWasmClient from './cosmwasm.service';

class ContractService {
    codeService: CodeService;
    constructor() {
        this.codeService = new CodeService()
    }

    async getContractDetails(chainId: string, address: string): Promise<Contract> {
        const contractDetails = await ContractModel.findOne({ address, chain_id: chainId });
        if (contractDetails) return contractDetails
        await this.fetchContractDetails(chainId, address);
        return await this.getContractDetails(chainId, address);
    }

    async fetchContractDetails(chainId: string, address: string): Promise<void> {
        const client = await CosmWasmClient.connect(chainId);
        const { codeId: code_id, creator, admin, label, ibcPortId } = await client.getContractDetails(address);
        const contract = new ContractModel({ code_id, chain_id: chainId, creator, admin, label, ibcPortId });
        await contract.save();
    }

    async getContractSchema(chainId: string, address: string): Promise<unknown> {
        const contract = await this.getContractDetails(chainId, address);
        const { schema } = await this.codeService.getCodeSchema(chainId, contract.code_id);
        return schema;
    }
}

export default ContractService;