"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 单层数据 merge TODO 多层、target 多个等
 * @param {object} source
 * @param target
 * @param keys
 */
exports.merge = function (source, target, keys) {
    if (!keys)
        keys = Object.keys(target);
    keys.forEach(function (key) {
        if (target[key])
            source[key] = target[key];
    });
    return source;
};
