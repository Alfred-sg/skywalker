import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import Context from '../Context';

/**
 * 构建
 */
export default async (ctx: Context) => {
  const { scripts } = ctx.paths.appPackage;
  if ( !scripts.build ) {
    throw new Error('there is no build script in package.json, please set.');
  };
  
  const cmd = process.platform === 'win32' ? ctx.npmClient + '.cmd' : ctx.npmClient;

  shell.exec(`${cmd} install`);
  shell.exec(`cross-env DEPLOY_ENV=${ctx.env} ${cmd} run build`);
};
