import { NextFunction, Request, Response, Router } from 'express';
import ContractService from '../services/contract.service';

const controller = Router();
const contractService = new ContractService();

controller.get('/:chainName/:address/schema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, chainName } = req.params;
    const msg = await contractService.getContractSchema(chainName, address);
    res.status(200).send(msg);
  } catch (error: unknown) {
    next(error);
  }
});

controller.get('/:chainName/:address/metadata', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, chainName } = req.params;
    const msg = await contractService.getContractDetails(chainName, address);
    res.status(200).send(msg);
  } catch (error: unknown) {
    next(error);
  }
});

export default { prefixPath: '/contract', middlewares: [], controller };
