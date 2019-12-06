"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var git = require("../utils/git");
// import Context from '../core/ctx';
exports.default = {
    task: function () {
        /**
         * 构建
         * @param {Options} options 选项
         */
        console.log(chalk.blue('start to merge master.'));
        try {
            git.mergeMaster();
        }
        catch (err) {
            throw new Error("merge failed, " + err.message);
        }
        ;
        console.log(chalk.blue('end to merge master.'));
    }
};
