"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var yargs = require("yargs");
var chalk = require("chalk");
var git_1 = require("../utils/git");
var Context = /** @class */ (function () {
    function Context() {
        var _this = this;
        this.config_file = './.skywalker.json';
        this.cwd = process.cwd();
        this.argv = yargs.argv;
        this.tasks = [];
        this.registerTask = function (task) {
            _this.tasks.push(task);
        };
        // @ts-ignore
        this.registerTasks = function (tasks) {
            tasks.forEach(function (task) {
                _this.registerTask(task);
            });
            return _this;
        };
        this.run = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, task, e_1_1, err_1;
            var e_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 9, , 10]);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = tslib_1.__values(this.tasks), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        task = _b.value;
                        return [4 /*yield*/, task(this)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        ;
                        return [3 /*break*/, 10];
                    case 9:
                        err_1 = _d.sent();
                        console.log(chalk.red("task excute failed, please check.\n" + err_1.message));
                        return [3 /*break*/, 10];
                    case 10:
                        ;
                        return [2 /*return*/];
                }
            });
        }); };
        this.config = require(path.resolve(this.cwd, this.config_file));
        this.branch = git_1.detect();
        if (!this.branch) {
            console.log(chalk.red('there is no avliable branch existed.'));
        }
    }
    return Context;
}());
exports.default = Context;
