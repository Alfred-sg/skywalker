"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs");
/**
 * 执行 shell 脚本
 * @param {string} command shell 命令
 */
exports.default = (function (command) {
    return new Promise(function (resolve, reject) {
        shell.exec(command, function (code, stdout, stderr) {
            if (stderr) {
                reject(stderr);
            }
            else {
                resolve({
                    code: code,
                    stdout: stdout
                });
            }
            ;
        });
    });
});
