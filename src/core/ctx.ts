import * as path from 'path';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { detect } from '../utils/git';
import { Argv, Branch } from '../types';

class Context {
  private config_file: string = './.skywalker.json';
  cwd: string = process.cwd();
  argv: Argv = yargs.argv;
  config?: { [key: string]: any };
  branch?: Branch;

  tasks: Function[] = [];

  constructor(){
    this.config = require(path.resolve(this.cwd, this.config_file));

    this.branch = detect();
    if ( !this.branch ){
      console.log(chalk.red('there is no available branch existed.'))
    }
  }

  registerTask = (task: Function) => {
    this.tasks.push(task);
  }

  // @ts-ignore
  registerTasks = (tasks: Function[]) => {
    tasks.forEach(task => {
      this.registerTask(task);
    });

    return this;
  }

  run = async () => {
    try {
      for (const task of this.tasks) {
        await task(this)
      };
    } catch(err) {
      console.log(chalk.red(`task excute failed, please check.\n${err.message}`));
    };
  }
}

export default Context;
