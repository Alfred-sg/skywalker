import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as git from '../utils/git';
import Context from '../core/ctx';

/**
 * 打 tag
 */
export default {
  name: 'tag',
  check: (ctx: Context) => {
    const pkgPath = path.resolve(ctx.cwd, './package.json');
    if ( !fs.existsSync(pkgPath) ){
      throw new Error('package.json is not existed in project, please check.');
    };
  },
  run: (ctx: Context) => {
    const { name = 'master' } = ctx.branch || {};
    const { deployEnv = 'prod' } = ctx.argv;

    if (deployEnv !== 'prod') return;

    // jenkins 环境下非 master 分支，先合并 master 分支
    if (name !== 'master'){
      try {
        console.log(chalk.blue('start to merge master before git tag'));
        git.mergeMaster();
        const conflict = git.detectConflict();
        if (conflict) throw new Error(conflict);
      } catch(err) {
        throw err;
      };
    }

    const pkgPath = path.resolve(ctx.cwd, './package.json');
    const pkg = require(pkgPath);

    if (!pkg.version) return;
    
    try {
      console.log(chalk.blue('start to git tag'));
      git.tag(pkg.version);
    } catch(err){
      throw err;
    };
  }
};
