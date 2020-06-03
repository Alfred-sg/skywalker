import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as topDebug from 'debug';
import * as yargs from 'yargs';
import { detect } from '../utils/git';
import * as strategies from './strategies';
import { Argv, GlobalConfig } from '../types';
import { Branch, Env, NpmClient, ContextOptions } from './types';

const debug = topDebug('skywalker');

class Context {
  /**
   * 选项
   */
  options: ContextOptions;

  /**
   * 环境
   */
  env: Env = 'prod';

  npmClient: NpmClient = 'cnpm';

  /**
   * 工程目录路径
   */
  cwd: string;

  /**
   * 命令行参数
   */
  argv: Argv;

  /**
   * 路径
   */
  paths: { [key: string]: any };

  /**
   * 工程目录中 package.json
   */
  appPackage?: { [key: string]: any };

  /**
   * git 分支信息
   */
  gitBranch?: Branch;

  /**
   * 全局配置
   */
  skywalkerConfig: GlobalConfig;

  /**
   * 工程内配置
   */
  appConfig: GlobalConfig;

  /**
   * stages 策略
   */
  strategy: string = 'ssh';

  /**
   * apis 接口
   */
  apis: { [key: string]: any };

  constructor(options?: ContextOptions){
    this.resolveOptions(options);
    this.wirePaths();
    this.wireConfig();
    this.detectGitBranch();
  }

  /**
   * 解析选项
   * @param options 选项
   */
  private resolveOptions(options: ContextOptions = {}){
    this.cwd = process.cwd();
    this.argv = yargs.argv;
    this.options = options;

    if (options && options.env) this.env = options.env;
    if (this.argv && this.argv.env) this.env = this.argv.deployEnv;

    if (options && options.npmClient) this.npmClient = options.npmClient;
    if (this.argv && this.argv.npmClient) this.npmClient = this.argv.npmClient;

    if (options && options.cwd) this.cwd = options.cwd;

    if (options && options.strategy) this.strategy = options.strategy;
    if (this.argv && this.argv.strategy) this.strategy = this.argv.strategy;
  }

  /**
   * 装填路径
   */
  private wirePaths(){
    const {
      configFileName = '.skywalker.json', 
    } = this.options;

    debug(`start to get paths`);
    this.paths = {
      skywalker: path.resolve(__dirname, '../../'),
      skywalkerConfig: path.resolve(__dirname, `../${configFileName}`),
      app: this.cwd,
      appPackage: path.resolve(this.cwd, './package.json'),
      appConfig: path.resolve(this.cwd, `./${configFileName}`),
    };
    debug(`paths are ${chalk.blue(JSON.stringify(this.paths))}`);
  }

  /**
   * 装填配置
   */
  private wireConfig(){
    const {
      appPackage,
      skywalkerConfig,
      appConfig,
    } = this.paths;

    if ( fs.existsSync(appPackage) ){
      debug(`start to get app's package.json`);
      this.appPackage = require(appPackage);
      debug(`app's package.json is ${chalk.blue(JSON.stringify(this.appPackage))}`);
    };

    if ( fs.existsSync(skywalkerConfig) ){
      debug(`start to get skywlaker's .skywlaker.json`);
      this.skywalkerConfig = require(skywalkerConfig);
      debug(`skywlaker's .skywlaker.json is ${chalk.blue(JSON.stringify(this.skywalkerConfig))}`);
    };

    if ( fs.existsSync(appConfig) ){
      debug(`start to get app's .skywlaker.json`);
      this.appConfig = require(appConfig);
      debug(`app's .skywlaker.json is ${chalk.blue(JSON.stringify(this.appConfig))}`);
    };
  }

  /**
   * 检测 git 分支
   */
  private detectGitBranch = () => {
    debug(`start to get branch info`);
    this.gitBranch = detect();
    debug(`branch info is ${chalk.blue(JSON.stringify(this.gitBranch))}`);
  }

  get stages(){
    const wireOptions = (stage: { [key: string]: any }) => {
      return {
        name: stage.name,
        options: {
          ...(this.skywalkerConfig && this.skywalkerConfig[stage.name]),
          ...stage.options 
        }
      };
    };

    if (this.appConfig && this.appPackage?.stages){
      return this.appPackage.stages.map(wireOptions);
    }

    return strategies[this.strategy].map(wireOptions);
  }
}

export default Context;
