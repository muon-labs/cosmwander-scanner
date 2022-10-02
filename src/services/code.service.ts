import { Document } from "mongoose";
import { CodeModel, Code } from '../models';
import CosmWasmClient from "./cosmwasm.service";

class CodeService {
    async getCodeDetails(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
        const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { definition: 0 });
        if (codeDetails) return codeDetails
        await this.fetchCodeDetails(chainId, codeId);
        return await this.getCodeDetails(chainId, codeId);
    }

    async getCodeSchema(chainId: string, codeId: number): Promise<Code | null> {
        const schema = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { definition: 1 });
        return schema ?? null;
    }

    async fetchCodeDetails(chainId: string, codeId: number): Promise<void> {
        const client = await CosmWasmClient.connect(chainId);
        const { id: code_id, creator, checksum } = await client.getCodeDetails(codeId);
        await CodeModel.create({ code_id, chain_id: chainId, creator, checksum });
    }

    async verifyGithubRepo(chainId:string, codeId: string, github_url: string): Promise<boolean> {
        return true;
    }

    async buildGithubRepo(chainId:string, codeId: string, github_url: string): Promise<void> {
        return;
    }
}

export default CodeService;