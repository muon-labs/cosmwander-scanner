import { spawnSync } from 'child_process';
import path from 'path';

class GithubService {
  static verifyRepo(repo: string): void {}
  static cloneRepo(cwd: string, code_ref: { repoUrl: string; commitHash: string; repoPath: string }): void {
    spawnSync('git', ['clone', code_ref.repoUrl, 'cw'], { cwd });
    spawnSync('git', ['checkout', code_ref.commitHash], { cwd: path.join(cwd, 'cw') });
  }

  static deleteRepo(cwd: string) {
    spawnSync('rm', ['-rf', 'cw'], { cwd });
  }
}

export default GithubService;
