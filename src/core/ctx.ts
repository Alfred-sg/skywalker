import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect, diffToOriginMaster } from '../utils/git';
import { buildTask } from '../tasks';
import { Argv, Branch } from '../types';

class Context {
  private config_file: string = './.skywalker.js';
  cwd: string = process.cwd();
  argv: Argv = yargs.argv;
  config?: { [key: string]: any } = {};
  branch?: Branch;

  preTasks: Function[] = [];
  postTasks: Function[] = [];

  constructor(){
    const config_file_path = path.resolve(this.cwd, this.config_file);
    if ( fs.existsSync(config_file_path) ){
      this.config = require(config_file_path);
    };
  }

  /**
   * 检出有效分支，并与 master 分支比较，是否有冲突，TODO
   */
  detect = () => {
    const branch = detect();
    
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
    } catch(err) {
      console.log(chalk.red(`task excute failed.\n${err.message}`));
    };
  }
}

export default Context;
