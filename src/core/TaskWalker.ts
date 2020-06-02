import Context from './Context';

type Task = ((ctx: typeof Context) => void) | ((ctx: typeof Context) => Promise<any>);

class TaskWalker {
  tasks: Task[];

  register(...tasks: Task[]){
    (tasks || []).map(task => {
      this.tasks.push(task);
    });
    return this;
  }

  run(ctx: typeof Context){
    return this.tasks.forEach(task => {
      return task(ctx)
    });
  }

  runAsync(ctx: typeof Context, onSuccess: Function){
    const exector = this.tasks.reduceRight((next, current) => {
      return async (ctx) => {
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
