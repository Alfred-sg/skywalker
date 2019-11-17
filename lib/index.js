"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var yargs = require("yargs");
var chalk = require("chalk");
var git_1 = require("./utils/git");
var OssUtil = require("./utils/oss");
var fsmap_1 = require("./utils/fsmap");
var tasks_1 = require("./tasks");
;
;
var argv = yargs.argv;
var getConfig = function () {
    var userConfig = require(path.resolve(process.cwd(), './.skywalker.json'));
    var _a = userConfig.pre, pre = _a === void 0 ? [] : _a, // lint、单测 TODO
    _b = userConfig.post, // lint、单测 TODO
    post = _b === void 0 ? [] : _b, oss = userConfig.oss, _c = userConfig.dist, dist = _c === void 0 ? 'dist' : _c, npmClient = userConfig.npmClient;
    var region = argv.region, accessKeyId = argv.accessKeyId, accessKeySecret = argv.accessKeySecret, bucket = argv.bucket;
    // 通过 cli 配置
    if (region || accessKeyId || accessKeySecret || bucket) {
        if (!oss)
            oss = {
                accessKeyId: '',
                accessKeySecret: '',
                bucket: '',
            };
        if (oss && region)
            oss.region = region;
        if (oss && accessKeyId)
            oss.accessKeyId = accessKeyId;
        if (oss && accessKeySecret)
            oss.accessKeySecret = accessKeySecret;
        if (oss && bucket)
            oss.bucket = bucket;
    }
    ;
    if (oss && !oss.region) {
        console.error(chalk.red('oss region is required, please check.'));
    }
    ;
    if (oss && !oss.accessKeyId) {
        console.error(chalk.red('oss accessKeyId is required, please check.'));
    }
    ;
    if (oss && !oss.accessKeySecret) {
        console.error(chalk.red('oss accessKeySecret is required, please check.'));
    }
    ;
    if (oss && !oss.bucket) {
        console.error(chalk.red('oss bucket is required, please check.'));
    }
    ;
    return {
        pre: pre,
        post: post,
        oss: oss,
        dist: dist,
        npmClient: npmClient,
    };
};
var run = function () {
    var _a = getConfig(), _b = _a.pre, pre = _b === void 0 ? [] : _b, // lint、单测 TODO
    _c = _a.post, // lint、单测 TODO
    post = _c === void 0 ? [] : _c, oss = _a.oss, dist = _a.dist, npmClient = _a.npmClient;
    var branch = git_1.detect();
    if (!branch)
        return;
    var env = branch.env, version = branch.version;
    // 生产环境与 master 分支对比 TODO
    if (oss) {
        post.push([function () {
                OssUtil.config(oss);
                var dir = path.resolve('./', dist);
                fsmap_1.default(dir, function (path) {
                    OssUtil.upload("/" + env + "/" + version + "/" + path, dir);
                });
            }, undefined]);
    }
    ;
    tslib_1.__spread(pre, [
        [tasks_1.build, { npmClient: npmClient }]
    ], post).forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), task = _b[0], opts = _b[1];
        task(tslib_1.__assign(tslib_1.__assign({}, opts), { branch: branch }));
    });
};
exports.default = run;
