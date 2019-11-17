"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git_1 = require("./utils/git");
var nodegit_1 = require("nodegit");
git_1.default.detect();
console.log(process.cwd());
nodegit_1.Repository.open(process.cwd())
    // Open the master branch.
    .then(function (repository) {
    console.log(repository.getCurrentBranch());
    return repository.getCurrentBranch();
})
    // Display information about commits on master.
    .then(function (firstCommitOnMaster) {
    console.log(firstCommitOnMaster);
});
