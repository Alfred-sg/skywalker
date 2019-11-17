import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import * as chalk from 'chalk';
// import { Repository } from 'nodegit';// https://www.nodegit.org/api/#Repository

interface Branch {
  current?: boolean,
  name: string,
  hash: string,
  message: string,
  available: boolean,
  env?: string,
  version?: string,
};

const BranchReg = /(daily|publish)\/([0-9\.]*)/;

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
      branch.env = matches[1];
      branch.version = matches[2];
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
  return branches.find(branch => !!branch.current);
};

/**
 * 检测变更后分支，暂时以当前分支替代 TODO
 */
export const detect = () => {
  const branch = getCurrentBranch();
  if (!branch || !branch.available){
    console.log(chalk.red('there is no available branch existed, please check.'))
    return;
  };

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
