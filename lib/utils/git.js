"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var chalk = require("chalk");
// import { Repository } from 'nodegit';// https://www.nodegit.org/api/#Repository
var BranchReg = /((?:origin\/)?(daily|publish))\/([0-9\.]*)/;
/**
 * 将分支名解析成对象形式
 * @param {string} branch 分支名
 */
exports.parse = function (branch) {
    var matches = branch.match(BranchReg);
    if (matches) {
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
};
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
var getCurrentBranch = function () {
    var branches = getBranches();
    var branch = branches.find(function (branch) { return !!branch.current; });
    console.log("current branch is: " + chalk.green(branch && branch.name));
    return branch;
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
