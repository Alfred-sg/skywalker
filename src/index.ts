import Context from './core/ctx';
import * as tasks from './tasks';

/**
 * 执行
 */
const deploy = () => {
  new Context().pre(
    tasks.mergeMasterTask.task
  ).post(
    tasks.ossTask.task
  ).excute();
};

export default deploy;
