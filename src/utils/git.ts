import exec from './exec';

export default {
  detect: async () => {
    return await exec('git branch -v');
  },
  checkout: async (branchName: string, newBranchFlag?: boolean) => {
    return await exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
  },
  createTempBranch: async (branchName: string, newBranchFlag?: boolean) => {
    return await exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
  },
}