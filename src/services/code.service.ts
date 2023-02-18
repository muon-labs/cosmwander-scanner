import Code from '~/interfaces/code';
import { Network } from '~/interfaces/network';
import { ChainModel } from '~/models/chain.model';
import { HttpError } from '~/utils/http-error';
import { CodeModel } from '../models';
import CacheService from './cache.service';
import ChainService from './chain.service';
import CosmWasmClient from './cosmwasm.service';

class CodeService {
  cacheService: CacheService;
  chainService: ChainService;
  constructor() {
    this.cacheService = new CacheService();
    this.chainService = new ChainService();
  }

  async getCodeDetails(chainName: string, codeId: number): Promise<Code> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const codeDetails = await CodeModel.findOne({ code_id: codeId, chain_id });
    if (codeDetails) return codeDetails;
    await this.createCodeDetails(chain_id, codeId);
    return await this.getCodeDetails(chainName, codeId);
  }

  async getPinnedCode(chainName: string): Promise<number[]> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const chainInfo = await ChainModel.findOne({ chain_id: chain_id });
    if (!chainInfo) throw new HttpError(404);
    return chainInfo.pinned_codes;
  }

  async createFullSchema(
    chainName: string,
    code_id: number,
    github_ref: { repoUrl: string; commitHash: string; repoPath: string }
  ): Promise<void> {
    const { chain_id } = this.chainService.getChainByName(chainName);
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
