import * as topDebug from 'debug';
import Context from './Context';
import { Task } from './types';

const debug = topDebug('skywalker');

class TaskWalker {
  tasks: Task[];

  constructor(...tasks: Task[]){
    this.tasks = tasks;
  }

  register(...tasks: Task[]){
    debug('register tasks');

    (tasks || []).map(task => {
      this.tasks.push(task);
    });
    return this;
  }

  run(ctx: typeof Context){
    return this.tasks.forEach((task, index: number) => {
      debug(`sync execute task: stage ${index}`);
      return task(ctx);
    });
  }

  runAsync(ctx: typeof Context, onSuccess: Function){
    const exector = this.tasks.reduceRight((next, current, index) => {
      return async (ctx) => {
        debug(`async execute task: stage ${index}`);
        await current(ctx);
        return next(ctx);
      };
    }, () => {
      onSuccess && onSuccess();
    });

    exector(ctx);
  }
}

export default TaskWalker;
