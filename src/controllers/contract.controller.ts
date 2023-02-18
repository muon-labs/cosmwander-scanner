import { NextFunction, Request, Response, Router } from 'express';
import ContractService from '../services/contract.service';

const controller = Router();
const contractService = new ContractService();

controller.get('/:chainName/contracts/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, chainName } = req.params;
    const msg = await contractService.getContractSchema(chainName, address);
    res.status(200).send(msg);
  } catch (error: unknown) {
    next(error);
  }
});

controller.post('/:chainName/contracts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainName } = req.params;
    const { contracts } = req.body;
    const msg = await contractService.getContractsDetails(chainName, contracts);
    res.status(200).json(msg);
  } catch (error: unknown) {
    next(error);
  }
});

export default { prefixPath: '/', middlewares: [], controller };
