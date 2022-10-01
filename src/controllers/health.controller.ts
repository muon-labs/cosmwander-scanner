import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import pkj from '../../package.json';
const controller = Router();

controller.get('/', (req: Request, res: Response) => {
  res.status(200).send({
    name: pkj.name,
    version: pkj.version,
    db: {
        status: mongoose.STATES[mongoose.connection.readyState]
    }
  });
});

export default { prefixPath: '/health', middlewares: [], controller };