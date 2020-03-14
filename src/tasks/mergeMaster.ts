import * as git from '../utils/git';
// import Context from '../core/ctx';

/**
 * 禁用
 */
export default {
  name: 'merge-master',
  run: () => {
    /**
     * 构建
     * @param {Options} options 选项
     */
    return new Promise((resolve) => {
      try {
        git.mergeMaster();
        const conflict = git.detectConflict();
        if (conflict) throw new Error(conflict);
      } catch(err) {
        throw new Error(`merge failed or conflict with master branch, ${err.message}`);
      };
  
      resolve();
    })
  }
};
