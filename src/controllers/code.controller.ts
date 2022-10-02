import { NextFunction, Request, Response, Router } from 'express';
import CodeService from '../services/code.service';

const controller = Router();
const codeService = new CodeService();

controller.get('/:chainId/:codeId/schema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainId } = req.params;
    const msg = await codeService.getCodeSchema(chainId, parseInt(codeId));
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.get('/:chainId/:codeId/metadata', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainId } = req.params;
    const msg = await codeService.getCodeDetails(chainId, parseInt(codeId));
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
});

controller.post('/:chainId/:codeId/shema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codeId, chainId } = req.params;
    await codeService.createFullSchema(chainId, parseInt(codeId), req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

export default { prefixPath: '/code', middlewares: [], controller };
