"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var chalk = require("chalk");
;
/**
 * 构建
 * @param {Options} options 选项
 */
var build = function (_a) {
    var _b = (_a === void 0 ? {} : _a).npmClient, npmClient = _b === void 0 ? 'npm' : _b;
    console.log(chalk.blue('start to build.'));
    shell.exec(npmClient + " run build");
    console.log(chalk.blue('end to build.'));
};
exports.default = build;
