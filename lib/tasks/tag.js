"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var chalk = require("chalk");
var git = require("../utils/git");
/**
 * 打 tag
 */
exports.default = {
    name: 'tag',
    check: function (ctx) {
        var pkgPath = path.resolve(ctx.cwd, './package.json');
        if (!fs.existsSync(pkgPath)) {
            throw new Error('package.json is not existed in project, please check.');
        }
        ;
    },
    run: function (ctx) {
        var _a = (ctx.branch || {}).name, name = _a === void 0 ? 'master' : _a;
        var _b = ctx.argv.deployEnv, deployEnv = _b === void 0 ? 'prod' : _b;
        if (deployEnv !== 'prod')
            return;
        // jenkins 环境下非 master 分支，先合并 master 分支
        if (name !== 'master') {
            try {
                console.log(chalk.blue('start to merge master before git tag'));
                git.mergeMaster();
                var conflict = git.detectConflict();
                if (conflict)
                    throw new Error(conflict);
            }
            catch (err) {
                throw err;
            }
            ;
        }
        var pkgPath = path.resolve(ctx.cwd, './package.json');
        var pkg = require(pkgPath);
        if (!pkg.version)
            return;
        try {
            console.log(chalk.blue('start to git tag'));
            git.tag(pkg.version);
        }
        catch (err) {
            throw err;
        }
        ;
    }
};
