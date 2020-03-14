"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
/**
 * 构建
 */
exports.default = {
    name: 'build',
    check: function (ctx) {
        var pkgPath = path.resolve(ctx.cwd, './package.json');
        if (!fs.existsSync(pkgPath)) {
            throw new Error('package.json is not existed in project, please check.');
        }
        ;
        var pkg = require(pkgPath);
        if (!pkg.scripts || !pkg.scripts.build) {
            throw new Error('there is no build script in package.json, please set.');
        }
        ;
    },
    run: function (ctx) {
        // @ts-ignore
        var _a = ctx.config.npmClient, npmClient = _a === void 0 ? 'npm' : _a;
        var _b = ctx.argv, npmClientArgv = _b.npmClient, _c = _b.env, env = _c === void 0 ? 'prod' : _c;
        var realNpmClient = npmClientArgv || npmClient;
        var cmd = process.platform === 'win32' ? realNpmClient + '.cmd' : realNpmClient;
        shell.exec(cmd + " install");
        console.log("cross-env DEPLOY_ENV=" + env + " " + cmd + " run build");
        shell.exec("cross-env DEPLOY_ENV=" + env + " " + cmd + " run build");
    }
};
