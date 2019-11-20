"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var chalk = require("chalk");
var OssUtil = require("../utils/oss");
var fsmap_1 = require("../utils/fsmap");
var utils_1 = require("../utils");
var resolve = function (ctx) {
    // @ts-ignore
    var _a = ctx.config, ossConfig = _a.oss, envMap = _a.envMap, _b = _a.dist, dist = _b === void 0 ? 'dist' : _b;
    var objectRootConfig = (ossConfig || {}).objectRoot;
    var _c = ctx.argv, region = _c.region, accessKeyId = _c.accessKeyId, accessKeySecret = _c.accessKeySecret, bucket = _c.bucket, objectRoot = _c.objectRoot, argvDist = _c.dist;
    // 通过 cli 配置
    var oss = {
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
    };
    var ossKeys = ['region', 'accessKeyId', 'accessKeySecret', 'bucket'];
    if (ossConfig) {
        oss = utils_1.merge(oss, ossConfig, ossKeys);
    }
    if (region || accessKeyId || accessKeySecret || bucket) {
        oss = utils_1.merge(oss, {
            region: region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: bucket,
        }, ossKeys);
    }
    ;
    if (!oss.region) {
        throw new Error(chalk.red('oss region is required, please check.'));
    }
    ;
    if (!oss.accessKeyId) {
        throw new Error('oss accessKeyId is required, please check.');
    }
    ;
    if (oss && !oss.accessKeySecret) {
        throw new Error('oss accessKeySecret is required, please check.');
    }
    ;
    if (oss && !oss.bucket) {
        throw new Error('oss bucket is required, please check.');
    }
    ;
    return {
        oss: oss,
        objectRoot: objectRoot || objectRootConfig,
        envMap: envMap,
        dist: argvDist || dist,
    };
};
exports.default = {
    // task 和参数解析一并考虑 TODO
    /**
     * oss 上传
     * @param {Options} options 选项
     */
    task: function (ctx) {
        var branch = ctx.branch;
        // @ts-ignore
        var env = branch.env, version = branch.version;
        var _a = resolve(ctx), oss = _a.oss, objectRoot = _a.objectRoot, envMap = _a.envMap, dist = _a.dist;
        console.log(chalk.blue('start to update.'));
        OssUtil.config(oss);
        var objectPrefix = "" + objectRoot + (envMap && env && envMap[env] ? '/' + envMap[env] + '/' : '/') + version;
        var dir = path.resolve(process.cwd(), dist);
        // 打包文件不存在，报错
        if (!fs_1.existsSync(dir)) {
            throw new Error(dir + " is not existed, please check.");
        }
        ;
        fsmap_1.default(dir, function (paths) {
            var object = objectPrefix + "/" + paths.simplePath;
            OssUtil.upload(object, paths.path);
        });
        // 处理异步 TODO
        // console.log(chalk.blue('end to update.'));
        return true;
    }
};
