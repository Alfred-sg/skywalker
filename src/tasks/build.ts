import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import * as chalk from 'chalk';
import Context from '../core/ctx';

export default {
  task: (ctx: Context) => {
    /**
     * 构建
     * @param {Options} options 选项
     */
    // @ts-ignore
    const { npmClient = 'npm' } = ctx.config;

    const pkgPath = path.resolve(ctx.cwd, './package.json');
    if ( !fs.existsSync(pkgPath) ){
      throw new Error('package.json is not existed, please check.');
    };
    const pkg = require(pkgPath);
    if ( !pkg.scripts || !pkg.scripts.build ) {
      throw new Error('there is no build script in package.json, please set.');
    };

    console.log(chalk.blue('start to build.'));

    const cmd = process.platform === 'win32' ? npmClient + '.cmd' : npmClient;
    try {
      shell.exec(`${cmd} run build`);
    } catch(err) {
      throw new Error(`build failed, ${err.message}`);
    };

    console.log(chalk.blue('end to build.'))
  }
};
