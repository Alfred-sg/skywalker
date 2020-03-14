"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ctx_1 = require("./core/ctx");
var tasks = require("./tasks");
/**
 * 执行
 */
var deploy = function () {
    new ctx_1.default() //.pre(tasks.mergeMasterTask)
        .post(tasks.ossTask).excute();
};
exports.default = deploy;
