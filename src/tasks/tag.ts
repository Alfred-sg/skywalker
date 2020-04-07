import * as path from 'path';
import * as fs from 'fs';
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

    if (name !== 'master' || deployEnv !== 'prod') return;

    const pkgPath = path.resolve(ctx.cwd, './package.json');
    const pkg = require(pkgPath);

    if (!pkg.version) return;
    
    try {
      git.tag(pkg.version);
    } catch(err){
      throw new Error('git tag failed.\nERROR MESSAGE: ${err.message}');
    };
  }
};
