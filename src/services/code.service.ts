import { Document } from 'mongoose';
import { ChainModel } from '~/models/chain.model';
import { HttpError } from '~/utils/http-error';
import { CodeModel, Code } from '../models';
import CacheService from './cache.service';
import CosmWasmClient from './cosmwasm.service';
import ExecuteSchemaService from './execute-schema.service';
import InstantiateSchemaService from './instantiate-schema.service';
import QuerySchemaService from './query-schema.service';

class CodeService {
  cacheService: CacheService;
  constructor() {
    this.cacheService = new CacheService();
  }

  async getCodeDetails(chainId: string, codeId: number): Promise<Document<unknown, unknown, Code> & Code> {
    const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id: chainId });
    if (codeDetails) return codeDetails;
    await this.createCodeDetails(chainId, codeId);
    return await this.getCodeDetails(chainId, codeId);
  }

  async getCodeSchema(chainId: string, codeId: number): Promise<Record<string, unknown>> {
    const codeDetails = await this.getCodeDetails(chainId, codeId);

    const { partial_schema, full_schema, contracts } = codeDetails;

    if (partial_schema?.execute) return { full_schema, partial_schema };
    if (!contracts.length) return {};

    const schema = await this.createPartialSchema(chainId, codeId, contracts[0]);
    await codeDetails.updateOne({ partial_schema: schema });
    return schema;
  }

  async getPinnedCode(chain_id: string): Promise<number[]> {
    const chainInfo = await ChainModel.findOne({ chain_id });
    if (!chainInfo) throw new HttpError(404);
    return chainInfo.pinned_codes;
  }

  async createPartialSchema(chainId: string, codeId: number, address: string): Promise<Record<string, unknown>> {
    const isGeneratingFullPartial = this.cacheService.get(`partial_schema_${codeId}`);
    if (!isGeneratingFullPartial) this.createFullPartialSchema(chainId, codeId, address);

    const query = await QuerySchemaService.getQueryPartialSchema(chainId, address);
    const execute = await ExecuteSchemaService.getExecutePartialSchema(chainId, address);

    return {
      execute,
      query,
      instantiate: {}
    };
  }

  async createFullPartialSchema(chainId: string, codeId: number, address: string): Promise<void> {
    this.cacheService.set(`partial_schema_${codeId}`, true);
    const query = await QuerySchemaService.getQueryFullPartialSchema(chainId, address);
    const execute = await ExecuteSchemaService.getExecuteFullPartialSchema(chainId, address);
    const instantiate = await InstantiateSchemaService.getInstantiateSchemaFromCodeId(chainId, codeId);

    await CodeModel.updateOne({ code_id: codeId, chain_id: chainId }, { partial_schema: { query, execute, instantiate } });
    this.cacheService.set(`partial_schema_${codeId}`, false);
  }

  async createFullSchema(
    chain_id: string,
    code_id: number,
    github_ref: { repoUrl: string; commitHash: string; repoPath: string }
  ): Promise<void> {
    const code = await this.getCodeDetails(chain_id, code_id);
    if (code.full_schema?.execute) throw new HttpError(400, 'Full schema already exists');
    const isGeneratingFullSchema = this.cacheService.get(`full_schema_${code_id}`);
    if (isGeneratingFullSchema) throw new HttpError(409, 'Schema is already being generated');
    this.cacheService.set(`full_schema_${code_id}`, true);
    const { instantiateMsg, executeMsg, queryMsg } = CosmWasmClient.buildSchemaFromRepo(github_ref);
    const code_ref = {
      repo_url: github_ref.repoUrl,
      commit_hash: github_ref.commitHash,
      repo_path: github_ref.repoPath
    };
    const full_schema = { instantiate: instantiateMsg, execute: executeMsg, query: queryMsg };
    await CodeModel.updateOne({ code_id, chain_id }, { full_schema, code_ref });
    this.cacheService.set(`full_schema_${code_id}`, false);
  }

  async createCodeDetails(chainId: string, codeId: number): Promise<void> {
    const client = await CosmWasmClient.connect(chainId);
    const { id: code_id, creator, checksum } = await client.getCodeDetails(codeId);
    const contracts = await client.getContractsByCodeId(codeId);
    await CodeModel.create({ code_id, chain_id: chainId, creator, checksum, contracts });
  }
}

export default CodeService;
