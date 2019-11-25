"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path = require("path");
var chalk = require("chalk");
var OssUtil = require("../utils/oss");
var fsmap_1 = require("../utils/fsmap");
var utils_1 = require("../utils");
var resolve = function (ctx) {
    // @ts-ignore
    var _a = ctx.config, ossConfig = _a.oss, _b = _a.dist, dist = _b === void 0 ? 'dist' : _b;
    var objectRootConfig = (ossConfig || {}).objectRoot;
    var _c = ctx.argv, region = _c.region, accessKeyId = _c.accessKeyId, accessKeySecret = _c.accessKeySecret, bucket = _c.bucket, objectRoot = _c.objectRoot, deployVersion = _c.deployVersion, argvDist = _c.dist;
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
        deployVersion: deployVersion,
        dist: argvDist || dist,
    };
};
exports.default = {
    // task 和参数解析一并考虑 TODO
    /**
     * oss 上传
     * @param {Options} options 选项
     */
    task: function (ctx) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var branch, env, version, _a, oss, objectRoot, deployVersion, dist, objectPrefix, dir, all_upload_tasks;
        return tslib_1.__generator(this, function (_b) {
            branch = ctx.branch;
            env = branch.env, version = branch.version;
            _a = resolve(ctx), oss = _a.oss, objectRoot = _a.objectRoot, deployVersion = _a.deployVersion, dist = _a.dist;
            console.log(deployVersion);
            console.log(chalk.blue('start to update.'));
            OssUtil.config(oss);
            objectPrefix = objectRoot + "/" + (deployVersion ? deployVersion : version);
            dir = path.resolve(process.cwd(), dist);
            // 打包文件不存在，报错
            if (!fs_1.existsSync(dir)) {
                throw new Error(dir + " is not existed, please check.");
            }
            ;
            all_upload_tasks = [];
            fsmap_1.default(dir, function (paths, isDirectory) {
                if (isDirectory)
                    return;
                all_upload_tasks.push(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var object;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                object = objectPrefix + "/" + paths.simplePath;
                                return [4 /*yield*/, OssUtil.upload(object, paths.path)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            Promise.all(all_upload_tasks.map(function (task) { return task(); })).then(function () {
                console.log(chalk.blue('end to update.'));
            });
            return [2 /*return*/];
        });
    }); }
};
