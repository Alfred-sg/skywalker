import { existsSync } from "fs";
import * as path from 'path';
import * as chalk from 'chalk';
import * as OssUtil from '../utils/oss';
import fsmap from '../utils/fsmap';
import { merge } from '../utils';
import Context from '../core/ctx';
import { OssOptions } from '../types';

const resolve = (ctx: Context) => {
  // @ts-ignore
  const { oss: ossConfig, dist = 'dist', } = ctx.config;
  let { objectRoot: objectRootConfig } = ossConfig || {};
  const {
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    objectRoot,
    deployVersion,
    dist: argvDist,
  } = ctx.argv;

  // 通过 cli 配置
  let oss: OssOptions = {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
  };
  let ossKeys = ['region', 'accessKeyId', 'accessKeySecret', 'bucket'];
  if ( ossConfig ){
    oss = merge<OssOptions>(oss, ossConfig, ossKeys);
  }
  if ( region || accessKeyId || accessKeySecret || bucket ){
    oss = merge<OssOptions>(oss, {
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
    }, ossKeys);
  };

  if ( !oss.region ) {
    throw new Error(chalk.red('oss region is required, please check.'));
  };
  if ( !oss.accessKeyId ) {
    throw new Error('oss accessKeyId is required, please check.');
  };
  if ( oss && !oss.accessKeySecret ) {
    throw new Error('oss accessKeySecret is required, please check.');
  };
  if ( oss && !oss.bucket ) {
    throw new Error('oss bucket is required, please check.');
  };

  return {
    oss,
    objectRoot: objectRoot || objectRootConfig,
    deployVersion,
    dist: argvDist || dist,
  };
};

export default {
  // task 和参数解析一并考虑 TODO
  /**
   * oss 上传
   * @param {Options} options 选项
   */
  task: async (ctx: Context) => {
    const { branch } = ctx;
    // @ts-ignore
    const { env, version } = branch;
    const { oss, objectRoot, deployVersion, dist } = resolve(ctx);

    console.log(chalk.blue('start to update.'))

    OssUtil.config(oss);

    const objectPrefix = `${objectRoot}/${deployVersion ? deployVersion : version}`;
    const dir = path.resolve(process.cwd(), dist);

    // 打包文件不存在，报错
    if ( !existsSync(dir) ) {
      throw new Error(`${dir} is not existed, please check.`);
    };

    const all_upload_tasks: any[] = [];
    fsmap(dir, (paths, isDirectory) => {

      if ( isDirectory ) return;
      all_upload_tasks.push(async () => {
        const object = `${objectPrefix}/${paths.simplePath}`;
        await OssUtil.upload(object, paths.path);
      });
    });

    Promise.all(all_upload_tasks.map(task => task())).then(() => {
      console.log(chalk.blue('end to update.'));
    });
  }
};
