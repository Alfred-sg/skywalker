import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect, diffToOriginMaster } from './utils/git';
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
  envMap?: { [key: string]: string },
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
    envMap,
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
    return false;
  };
  if ( oss && !oss.accessKeyId ) {
    console.error(chalk.red('oss accessKeyId is required, please check.'));
    return false;
  };
  if ( oss && !oss.accessKeySecret ) {
    console.error(chalk.red('oss accessKeySecret is required, please check.'));
    return false;
  };
  if ( oss && !oss.bucket ) {
    console.error(chalk.red('oss bucket is required, please check.'));
    return false;
  };

  return {
    pre,
    post,
    oss,
    envMap,
    dist,
    npmClient,
  }
}

/**
 * 执行
 */
const run = () => {
  const config = getConfig();
  if (config === false) return;

  const {
    pre = [],// lint、单测 TODO
    post = [],
    oss,
    envMap,
    dist,
    npmClient,
  } = config;

  const branch = detect();
  if (!branch) return;

  const { name, env, version } = branch;

  // 与 master 分支对比
  pre.unshift([() => {
    if (env === 'daily') {
      const diff = diffToOriginMaster(name);
      if ( diff ) {
        console.error(chalk.red(`branch ${name} is diffrence with origin/master, please merge or rebase.`));
        return false;
      };
    };

    return true;
  }, undefined])

  // 生产环境与 master 分支对比 TODO
  if ( oss && env && version ) {
    post.push([() => {
      OssUtil.config(oss);

      const dir = path.resolve('./', dist);
      fsmap(dir, (path: string) => {
        OssUtil.upload(`${envMap ? '/' + envMap[env] : ''}/${version}/${path}`, dir);
      });
    }, undefined]);
  };
  
  [
    ...pre, 
    [build, { npmClient }], 
    ...post
  ].reduce((prev, [task, opts]: Task) => {
    if (prev === false) return false;

    return task({
      ...opts,
      branch,
    });
  }, null);
};

export default run;
