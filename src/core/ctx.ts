import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect } from '../utils/git';
import { buildTask } from '../tasks';
import { getConfig } from '../config';
import { Argv, Task, GlobalConfig } from '../types';
const ChatBot = require('dingtalk-robot-sender');

interface Branch {
  current?: boolean,
  name: string,
  env?: string,
  version?: string,
};

class Context {
  private pkg?: { [key: string]: any };
  cwd: string = process.cwd();
  argv: Argv = yargs.argv;
  config: GlobalConfig = getConfig();
  branch?: Branch;

  preTasks: Task[] = [];
  buildinTasks: Task[] = [buildTask];
  postTasks: Task[] = [];

  constructor(){
    this.pkg = require(path.resolve(process.cwd(), './package.json'));
    this.config = getConfig();
    this.detectDeployBranch();
  }

  /**
   * 检出有效分支，并与 master 分支比较，是否有冲突，TODO
   */
  private detectDeployBranch = () => {
    const branch = detect();

    if ( branch ) {
      this.branch = branch;
    } else {
      throw new Error('there is no available branch existed, please check.');
    };

    // const { name, env } = branch;
    //
    // if ( env === 'publish' ) {
    //   const diff = diffToOriginMaster(name);
    //   if ( diff ) {
    //     throw new Error(`branch ${name} is diffrence with origin/master, please merge or rebase.`);
    //   };
    // };
  }

  pre = (...tasks: Task[]) => {
    (tasks || []).map(task => {
      this.preTasks.push(task);
    });
    return this;
  }

  post = (...tasks: Task[]) => {
    (tasks || []).map(task => {
      this.postTasks.push(task);
    });
    return this;
  }

  excute = async () => {
    const all_tasks = [
      ...this.preTasks,
      ...this.buildinTasks,
      ...this.postTasks
    ];

    const runCheck = all_tasks.reduce((
      prevCheck: Function, 
      current: Task
    ) => {
      if (current.check){
        return async () => {
          try {
            if (prevCheck) await prevCheck(this);
            if (current.check) await current.check(this);
          } catch(err) {
            throw new Error(`${current.name} task check failed.\nERROR MESSAGE: ${err.message}`);
          }
        };
      };

      return prevCheck;
    }, undefined);

    const runTasks = all_tasks.reduce((
      prevTasks: Function, 
      current: Task
    ) => {
      return async () => {
        let prevRes;
        if (prevTasks) prevRes = await prevTasks(this);

        console.log(`${chalk.blue(`${current.name} task is started`)}`);
        
        let res;
        try {
          res = await current.run(this, prevRes);
        } catch(err) {
          throw new Error(`${current.name} task excute failed.\nERROR MESSAGE: ${err.message}`);
        }

        console.log(`${chalk.blue(`${current.name} task is ended`)}`);

        return res;
      };
    }, undefined);

    try {
      if ( runCheck ) await runCheck(this)
      if ( runTasks ) await runTasks(this);
      this.sendToDingtalk();
    } catch(err) {
      console.log(chalk.red(err.message));
      this.sendToDingtalk(err);
    };
  }

  sendToDingtalk = (err?: any) => {
    const { deployEnv = 'prod' } = this.argv;
    const project_config_file_path = path.resolve(process.cwd(), './.skywalker.json')
    if ( !fs.existsSync(project_config_file_path) ) return;

    const projectConfig = require(project_config_file_path);
    const { 
      accessToken = '', 
      secret = '', 
      success = {}, 
      error = {},
      subscribe = undefined,// 订阅内容 ['prod', 'dev', 'success', 'error']
    } = projectConfig.dingtalk || {};

    if (!accessToken || !secret) return;
    if (subscribe){
      if ( !subscribe.includes(deployEnv) && !subscribe.includes(!err ? 'success' : 'error') ){
        return;
      }
    }

    const robot = new ChatBot({
      baseUrl: 'https://oapi.dingtalk.com/robot/send',
      accessToken,
      // @ts-ignore
      secret,
    });

    const projectName = this.pkg && this.pkg.name || '';
    const envName = ` ${deployEnv} 环境`;
    const text = !err ? `${projectName} 项目${envName}发布成功，请点击访问` : `${projectName} 项目${envName}发布失败，请重试！\n错误内容：${err.message}`;
    const messageUrl = !err ? success && success[deployEnv] : error && error[deployEnv];
    robot.link({
      title: "发布日志", 
      text,
      picUrl: "", 
      messageUrl
    })
    // .catch((err: any) => {
    //   console.log(chalk.red(`send dingtalk message successed.\nERROR MESSAGE: ${err.message}`));
    // });
  }
}

export default Context;
