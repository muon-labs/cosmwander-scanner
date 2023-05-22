import { NextFunction, Request, Response, Router } from 'express';
import CosmWanderService from '../services/cosmwander.sevice';

const controller = Router();
const contractService = new CosmWanderService();

controller.get('/:chainName/contracts/latest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainName } = req.params;
    const { limit } = req.query;
    const msg = await contractService.getLatestContracts(chainName, 30);
    res.status(200).send(msg);
  } catch (err) {
    next(err);
  }
});

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
