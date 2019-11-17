import git from './utils/git';
import { Repository } from 'nodegit';

git.detect();

// https://www.nodegit.org/api/#Repository
Repository.open(process.cwd())
.then(function(repository: Repository) {
  return repository.getCurrentBranch();
})
.then(function(branch: any) {
  console.log(branch.name())
});