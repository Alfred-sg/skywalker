"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
var chalk = require("chalk");
var git_1 = require("../utils/git");
var tasks_1 = require("../tasks");
var config_1 = require("../config");
var ChatBot = require('dingtalk-robot-sender');
;
var Context = /** @class */ (function () {
    function Context() {
        var _this = this;
        this.cwd = process.cwd();
        this.argv = yargs.argv;
        this.config = config_1.getConfig();
        this.preTasks = [];
        this.buildinTasks = [tasks_1.buildTask];
        this.postTasks = [];
        /**
         * 检出有效分支，并与 master 分支比较，是否有冲突，TODO
         */
        this.detectDeployBranch = function () {
            var branch = git_1.detect();
            if (branch) {
                _this.branch = branch;
            }
            else {
                throw new Error('there is no available branch existed, please check.');
            }
            ;
            // const { name, env } = branch;
            //
            // if ( env === 'publish' ) {
            //   const diff = diffToOriginMaster(name);
            //   if ( diff ) {
            //     throw new Error(`branch ${name} is diffrence with origin/master, please merge or rebase.`);
            //   };
            // };
        };
        this.pre = function () {
            var tasks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tasks[_i] = arguments[_i];
            }
            (tasks || []).map(function (task) {
                _this.preTasks.push(task);
            });
            return _this;
        };
        this.post = function () {
            var tasks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tasks[_i] = arguments[_i];
            }
            (tasks || []).map(function (task) {
                _this.postTasks.push(task);
            });
            return _this;
        };
        this.excute = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var all_tasks, runCheck, runTasks, err_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        all_tasks = tslib_1.__spread(this.preTasks, this.buildinTasks, this.postTasks);
                        runCheck = all_tasks.reduce(function (prevCheck, current) {
                            if (current.check) {
                                return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var err_2;
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 5, , 6]);
                                                if (!prevCheck) return [3 /*break*/, 2];
                                                return [4 /*yield*/, prevCheck(this)];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                if (!current.check) return [3 /*break*/, 4];
                                                return [4 /*yield*/, current.check(this)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4: return [3 /*break*/, 6];
                                            case 5:
                                                err_2 = _a.sent();
                                                throw new Error(current.name + " task check failed.\nERROR MESSAGE: " + err_2.message);
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                }); };
                            }
                            ;
                            return prevCheck;
                        }, undefined);
                        runTasks = all_tasks.reduce(function (prevTasks, current) {
                            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var prevRes, res, err_3;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!prevTasks) return [3 /*break*/, 2];
                                            return [4 /*yield*/, prevTasks(this)];
                                        case 1:
                                            prevRes = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            console.log("" + chalk.blue(current.name + " task is started"));
                                            _a.label = 3;
                                        case 3:
                                            _a.trys.push([3, 5, , 6]);
                                            return [4 /*yield*/, current.run(this, prevRes)];
                                        case 4:
                                            res = _a.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            err_3 = _a.sent();
                                            throw new Error(current.name + " task excute failed.\nERROR MESSAGE: " + err_3.message);
                                        case 6:
                                            console.log("" + chalk.blue(current.name + " task is ended"));
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); };
                        }, undefined);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!runCheck) return [3 /*break*/, 3];
                        return [4 /*yield*/, runCheck(this)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!runTasks) return [3 /*break*/, 5];
                        return [4 /*yield*/, runTasks(this)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.sendToDingtalk();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.log(chalk.red(err_1.message));
                        this.sendToDingtalk(err_1);
                        return [3 /*break*/, 7];
                    case 7:
                        ;
                        return [2 /*return*/];
                }
            });
        }); };
        this.sendToDingtalk = function (err) {
            var _a = _this.argv.deployEnv, deployEnv = _a === void 0 ? 'prod' : _a;
            var project_config_file_path = path.resolve(process.cwd(), './.skywalker.json');
            if (!fs.existsSync(project_config_file_path))
                return;
            var projectConfig = require(project_config_file_path);
            var _b = projectConfig.dingtalk || {}, _c = _b.accessToken, accessToken = _c === void 0 ? '' : _c, _d = _b.secret, secret = _d === void 0 ? '' : _d, _e = _b.success, success = _e === void 0 ? {} : _e, _f = _b.error, error = _f === void 0 ? {} : _f, _g = _b.subscribe, subscribe = _g === void 0 ? undefined : _g;
            if (!accessToken || !secret)
                return;
            if (subscribe) {
                if (!subscribe.includes(deployEnv) && !subscribe.includes(!err ? 'success' : 'error')) {
                    return;
                }
            }
            var robot = new ChatBot({
                baseUrl: 'https://oapi.dingtalk.com/robot/send',
                accessToken: accessToken,
                // @ts-ignore
                secret: secret,
            });
            var projectName = _this.pkg && _this.pkg.name || '';
            var envName = " " + deployEnv + " \u73AF\u5883";
            var text = !err ? projectName + " \u9879\u76EE" + envName + "\u53D1\u5E03\u6210\u529F\uFF0C\u8BF7\u70B9\u51FB\u8BBF\u95EE" : projectName + " \u9879\u76EE" + envName + "\u53D1\u5E03\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF01\n\u9519\u8BEF\u5185\u5BB9\uFF1A" + err.message;
            var messageUrl = !err ? success && success[deployEnv] : error && error[deployEnv];
            robot.link({
                title: "发布日志",
                text: text,
                picUrl: "",
                messageUrl: messageUrl
            });
            // .catch((err: any) => {
            //   console.log(chalk.red(`send dingtalk message successed.\nERROR MESSAGE: ${err.message}`));
            // });
        };
        this.pkg = require(path.resolve(process.cwd(), './package.json'));
        this.config = config_1.getConfig();
        this.detectDeployBranch();
    }
    return Context;
}());
exports.default = Context;
