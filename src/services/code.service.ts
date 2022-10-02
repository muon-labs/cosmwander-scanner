import { Document } from "mongoose";
import { CodeModel, Code } from '../models';
import CosmWasmClient from "./cosmwasm.service";

class CodeService {
    async getCodeDetails(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
        const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { schema: 0 });
        if (codeDetails) return codeDetails
        await this.fetchCodeDetails(chainId, codeId);
        return await this.getCodeDetails(chainId, codeId);
    }

    async getCodeSchema(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
        const codeSchema = await CodeModel.findOne({ code_id: codeId, chain_id: chainId }, { schema: 1 });
        if (codeSchema) return codeSchema;
        await this.fetchCodeSchema(chainId, codeId);
        return await this.getCodeSchema(chainId, codeId);
    }

    async fetchCodeDetails(chainId: string, codeId: number): Promise<void> {
        const client = await CosmWasmClient.connect(chainId);
        const { id: code_id, creator, checksum } = await client.getCodeDetails(codeId);
        const code = new CodeModel({ code_id, chain_id: chainId, creator, checksum });
        await code.save();
    }

    async fetchCodeSchema(chainId: string, codeId: number): Promise<void> {
        const code = await this.getCodeDetails(chainId, codeId);
        const codeSchema = {}
        await code.update({ schema: codeSchema })
    }
}

export default CodeService;