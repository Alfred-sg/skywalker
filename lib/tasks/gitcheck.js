"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git_1 = require("../utils/git");
exports.default = {
    /**
     * 校验是否与 master 分支有冲突
     * @param {object} ctx 上下文
     */
    pre: function (ctx) {
        // @ts-ignore
        var name = ctx.branch.name;
        var diff = git_1.diffToOriginMaster(name);
        if (diff) {
            throw new Error("branch " + name + " is diffrence with origin/master, please merge or rebase.");
        }
        ;
    }
};
