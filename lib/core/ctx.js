"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
var chalk = require("chalk");
var git_1 = require("../utils/git");
var tasks_1 = require("../tasks");
var Context = /** @class */ (function () {
    function Context() {
        var _this = this;
        this.config_file = './.skywalker.js';
        this.cwd = process.cwd();
        this.argv = yargs.argv;
        this.config = {};
        this.preTasks = [];
        this.postTasks = [];
        /**
         * 检出有效分支，并与 master 分支比较，是否有冲突，TODO
         */
        this.detect = function () {
            var branchName = _this.argv.branchName;
            var branch = branchName ? git_1.parse(branchName) : git_1.detect();
            if (branch) {
                _this.branch = branch;
            }
            else {
                throw new Error('there is no available branch existed, please check.');
            }
            ;
            var name = branch.name, env = branch.env;
            if (env === 'publish') {
                var diff = git_1.diffToOriginMaster(name);
                if (diff) {
                    throw new Error("branch " + name + " is diffrence with origin/master, please merge or rebase.");
                }
                ;
            }
            ;
        };
        this.pre = function (task) {
            _this.preTasks.push(task);
            return _this;
        };
        this.post = function (task) {
            _this.postTasks.push(task);
            return _this;
        };
        this.excute = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var all_tasks, all_tasks_1, all_tasks_1_1, task, e_1_1, err_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        all_tasks = tslib_1.__spread([
                            this.detect
                        ], this.preTasks, [
                            tasks_1.buildTask.task
                        ], this.postTasks);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, , 11]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        all_tasks_1 = tslib_1.__values(all_tasks), all_tasks_1_1 = all_tasks_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!all_tasks_1_1.done) return [3 /*break*/, 6];
                        task = all_tasks_1_1.value;
                        return [4 /*yield*/, task(this)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        all_tasks_1_1 = all_tasks_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (all_tasks_1_1 && !all_tasks_1_1.done && (_a = all_tasks_1.return)) _a.call(all_tasks_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        ;
                        return [3 /*break*/, 11];
                    case 10:
                        err_1 = _b.sent();
                        console.log(chalk.red("task excute failed.\n" + err_1.message));
                        return [3 /*break*/, 11];
                    case 11:
                        ;
                        return [2 /*return*/];
                }
            });
        }); };
        var config_file_path = path.resolve(this.cwd, this.config_file);
        if (fs.existsSync(config_file_path)) {
            this.config = require(config_file_path);
        }
        ;
    }
    return Context;
}());
exports.default = Context;
