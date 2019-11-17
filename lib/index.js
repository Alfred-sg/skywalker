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
/**
 * 获取用户配置
 */
var getConfig = function () {
    var userConfig = require(path.resolve(process.cwd(), './.skywalker.json'));
    var _a = userConfig.pre, pre = _a === void 0 ? [] : _a, // lint、单测 TODO
    _b = userConfig.post, // lint、单测 TODO
    post = _b === void 0 ? [] : _b, oss = userConfig.oss, envMap = userConfig.envMap, _c = userConfig.dist, dist = _c === void 0 ? 'dist' : _c, npmClient = userConfig.npmClient;
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
        return false;
    }
    ;
    if (oss && !oss.accessKeyId) {
        console.error(chalk.red('oss accessKeyId is required, please check.'));
        return false;
    }
    ;
    if (oss && !oss.accessKeySecret) {
        console.error(chalk.red('oss accessKeySecret is required, please check.'));
        return false;
    }
    ;
    if (oss && !oss.bucket) {
        console.error(chalk.red('oss bucket is required, please check.'));
        return false;
    }
    ;
    return {
        pre: pre,
        post: post,
        oss: oss,
        envMap: envMap,
        dist: dist,
        npmClient: npmClient,
    };
};
/**
 * 执行
 */
var run = function () {
    var config = getConfig();
    if (config === false)
        return;
    var _a = config.pre, pre = _a === void 0 ? [] : _a, // lint、单测 TODO
    _b = config.post, // lint、单测 TODO
    post = _b === void 0 ? [] : _b, oss = config.oss, envMap = config.envMap, dist = config.dist, npmClient = config.npmClient;
    var branch = git_1.detect();
    if (!branch)
        return;
    var name = branch.name, env = branch.env, version = branch.version;
    // 与 master 分支对比
    pre.unshift([function () {
            if (env === 'daily') {
                var diff = git_1.diffToOriginMaster(name);
                if (diff) {
                    console.error(chalk.red("branch " + name + " is diffrence with origin/master, please merge or rebase."));
                    return false;
                }
                ;
            }
            ;
            return true;
        }, undefined]);
    // 生产环境与 master 分支对比 TODO
    if (oss && env && version) {
        post.push([function () {
                OssUtil.config(oss);
                var dir = path.resolve('./', dist);
                fsmap_1.default(dir, function (path) {
                    OssUtil.upload((envMap ? '/' + envMap[env] : '') + "/" + version + "/" + path, dir);
                });
            }, undefined]);
    }
    ;
    tslib_1.__spread(pre, [
        [tasks_1.build, { npmClient: npmClient }]
    ], post).reduce(function (prev, _a) {
        var _b = tslib_1.__read(_a, 2), task = _b[0], opts = _b[1];
        if (prev === false)
            return false;
        return task(tslib_1.__assign(tslib_1.__assign({}, opts), { branch: branch }));
    }, null);
};
exports.default = run;
