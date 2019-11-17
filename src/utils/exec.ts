import * as shell from 'shelljs';

/**
 * 执行 shell 脚本
 * @param {string} command shell 命令
 */
export default (command: string) => {
  return new Promise((resolve: Function, reject: Function) => {
    shell.exec(command, (code: number, stdout: any, stderr: any) => {
      if (stderr) {
        reject(stderr);
      } else {
        resolve({
          code,
          stdout
        });
      };
    });
  });
};