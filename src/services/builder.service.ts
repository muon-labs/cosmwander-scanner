import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { HttpError } from '~/utils/http-error';

class BuilderService {
  static buildRepo(cwd: string, repoPath: string): void {
    spawnSync('cargo', ['run --example schema'], { cwd: path.join(cwd, 'cw', repoPath) });
  }

  static verifyRepo(repo: string): void {}
  static cloneRepo(cwd: string, code_ref: { repoUrl: string; commitHash: string; repoPath: string }): void {
    spawnSync('git', ['clone', code_ref.repoUrl, 'cw'], { cwd });
    spawnSync('git', ['checkout', code_ref.commitHash], { cwd: path.join(cwd, 'cw') });
  }

  static deleteRepo(cwd: string) {
    spawnSync('rm', ['-rf', 'cw'], { cwd });
  }

  static getSchema(cwd: string, repoPath: string): Record<string, unknown> {
    const schemaPath = path.join(cwd, 'cw', repoPath, 'schema');
    const files = readdirSync(schemaPath);
    if (files.length === 1) {
      const schema = require(path.join(schemaPath, files[0]));
      const { instantiate, execute, query } = schema;
      return { instantiateMsg: instantiate, executeMsg: execute, queryMsg: query };
    }
    if (!['instantiate_msg.json', 'execute_msg.json', 'query_msg.json'].every((nameFile) => files.includes(nameFile))) throw new HttpError(501);
    const instantiateMsg = require(path.join(schemaPath, 'instantiate_msg.json'));
    const executeMsg = require(path.join(schemaPath, 'execute_msg.json'));
    const queryMsg = require(path.join(schemaPath, 'query_msg.json'));
    return { instantiateMsg, executeMsg, queryMsg };
  }

  static buildSchemaFromRepo(code_ref: { repoUrl: string; commitHash: string; repoPath: string }) {
    /* const cwd = path.join(process.cwd(), 'temp');
    if (!existsSync(cwd)) mkdirSync(cwd);
    GithubService.verifyRepo(code_ref.repoUrl);
    GithubService.cloneRepo(cwd, code_ref);
    BuilderService.buildRepo(cwd, code_ref.repoPath);
    const schema = BuilderService.getSchema(cwd, code_ref.repoPath);
    GithubService.deleteRepo(cwd);
    return schema; */
  }
}

export default BuilderService;
