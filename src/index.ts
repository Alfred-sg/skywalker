import Context from './core/ctx';
import * as tasks from './tasks';

/**
 * 执行
 */
const deploy = () => {
  new Context().registerTasks([
    tasks.gitcheck.pre,
    tasks.build.task,
    tasks.oss.task,
  ]).run();
};

export default deploy;
