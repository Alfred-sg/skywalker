import * as chalk from 'chalk';
import * as git from '../utils/git';
// import Context from '../core/ctx';

export default {
  task: () => {
    /**
     * 构建
     * @param {Options} options 选项
     */
    console.log(chalk.blue('start to merge master.'));

    try {
      git.mergeMaster();
      const conflict = git.detectConflict();
      if (conflict) throw new Error(conflict);
    } catch(err) {
      throw new Error(`merge failed or conflict with master branch, ${err.message}`);
    };

    console.log(chalk.blue('end to merge master.'))
  }
};
