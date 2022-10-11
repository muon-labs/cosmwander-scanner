import { chains, Chain } from '~/utils/chains';
import { HttpError } from '~/utils/http-error';
class ChainService {
  getChainById(chainId: string): Chain {
    const chain = chains.find((chain) => chain.chain_id === chainId);
    if (!chain) throw new HttpError(400);
    return chain;
  }

  getChainByName(chainName: string): Chain {
    const chain = chains.find((chain) => chain.chain_name === chainName);
    if (!chain) throw new HttpError(400);
    return chain;
  }

  getBestRPC(chainId: string): string {
    const chain = this.getChainById(chainId);
    return chain.rpc_url;
  }
}

export default ChainService;
