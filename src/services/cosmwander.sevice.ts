import { CodeModel, ContractModel } from '~/models';
import CacheService from './cache.service';
import ChainService from './chain.service';
import CosmoService from './cosmo.service';
import { HttpError } from '~/utils/http-error';

import Code from '~/interfaces/code';
import Contract from '~/interfaces/contract';

class CosmWanderService {
  cacheService: CacheService;
  chainService: ChainService;
  constructor() {
    this.cacheService = new CacheService();
    this.chainService = new ChainService();
  }

  async getCodeDetails(chainName: string, codeId: number): Promise<Code> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const codeDetails = await CodeModel.findOne({ codeId, chainId: chain_id });
    if (codeDetails) return codeDetails;
    return await this.createCodeDetails(chain_id, codeId);
  }

  async getPinnedCode(chainName: string): Promise<any> {
    /*  const { chain_id } = this.chainService.getChainByName(chainName);
      const chainInfo = await ChainModel.findOne({ chain_id: chain_id });
      if (!chainInfo) throw new HttpError(404);
      return chainInfo.pinned_codes; */
  }

  async createFullSchema(
    chainName: string,
    code_id: number,
    github_ref: { repoUrl: string; commitHash: string; repoPath: string }
  ): Promise<void> {
    /* const { chain_id } = this.chainService.getChainByName(chainName);
      const code = await this.getCodeDetails(chain_id, code_id);
      if (code.full_schema?.execute) throw new HttpError(400, 'Full schema already exists');
      const isGeneratingFullSchema = this.cacheService.get(`full_schema_${code_id}`);
      if (isGeneratingFullSchema) throw new HttpError(409, 'Schema is already being generated');
      this.cacheService.set(`full_schema_${code_id}`, true);
       const { instantiateMsg, executeMsg, queryMsg } = QueryService.buildSchemaFromRepo(github_ref);
      const code_ref = {
        repo_url: github_ref.repoUrl,
        commit_hash: github_ref.commitHash,
        repo_path: github_ref.repoPath
      };
      const full_schema = { instantiate: instantiateMsg, execute: executeMsg, query: queryMsg };
      await CodeModel.updateOne({ code_id, chain_id }, { full_schema, code_ref });
      this.cacheService.set(`full_schema_${code_id}`, false); */
  }

  async createCodeDetails(chainId: string, codeId: number): Promise<Code> {
    const client = await CosmoService.connect(chainId);
    const codeInfo = await client.getCodeDetails(codeId);
    if (!codeInfo) throw new HttpError(404);
    return await CodeModel.create({
      codeId,
      chainId: chainId,
      creator: codeInfo.creator,
      checksum: codeInfo.checksum,
      txHash: codeInfo.txHash,
      height: codeInfo.height,
      createdAt: codeInfo.createdAt
    });
  }

  async getContractDetails(chainName: string, address: string): Promise<any> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    const contractDetails = await ContractModel.findOne({ address, chainId: chain_id });
    if (contractDetails) return contractDetails;
    return await this.createContractDetails(chain_id, address);
  }

  async getContractsDetails(chainName: string, addresses: string[]): Promise<Contract[]> {
    const response: Contract[] = [];
    for (const address of addresses) {
      const details = await this.getContractDetails(chainName, address);
      response.push(details);
    }
    return response;
  }

  async getContractSchema(chainName: string, address: string): Promise<any> {
    const contract = await this.getContractDetails(chainName, address);
    return contract;
  }

  async createContractDetails(chainId: string, address: string): Promise<Contract> {
    const client = await CosmoService.connect(chainId);
    const { codeId, creator, admin, txHash, initMsg, createdAt, height } = await client.getContractDetails(address);
    return await ContractModel.create({ address, codeId, initMsg, txHash, chainId, creator, admin, height, createdAt });
  }

  async getLatestContracts(chainName: string, limit: number): Promise<Contract[]> {
    const { chain_id } = this.chainService.getChainByName(chainName);
    return await ContractModel.find({ chainId: chain_id });
  }
}

export default CosmWanderService;
