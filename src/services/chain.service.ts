import { chains } from 'chain-registry';
import { HttpError } from '~/utils/http-error';

import type { Chain } from '@chain-registry/types';

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
}

export default ChainService;
