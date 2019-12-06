const Git = require("nodegit");

Git.Repository.open(process.cwd())
  // Open the master branch.
  .then(function(repo) {
    console.log(repo)
    return repo.getCurrentBranch();
  }).then(function(a){
    console.log(a);
  })
