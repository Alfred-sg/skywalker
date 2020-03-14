import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import Context from '../core/ctx';

/**
 * 构建
 */
export default {
  name: 'build',
  check: (ctx: Context) => {
    const pkgPath = path.resolve(ctx.cwd, './package.json');
    if ( !fs.existsSync(pkgPath) ){
      throw new Error('package.json is not existed in project, please check.');
    };

    const pkg = require(pkgPath);
    if ( !pkg.scripts || !pkg.scripts.build ) {
      throw new Error('there is no build script in package.json, please set.');
    };
  },
  run: (ctx: Context) => {
    // @ts-ignore
    const { npmClient = 'npm' } = ctx.config;
    const { npmClient: npmClientArgv, deployEnv = 'prod' } = ctx.argv;
    const realNpmClient = npmClientArgv || npmClient;
    const cmd = process.platform === 'win32' ? realNpmClient + '.cmd' : realNpmClient;
    
    shell.exec(`${cmd} install`);

    console.log(`cross-env DEPLOY_ENV=${deployEnv} ${cmd} run build`);
    shell.exec(`cross-env DEPLOY_ENV=${deployEnv} ${cmd} run build`);
  }
};
