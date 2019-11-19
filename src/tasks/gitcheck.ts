import { diffToOriginMaster } from '../utils/git';
import Context from '../core/ctx';

export default {
  /**
   * 校验是否与 master 分支有冲突
   * @param {object} ctx 上下文
   */
  pre: (ctx: Context) => {
    // @ts-ignore
    const { name } = ctx.branch;
    
    const diff = diffToOriginMaster(name);
    if ( diff ) {
      throw new Error(`branch ${name} is diffrence with origin/master, please merge or rebase.`);
    };
  }
}