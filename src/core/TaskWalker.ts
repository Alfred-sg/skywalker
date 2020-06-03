import * as topDebug from 'debug';
import Context from './Context';
import { Task } from './types';

const debug = topDebug('skywalker');

class TaskWalker {
  tasks: { task: Task, options: any }[];

  constructor(...tasks: { task: Task, options: any }[]){
    this.tasks = tasks;
  }

  register(...tasks: { task: Task, options: any }[]){
    debug('register tasks');

    (tasks || []).map(task => {
      this.tasks.push(task);
    });
    return this;
  }

  run(ctx: Context){
    return this.tasks.forEach(({ task, options }, index: number) => {
      debug(`sync execute task: stage ${index}`);
      return task(ctx, options);
    });
  }

  runAsync(ctx: Context, onSuccess: Function){
    const exector = this.tasks.reduceRight((next, { task, options }, index) => {
      return async (ctx) => {
        debug(`async execute task: stage ${index}`);
        await task(ctx, options);
        return next(ctx);
      };
    }, () => {
      onSuccess && onSuccess();
    });

    exector(ctx);
  }
}

export default TaskWalker;
