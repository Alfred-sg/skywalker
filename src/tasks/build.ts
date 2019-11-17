import * as shell from 'shelljs';// https://github.com/shelljs/shelljs

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
  shell.exec(`${npmClient} run build`);
};

export default build;
