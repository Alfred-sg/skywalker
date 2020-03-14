import debugBuilder from 'debug';// https://github.com/visionmedia/debug
import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import * as execa from 'execa';
import * as chalk from 'chalk';
import { Branch } from '../types';
// import { Repository } from 'nodegit';// https://www.nodegit.org/api/#Repository

const debug = debugBuilder('git');

const BranchReg = /((?:origin\/)?(daily|publish))\/([0-9\.]*)/;

/**
 * 将分支名解析成对象形式
 * @param {string} branch 分支名
 */
export const parse = (branch: string) => {
  const matches = branch.match(BranchReg);
  if ( matches ) {
    return {
      name: matches[0],
      env: matches[2],
      isRemote: matches[1].indexOf('origin') === 0,
      version: matches[3],
    };
  }

  return {
    name: branch,
  };
}

/**
 * 获取本地分支列表
 */
const getBranches = () => {
  const stdout: string = shell.exec('git branch -vv', {
    silent: true
  });

  const branches = stdout.split('\n').filter(item => !!item).map((item: string) => {
    const temp = item.split(/\s+/g).map((property: string) => property.trim());
    const branch: Branch = {
      current: temp.shift() === '*',
      name: temp.shift() || '',
      hash: temp.shift() || '',
      message: temp.shift() || '',
      available: false,
    };

    const matches = branch.name.match(BranchReg);
    if ( matches ) {
      branch.available = true;
      branch.isRemote = matches[1].indexOf('origin') === 0,
      branch.env = matches[2];
      branch.version = matches[3];
    }

    return branch;
  });

  return branches;
};

/**
 * 获取当前分支
 */
const getCurrentBranch = () => {
  const branches = getBranches();
  const branch = branches.find(branch => !!branch.current);

  console.log(`current branch is: ${chalk.green(branch && branch.name)}`);
  return branch;
};

/**
 * 检测变更后分支，暂时以当前分支替代 TODO
 */
export const detect = () => {
  const branch = getCurrentBranch();
  // if (!branch || !branch.available){
  //   return;
  // };

  return branch;
};

export const checkout = (branchName: string, newBranchFlag?: boolean) => {
  return shell.exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
};

export const createTempBranch = (branchName: string, newBranchFlag?: boolean) => {
  return shell.exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
};

export const diffToOriginMaster = (branchName: string) => {
  return shell.exec(`git diff ${branchName} origin/master`, {
    silent: true
  });
};

/**
 * 合并 master 分支
 */
export const mergeMaster = () => {
  return shell.exec(`git merge origin/master`, {
    silent: true
  });
};

// Git 奇技淫巧：https://github.com/521xueweihan/git-tips

/**
 * @todo 查看冲突文件列表
 */
export const detectConflict = () => {
  // 查看冲突文件列表
  const cmd = `git diff --name-only --diff-filter=U`;

  const { stdout, stderr } = execa.commandSync(cmd);

  if (stderr){
    console.log(`detect conflict failed: ${chalk.red(stderr)}`);
  };

  return stdout;
}

/**
 * 删除已经合并到 master 的分支
 */
export const deleteUseless = () => {
  return shell.exec(`git branch --merged master | grep -v '^\*\|  master' | xargs -n 1 git branch -d`, {
    silent: true
  });
}

/**
 * 获取最后提交的 git 本地分支
 */
export const detectLocalLatestBranch = () => {
  // 以最后提交的顺序列出所有 git 分支
  const cmd = `git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/`;

  debug('begin to detect latest changed branch.');

  const { stdout, stderr } = execa.commandSync(cmd);

  if (stderr){
    console.log(`get latest changed branch failed: ${chalk.red(stderr)}`);
  };

  const branches = stdout.split(/\r|\n/).map(branch => branch.replace(/(^\')|(\'$)/g, ''));

  debug(`latest changed branch is: ${branches}`);

  const latestBranch = branches[0];

  console.log(`latest changed branch is: ${chalk.green(latestBranch)}`);

  return latestBranch;
};
