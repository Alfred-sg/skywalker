"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
/**
 * 获取文件或文件夹映射
 * @param {string} path 目录名
 * @return {object} 文件映射
 */
function fsmap(path, callback) {
    if (!fs_1.existsSync(path))
        return;
    var fsList = fs_1.readdirSync(path);
    fsList.map(function (fs) {
        var fsPath = path_1.resolve(path, fs);
        var fsStat = fs_1.statSync(fsPath);
        if (fsStat.isDirectory()) {
            callback(fsPath, true);
            fsmap(fsPath, callback);
        }
        ;
        if (fsStat.isFile()) {
            callback(fsPath, false);
        }
        ;
    });
}
exports.default = fsmap;
;
