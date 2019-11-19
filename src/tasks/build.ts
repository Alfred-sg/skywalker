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

    console.log(chalk.blue('start to build.'))
  
    shell.exec(`${npmClient} run build`);
    
    console.log(chalk.blue('end to build.'))
  }
};
