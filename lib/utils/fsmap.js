"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
;
;
/**
 * 获取文件或文件夹映射
 * @param {string} path 目录名
 * @return {object} 文件映射
 */
function fsmap(path, callback, options) {
    if (options === void 0) { options = {}; }
    if (!options.root)
        options.root = path;
    var rootLength = options.root ? options.root.length : 0;
    var fsList = fs_1.readdirSync(path);
    fsList.map(function (fs) {
        var fsPath = path_1.resolve(path, fs);
        var simplePath = fsPath.slice(rootLength + 1);
        var paths = {
            path: fsPath.replace(/\\/g, '/'),
            simplePath: simplePath.replace(/\\/g, '/'),
        };
        var fsStat = fs_1.statSync(fsPath);
        if (fsStat.isDirectory()) {
            callback(paths, true);
            fsmap(fsPath, callback, options);
        }
        ;
        if (fsStat.isFile()) {
            callback(paths, false);
        }
        ;
    });
}
exports.default = fsmap;
;
