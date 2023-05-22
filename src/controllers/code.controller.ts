import { NextFunction, Request, Response, Router } from 'express';
import CosmWanderService from '../services/cosmwander.sevice';

const controller = Router();
const codeService = new CosmWanderService();

controller.get('/:chainName/code/pinned', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainName } = req.params;
    const msg = await codeService.getPinnedCode(chainName);
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.get('/:chainName/code/:codeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainName } = req.params;
    const msg = await codeService.getCodeDetails(chainName, parseInt(codeId));
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.post('/:chainName/code/:codeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainName } = req.params;
    await codeService.createFullSchema(chainName, parseInt(codeId), req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

export default { prefixPath: '/', middlewares: [], controller };
