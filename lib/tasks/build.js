"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var shell = require("shelljs"); // https://github.com/shelljs/shelljs
var chalk = require("chalk");
exports.default = {
    task: function (ctx) {
        /**
         * 构建
         * @param {Options} options 选项
         */
        // @ts-ignore
        var _a = ctx.config.npmClient, npmClient = _a === void 0 ? 'npm' : _a;
        var pkgPath = path.resolve(ctx.cwd, './package.json');
        if (!fs.existsSync(pkgPath)) {
            throw new Error('package.json is not existed, please check.');
        }
        ;
        var pkg = require(pkgPath);
        if (!pkg.scripts || !pkg.scripts.build) {
            throw new Error('there is no build script in package.json, please set.');
        }
        ;
        console.log(chalk.blue('start to build.'));
        var cmd = process.platform === 'win32' ? npmClient + '.cmd' : npmClient;
        try {
            shell.exec(cmd + " install");
            shell.exec(cmd + " run build");
        }
        catch (err) {
            throw new Error("build failed, " + err.message);
        }
        ;
        console.log(chalk.blue('end to build.'));
    }
};
