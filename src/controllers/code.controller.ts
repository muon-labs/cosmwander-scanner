import { NextFunction, Request, Response, Router } from 'express';
import CodeService from '../services/code.service';

const controller = Router();
const codeService = new CodeService();

controller.get('/:chainName/pinned', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainName } = req.params;
    const msg = await codeService.getPinnedCode(chainName);
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.get('/:chainName/:codeId/schema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainName } = req.params;
    const msg = await codeService.getCodeSchema(chainName, parseInt(codeId));
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.get('/:chainName/:codeId/metadata', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainName } = req.params;
    const msg = await codeService.getCodeDetails(chainName, parseInt(codeId));
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.post('/:chainName/:codeId/shema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainName } = req.params;
    await codeService.createFullSchema(chainName, parseInt(codeId), req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

export default { prefixPath: '/code', middlewares: [], controller };
