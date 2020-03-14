"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git = require("../utils/git");
// import Context from '../core/ctx';
/**
 * 禁用
 */
exports.default = {
    name: 'merge-master',
    run: function () {
        /**
         * 构建
         * @param {Options} options 选项
         */
        return new Promise(function (resolve) {
            try {
                git.mergeMaster();
                var conflict = git.detectConflict();
                if (conflict)
                    throw new Error(conflict);
            }
            catch (err) {
                throw new Error("merge failed or conflict with master branch, " + err.message);
            }
            ;
            resolve();
        });
    }
};
