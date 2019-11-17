"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git_1 = require("./utils/git");
var nodegit_1 = require("nodegit");
git_1.default.detect();
// https://www.nodegit.org/api/#Repository
nodegit_1.Repository.open(process.cwd())
    .then(function (repository) {
    return repository.getCurrentBranch();
})
    .then(function (branch) {
    console.log(branch.name());
});
