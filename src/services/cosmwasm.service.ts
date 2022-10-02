import ChainService, { Chain } from './chain.service';
import { CosmWasmClient as CWClient, CodeDetails, Contract } from '@cosmjs/cosmwasm-stargate';

class CosmWasmClient {
    chainService: ChainService;
    chain: Chain;
    client: CWClient;
    constructor(client: CWClient, chainService: ChainService, chainId: string) {
        this.chainService = chainService;
        this.chain = this.chainService.getChainById(chainId);
        this.client = client;
    }

    static async connect(chainId: string): Promise<CosmWasmClient> {
        const chainService = new ChainService();
        const rpc = chainService.getBestRPC(chainId);
        const client = await CWClient.connect(rpc);
        return new CosmWasmClient(client, chainService, chainId);
    }

    async getContractsByCodeId(codeId: number): Promise<readonly string[]> {
        return await this.client.getContracts(codeId)
    }

    async getCodeDetails(codeId: number): Promise<CodeDetails> {
        return await this.client.getCodeDetails(codeId)
    }

    async getContractDetails(address: string): Promise<Contract> {
        return await this.client.getContract(address)
    }
}

export default CosmWasmClient;