import Context from './core/ctx';
import * as tasks from './tasks';

/**
 * 执行
 */
const deploy = () => {
  new Context()//.pre(tasks.mergeMasterTask)
    .post(tasks.ossTask)
    .post(tasks.tagTask)
    .excute();
};

export default deploy;
