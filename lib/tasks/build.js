"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var chalk = require("chalk");
exports.default = {
    task: function (ctx) {
        /**
         * 构建
         * @param {Options} options 选项
         */
        // @ts-ignore
        var _a = ctx.config.npmClient, npmClient = _a === void 0 ? 'npm' : _a;
        console.log(chalk.blue('start to build.'));
        shell.exec(npmClient + " run build");
        console.log(chalk.blue('end to build.'));
    }
};
