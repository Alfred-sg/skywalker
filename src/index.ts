import git from './utils/git';
import { Repository } from 'nodegit';

git.detect();

console.log(process.cwd())
Repository.open(process.cwd())
// Open the master branch.
.then(function(repository: Repository) {
  console.log(repository.getCurrentBranch())
  return repository.getCurrentBranch();
})
// Display information about commits on master.
.then(function(firstCommitOnMaster: any) {
  console.log(firstCommitOnMaster)
});