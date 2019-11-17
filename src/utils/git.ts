import exec from './exec';

export default {
  detect: async () => {
    const result = await exec('git branch -vv');
    console.log(result);
    return result;
  },
  checkout: async (branchName: string, newBranchFlag?: boolean) => {
    return await exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
  },
  createTempBranch: async (branchName: string, newBranchFlag?: boolean) => {
    return await exec(`git checkout ${newBranchFlag ? '-b ' : ''}${branchName}`);
  },
}