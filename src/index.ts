import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect, diffToOriginMaster } from './utils/git';
import { merge } from './utils';
import { build, oss as ossTask } from './tasks';
import { OssOptions } from './types';

interface TaskOptions {
  [key: string]: any,
};

type Task = [Function, TaskOptions | undefined];

interface OssConfig extends OssOptions {
  objectRoot?: string,
};

interface UserConfig {
  pre?: Task[],// lint、单测 TODO
  post?: Task[],
  oss?: OssConfig,
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
  const {
    pre = [],// lint、单测 TODO
    post = [],
    oss: ossConfig,
    envMap,
    dist = 'dist',
    npmClient,
  } = userConfig;
  let { objectRoot: objectRootConfig } = ossConfig || {};
  const {
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    objectRoot,
  } = argv;

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
    console.error(chalk.red('oss region is required, please check.'));
    return false;
  };
  if ( !oss.accessKeyId ) {
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
    objectRoot: objectRoot || objectRootConfig,
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
    objectRoot,
    envMap,
    dist,
    npmClient,
  } = config;

  const branch = detect();
  if (!branch) return;

  const { name, env, version } = branch;

  // 与 master 分支对比
  if ( env === 'publish' ) {
    pre.unshift([() => {
      const diff = diffToOriginMaster(name);
      if ( diff ) {
        console.error(chalk.red(`branch ${name} is diffrence with origin/master, please merge or rebase.`));
        return false;
      };
  
      return true;
    }, undefined])
  };

  // 生产环境与 master 分支对比 TODO
  if ( oss && env && version ) {
    post.push([ossTask, {
      oss,
      objectRoot,
      dist,
      envMap,
      env,
      version,
    }]);
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
