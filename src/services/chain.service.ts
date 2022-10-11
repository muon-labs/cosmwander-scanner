import { Chain } from '@chain-registry/types';
import { chains } from '~/utils/chains';
import { HttpError } from '~/utils/http-error';
import 'chain-registry';

export { Chain } from '@chain-registry/types';
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
    if (!chain.apis?.rpc?.length) throw new HttpError(501);
    const [rpcNode] = chain.apis.rpc;
    return rpcNode.address;
  }
}

export default ChainService;
