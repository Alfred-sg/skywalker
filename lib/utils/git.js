"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
// import { Repository } from 'nodegit';// https://www.nodegit.org/api/#Repository
var BranchReg = /(daily|publish)\/([0-9\.]*)/;
/**
 * 获取本地分支列表
 */
var getBranches = function () {
    var stdout = shell.exec('git branch -vv', {
        silent: true
    });
    var branches = stdout.split('\n').filter(function (item) { return !!item; }).map(function (item) {
        var temp = item.split(/\s+/g).map(function (property) { return property.trim(); });
        var branch = {
            current: temp.shift() === '*',
            name: temp.shift() || '',
            hash: temp.shift() || '',
            message: temp.shift() || '',
            available: false,
        };
        var matches = branch.name.match(BranchReg);
        if (matches) {
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
var getCurrentBranch = function () {
    var branches = getBranches();
    return branches.find(function (branch) { return !!branch.current; });
};
/**
 * 检测变更后分支，暂时以当前分支替代 TODO
 */
exports.detect = function () {
    var branch = getCurrentBranch();
    if (!branch || !branch.available) {
        return;
    }
    ;
    return branch;
};
exports.checkout = function (branchName, newBranchFlag) {
    return shell.exec("git checkout " + (newBranchFlag ? '-b ' : '') + branchName);
};
exports.createTempBranch = function (branchName, newBranchFlag) {
    return shell.exec("git checkout " + (newBranchFlag ? '-b ' : '') + branchName);
};
exports.diffToOriginMaster = function (branchName) {
    return shell.exec("git diff " + branchName + " origin/master", {
        silent: true
    });
};
