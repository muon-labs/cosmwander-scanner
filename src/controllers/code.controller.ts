import { NextFunction, Request, Response, Router } from 'express';
import CodeService from '../services/code.service';

const controller = Router();
const codeService = new CodeService();

controller.get('/:chainId/:codeId/schema', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { codeId, chainId } = req.params;
        const msg = await codeService.getCodeSchema(chainId, parseInt(codeId));
        res.status(200).send(msg);
      } catch (error: unknown) {
        next(error);
      }
});

controller.get('/:chainId/:codeId/metadata', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { codeId, chainId } = req.params;
        const msg = await codeService.getCodeDetails(chainId, parseInt(codeId));
        res.status(200).send(msg);
      } catch (error: unknown) {
        next(error);
      }
});

export default { prefixPath: '/code', middlewares: [], controller };