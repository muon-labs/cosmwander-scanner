import { join } from 'path';
import { readdirSync } from 'fs';
import { Application } from 'express';

export const controllers = async (app: Application): Promise<void> => {
  const files = readdirSync('./src/controllers', 'utf8');
  await Promise.all(
    files.map(async (fileName: string) => {
      const { default: file } = await import(join(process.cwd(), 'src/controllers', fileName));
      app.use('/api' + file.prefixPath, ...file.middlewares, file.controller);
    })
  );
};