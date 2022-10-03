import { Document } from 'mongoose';
import { ChainModel } from '~/models/chain.model';
import { HttpError } from '~/utils/http-error';
import { CodeModel, Code } from '../models';
import CosmWasmClient from './cosmwasm.service';
import ExecuteSchemaService from './execute-schema.service';
import InstantiateSchemaService from './instantiate-schema.service';

class CodeService {
  async getCodeDetails(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
    const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id: chainId });
    if (codeDetails) return codeDetails;
    await this.createCodeDetails(chainId, codeId);
    return await this.getCodeDetails(chainId, codeId);
  }

  async getCodeSchema(chainId: string, codeId: number): Promise<Record<string, unknown>> {
    const codeDetails = await this.getCodeDetails(chainId, codeId);
    if (!codeDetails) throw new HttpError(404);

    const { definition, contracts } = codeDetails;
    if (definition?.execute) return definition;
    if (!contracts.length) return {};

    const schemaDefinition = await this.createPartialSchema(chainId, codeId, contracts[0]);
    await codeDetails.updateOne({ definition: schemaDefinition });
    return schemaDefinition;
  }

  async getPinnedCode(chain_id: string): Promise<number[]> {
    const chainInfo = await ChainModel.findOne({ chain_id });
    if (!chainInfo) throw new HttpError(404);
    return chainInfo.pinned_codes;
  }

  async createPartialSchema(chainId: string, codeId: number, address: string): Promise<Record<string, unknown>> {
    const client = await CosmWasmClient.connectWithSigner(chainId);
    const execute = await ExecuteSchemaService.getExecuteSchema(chainId, address);
    const query = await client.getQuerySchemaFromAddress(address);
    const instantiate = await InstantiateSchemaService.getInstantiateSchemaFromCodeId(chainId, codeId);

    return {
      execute,
      query,
      instantiate
    };
  }

  async createFullSchema(
    chain_id: string,
    code_id: number,
    github_ref: { repoUrl: string; commitHash: string; repoPath: string }
  ): Promise<void> {
    const { instantiateMsg, executeMsg, queryMsg } = CosmWasmClient.buildSchemaFromRepo(github_ref);
    const code_ref = {
      repo_url: github_ref.repoUrl,
      commit_hash: github_ref.commitHash,
      repo_path: github_ref.repoPath
    };
    const definition = { instantiate: instantiateMsg, execute: executeMsg, query: queryMsg };
    await CodeModel.updateOne({ code_id, chain_id }, { definition, code_ref });
  }

  async createCodeDetails(chainId: string, codeId: number): Promise<void> {
    const client = await CosmWasmClient.connect(chainId);
    const { id: code_id, creator, checksum } = await client.getCodeDetails(codeId);
    const contracts = await client.getContractsByCodeId(codeId);
    await CodeModel.create({ code_id, chain_id: chainId, creator, checksum, contracts });
  }
}

export default CodeService;
