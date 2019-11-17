import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect } from './utils/git';
import * as OssUtil from './utils/oss';
import fsmap from './utils/fsmap';
import { build } from './tasks';
import { OssOptions } from './types';

interface TaskOptions {
  [key: string]: any,
};

type Task = [Function, TaskOptions | undefined];

interface UserConfig {
  pre?: Task[],// lint、单测 TODO
  post?: Task[],
  oss?: OssOptions,
  dist?: string,
  npmClient?: 'npm' | 'cnpm' | 'tnpm' | 'yarn',
};

const argv: {
  [key: string]: any;
  _: string[];
  $0: string;
} = yargs.argv;

/**
 * 获取用户配置
 */
const getConfig = () => {
  const userConfig: UserConfig = require(path.resolve(process.cwd(), './.skywalker.json'));
  let {
    pre = [],// lint、单测 TODO
    post = [],
    oss,
    dist = 'dist',
    npmClient,
  } = userConfig;
  const {
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
  } = argv;

  // 通过 cli 配置
  if ( region || accessKeyId || accessKeySecret || bucket ){
    if ( !oss ) oss = {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
    };
    if ( oss && region ) oss.region = region;
    if ( oss && accessKeyId ) oss.accessKeyId = accessKeyId;
    if ( oss && accessKeySecret ) oss.accessKeySecret = accessKeySecret;
    if ( oss && bucket ) oss.bucket = bucket;
  };

  if ( oss && !oss.region ) {
    console.error(chalk.red('oss region is required, please check.'));
  };
  if ( oss && !oss.accessKeyId ) {
    console.error(chalk.red('oss accessKeyId is required, please check.'));
  };
  if ( oss && !oss.accessKeySecret ) {
    console.error(chalk.red('oss accessKeySecret is required, please check.'));
  };
  if ( oss && !oss.bucket ) {
    console.error(chalk.red('oss bucket is required, please check.'));
  };

  return {
    pre,
    post,
    oss,
    dist,
    npmClient,
  }
}

/**
 * 执行
 */
const run = () => {
  const {
    pre = [],// lint、单测 TODO
    post = [],
    oss,
    dist,
    npmClient,
  } = getConfig();

  const branch = detect();
  if (!branch) return;

  const { env, version } = branch;

  // 生产环境与 master 分支对比 TODO
  if ( oss ) {
    post.push([() => {
      OssUtil.config(oss);

      const dir = path.resolve('./', dist);
      fsmap(dir, (path: string) => {
        OssUtil.upload(`/${env}/${version}/${path}`, dir);
      });
    }, undefined]);
  };
  
  [
    ...pre, 
    [build, { npmClient }], 
    ...post
  ].forEach(([task, opts]: Task) => {
    task({
      ...opts,
      branch,
    });
  });
};

export default run;
