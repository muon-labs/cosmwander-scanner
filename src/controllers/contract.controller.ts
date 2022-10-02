import { NextFunction, Request, Response, Router } from 'express';
import ContractService from '../services/contract.service';

const controller = Router();
const contractService = new ContractService()

controller.get('/:chainId/:address/schema', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, chainId } = req.params;
        const msg = await contractService.getContractSchema(chainId, address);
        res.status(200).send(msg);
      } catch (error: unknown) {
        next(error);
      }
});

controller.get('/:chainId/:address/metadata', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, chainId } = req.params;
        const msg = await contractService.getContractDetails(chainId, address);
        res.status(200).send(msg);
      } catch (error: unknown) {
        next(error);
      }
});

export default { prefixPath: '/contract', middlewares: [], controller };