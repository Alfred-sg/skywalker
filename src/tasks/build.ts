import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import * as chalk from 'chalk';

interface Options {
  npmClient?: 'npm' | 'cnpm' | 'tnpm' | 'yarn',
};

/**
 * 构建
 * @param {Options} options 选项 
 */
const build = ({
  npmClient = 'npm',
}: Options = {
}) => {
  console.log(chalk.blue('start to build.'))

  shell.exec(`${npmClient} run build`);
  
  console.log(chalk.blue('end to build.'))
};

export default build;
