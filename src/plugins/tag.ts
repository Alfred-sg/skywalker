import * as chalk from 'chalk';
import * as git from '../utils/git';
import Context from '../core/Context';

/**
 * 打 tag
 */
export default async (ctx: Context, options: any) => { 
  const { env, gitBranch: { name }, appPackage } = ctx;

  if (env !== 'prod') return;

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

  if (!appPackage || !appPackage.version) return;
  
  try {
    console.log(chalk.blue('start to git tag'));
    git.tag(appPackage.version);
  } catch(err){
    throw err;
  };
}
