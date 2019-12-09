import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as crypto from 'crypto';
import axios from "axios";
import { parse, detect, diffToOriginMaster } from '../utils/git';
import { buildTask } from '../tasks';
import { Argv } from '../types';

interface Branch {
  current?: boolean,
  name: string,
  env?: string,
  version?: string,
};

class Context {
  private pkg?: { [key: string]: any };
  private config_file: string = './.skywalker.js';
  cwd: string = process.cwd();
  argv: Argv = yargs.argv;
  config?: { [key: string]: any } = {};
  branch?: Branch;

  preTasks: Function[] = [];
  postTasks: Function[] = [];

  constructor(){
    this.pkg = require(path.resolve(process.cwd(), './package.json'));
    const config_file_path = path.resolve(this.cwd, this.config_file);
    if ( fs.existsSync(config_file_path) ){
      this.config = require(config_file_path);
    };
  }

  /**
   * 检出有效分支，并与 master 分支比较，是否有冲突，TODO
   */
  detect = () => {
    const { branchName: branchName } = this.argv;
    const branch = branchName ? parse(branchName) : detect();

    if ( branch ) {
      this.branch = branch;
    } else {
      throw new Error('there is no available branch existed, please check.');
    };

    const { name, env } = branch;

    if ( env === 'publish' ) {
      const diff = diffToOriginMaster(name);
      if ( diff ) {
        throw new Error(`branch ${name} is diffrence with origin/master, please merge or rebase.`);
      };
    };
  }

  pre = (task: Function) => {
    this.preTasks.push(task);
    return this;
  }

  post = (task: Function) => {
    this.postTasks.push(task);
    return this;
  }

  excute = async () => {
    const all_tasks = [
      this.detect,
      ...this.preTasks,
      buildTask.task,
      ...this.postTasks
    ];

    try {
      for (const task of all_tasks) {
        await task(this)
      };

      this.sendToDingtalk(true);
    } catch(err) {
      console.log(chalk.red(`task excute failed.\n${err.message}`));
      this.sendToDingtalk(false);
    };
  }

  sendToDingtalk = (success: boolean) => {
    const { dingtalkAccessToken, dingtalkSecret } = this.argv;
    if (!this.pkg || !this.branch || !dingtalkAccessToken || !dingtalkSecret) return;
    const { name: branchName } = this.branch;

    const baseUrl = 'https://oapi.dingtalk.com/robot/send';
    const access_token = dingtalkAccessToken;
    const secret = dingtalkSecret;
    const timestamp = Date.now();
    const sign = crypto.createHmac('sha256', secret)
      .update(timestamp + '\n' + secret)
      .digest().toString('base64');
    const url = `${baseUrl}?access_token=${access_token}&timestamp=${timestamp}&sign=${sign}`;

    axios.request({
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        msgtype: "markdown",
        markdown: {
          "title": `deploy log`,
          "text": `
#### ${this.pkg.name}:${branchName} deploy ${success ? 'successed' : 'failed'}.
          `
        },
        at: {}
      })
    }).then(res => {
      console.log(res.data);
    });
  }
}

export default Context;
