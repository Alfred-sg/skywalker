"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
;
/**
 * 构建
 * @param {Options} options 选项
 */
var build = function (_a) {
    var _b = (_a === void 0 ? {} : _a).npmClient, npmClient = _b === void 0 ? 'npm' : _b;
    shell.exec(npmClient + " run build");
};
exports.default = build;
