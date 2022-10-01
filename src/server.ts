import 'dotenv/config';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import * as loaders from './loaders';
const { PORT } = process.env;

const server = express();
server.use(cors({ origin: true }));
server.use(helmet());
server.use(compression());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.listen(PORT, async () => {
  await loaders.controllers(server);
  await loaders.middlewares(server);
  console.info(`Server running and listening in port: ${PORT}`);
});