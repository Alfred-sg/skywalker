"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path = require("path");
var OssUtil = require("../utils/oss");
var fsmap_1 = require("../utils/fsmap");
exports.default = {
    name: 'oss',
    // task 和参数解析一并考虑 TODO
    /**
     * oss 上传
     * @param {Options} options 选项
     */
    check: function (ctx) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var oss, client, deployDirectory;
        return tslib_1.__generator(this, function (_a) {
            oss = ctx.config.oss;
            if (!oss || !oss.accessKeyId || !oss.accessKeySecret || !oss.bucket) {
                throw new Error("oss config require accessKeyId, accessKeySecret and bucket, please check.");
            }
            ;
            client = OssUtil.config(oss);
            try {
                client.getBucketInfo(oss.bucket);
            }
            catch (err) {
                throw new Error("bucket " + oss.bucket + " is not found.\nERROR MESSAGE: " + err.message);
            }
            ;
            deployDirectory = ctx.argv.deployDirectory;
            if (!deployDirectory) {
                throw new Error('argv deployDirectory is required, please check.');
            }
            ;
            return [2 /*return*/];
        });
    }); },
    run: function (ctx) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, deployDirectory, _b, dist, dir, branch, deployVersion, env, version, objectRoot, all_upload_tasks;
        return tslib_1.__generator(this, function (_c) {
            _a = ctx.argv, deployDirectory = _a.deployDirectory, _b = _a.dist, dist = _b === void 0 ? 'dist' : _b;
            dir = path.resolve(process.cwd(), dist);
            if (!fs_1.existsSync(dir)) {
                throw new Error(dir + " is not existed, please check.");
            }
            ;
            branch = ctx.branch, deployVersion = ctx.argv.deployVersion;
            env = branch.env, version = branch.version;
            objectRoot = "" + deployDirectory + (deployVersion ? '/' + deployVersion : version ? '/' + version : '');
            all_upload_tasks = [];
            fsmap_1.default(dir, function (paths, isDirectory) {
                if (isDirectory)
                    return;
                all_upload_tasks.push(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var object;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                object = objectRoot + "/" + paths.simplePath;
                                return [4 /*yield*/, OssUtil.upload(object, paths.path)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            return [2 /*return*/, Promise.all(all_upload_tasks.map(function (task) { return task(); }))];
        });
    }); }
};
