import { existsSync } from "fs";
import * as path from 'path';
import * as chalk from 'chalk';
import * as OssUtil from '../utils/oss';
import fsmap from '../utils/fsmap';
import { OssOptions } from '../types';

interface Options {
  oss: OssOptions,
  objectRoot: string,
  dist?: string,
  envMap?: { [key: string]: string },
  env: string,
  version: string,
};

// task 和参数解析一并考虑 TODO
/**
 * oss 上传
 * @param {Options} options 选项 
 */
const oss = ({
  oss,
  objectRoot,
  dist = 'dist',
  envMap,
  env,
  version,
}: Options) => {
  console.log(chalk.blue('start to update.'))

  OssUtil.config(oss);

  const dir = path.resolve(process.cwd(), dist);

  if ( !existsSync(dir) ) {
    console.log(chalk.red(`${dir} is not existed, please check.`));
    return false;
  }

  fsmap(dir, (paths) => {
    const object = `${objectRoot}${envMap && envMap[env] ? '/' + envMap[env] + '/' : '/'}${version}/${paths.simplePath}`;
    OssUtil.upload(object, paths.path);
  });

  // 处理异步 TODO
  // console.log(chalk.blue('end to update.'));
  return true;
};

export default oss;
