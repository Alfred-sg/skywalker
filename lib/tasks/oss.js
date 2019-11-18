"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var chalk = require("chalk");
var OssUtil = require("../utils/oss");
var fsmap_1 = require("../utils/fsmap");
;
// task 和参数解析一并考虑 TODO
/**
 * oss 上传
 * @param {Options} options 选项
 */
var oss = function (_a) {
    var oss = _a.oss, objectRoot = _a.objectRoot, _b = _a.dist, dist = _b === void 0 ? 'dist' : _b, envMap = _a.envMap, env = _a.env, version = _a.version;
    console.log(chalk.blue('start to update.'));
    OssUtil.config(oss);
    var dir = path.resolve(process.cwd(), dist);
    if (!fs_1.existsSync(dir)) {
        console.log(chalk.red(dir + " is not existed, please check."));
        return false;
    }
    fsmap_1.default(dir, function (paths) {
        var object = "" + objectRoot + (envMap && envMap[env] ? '/' + envMap[env] + '/' : '/') + version + "/" + paths.simplePath;
        OssUtil.upload(object, paths.path);
    });
    // 处理异步 TODO
    // console.log(chalk.blue('end to update.'));
    return true;
};
exports.default = oss;
