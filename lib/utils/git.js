"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("debug"); // https://github.com/visionmedia/debug
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var execa = require("execa");
var chalk = require("chalk");
// import { Repository } from 'nodegit';// https://www.nodegit.org/api/#Repository
var debug = debug_1.default('git');
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
        var temp = (item.match(/(\(.*\))|(\[.*\])|([^\s\[\]\(\)]*)/g) || [])
            .filter(function (item) { return !!item; });
        var current = temp[0] === '*';
        temp = temp.filter(function (item, index) { return !(item == '*' && !index); });
        var branch = {
            current: current,
            name: temp[0],
            hash: temp[1],
            origin: temp[2].indexOf('[origin') !== -1 ? temp[2] : undefined,
            message: temp[2].indexOf('[origin') !== -1 ? temp[3] : temp[2],
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
    // if (!branch || !branch.available){
    //   return;
    // };
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
/**
 * 合并 master 分支
 */
exports.mergeMaster = function () {
    return shell.exec("git merge origin/master", {
        silent: true
    });
};
// Git 奇技淫巧：https://github.com/521xueweihan/git-tips
/**
 * @todo 查看冲突文件列表
 */
exports.detectConflict = function () {
    // 查看冲突文件列表
    var cmd = "git diff --name-only --diff-filter=U";
    var _a = execa.commandSync(cmd), stdout = _a.stdout, stderr = _a.stderr;
    if (stderr) {
        console.log("detect conflict failed: " + chalk.red(stderr));
    }
    ;
    return stdout;
};
/**
 * 删除已经合并到 master 的分支
 */
exports.deleteUseless = function () {
    return shell.exec("git branch --merged master | grep -v '^*|  master' | xargs -n 1 git branch -d", {
        silent: true
    });
};
/**
 * 获取最后提交的 git 本地分支
 */
exports.detectLocalLatestBranch = function () {
    // 以最后提交的顺序列出所有 git 分支
    var cmd = "git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/";
    debug('begin to detect latest changed branch.');
    var _a = execa.commandSync(cmd), stdout = _a.stdout, stderr = _a.stderr;
    if (stderr) {
        console.log("get latest changed branch failed: " + chalk.red(stderr));
    }
    ;
    var branches = stdout.split(/\r|\n/).map(function (branch) { return branch.replace(/(^\')|(\'$)/g, ''); });
    debug("latest changed branch is: " + branches);
    var latestBranch = branches[0];
    console.log("latest changed branch is: " + chalk.green(latestBranch));
    return latestBranch;
};
/**
 * 打 tag
 * @param version 版本号
 */
exports.tag = function (version) {
    shell.exec("git tag publish/" + version);
    shell.exec("git push origin publish/" + version + ":publish/" + version);
};
