import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { HttpError } from '~/utils/http-error';

class BuilderService {
  static buildRepo(cwd: string, repoPath: string): void {
    spawnSync('cargo', ['run --example schema'], { cwd: path.join(cwd, 'cw', repoPath) });
  }

  static getSchema(cwd: string, repoPath: string): Record<string, unknown> {
    const schemaPath = path.join(cwd, 'cw', repoPath, 'schema');
    const files = readdirSync(schemaPath);
    if (!['instantiate_msg.json', 'execute_msg.json', 'query_msg.json'].every((nameFile) => files.includes(nameFile))) throw new HttpError(501);
    const instantiateMsg = require(path.join(schemaPath, 'instantiate_msg.json'));
    const executeMsg = require(path.join(schemaPath, 'execute_msg.json'));
    const queryMsg = require(path.join(schemaPath, 'query_msg.json'));
    return { instantiateMsg, executeMsg, queryMsg };
  }
}

export default BuilderService;
