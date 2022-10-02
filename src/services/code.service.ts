import { Document } from "mongoose";
import { CodeModel, Code } from '../models';
import ChainService from "./chain.service";
import CosmWasmClient from "./cosmwasm.service";

const chainService = new ChainService();

class CodeService {
    async getCodeDetails(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
        const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { definition: 0 });
        if (codeDetails) return codeDetails
        await this.fetchCodeDetails(chainId, codeId);
        return await this.getCodeDetails(chainId, codeId);
    }

    async getCodeSchema(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
        const codeSchema = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { definition: 1 });
        if (codeSchema) return codeSchema;
        await this.fetchCodeSchema(chainId, codeId);
        return await this.getCodeSchema(chainId, codeId);
    }

    async fetchCodeDetails(chainId: string, codeId: number): Promise<void> {
        const client = await CosmWasmClient.connect(chainId);
        const { id: code_id, creator, checksum } = await client.getCodeDetails(codeId);
        await CodeModel.create({ code_id, chain_id: chainId, creator, checksum });
    }

    async fetchCodeSchema(chainId: string, codeId: number): Promise<void> {
        const code = await this.getCodeDetails(chainId, codeId);
        const codeDefinition = {}
        await code.update({ definition: codeDefinition })
    }

    async verifyGithubRepo(chainId:string, codeId: string, github_url: string): Promise<boolean> {
        
        return true;
    }

    async buildGithubRepo(chainId:string, codeId: string, github_url: string): Promise<void> {
        return;
    }
}

export default CodeService;