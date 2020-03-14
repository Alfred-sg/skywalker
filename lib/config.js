"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var config_file = '../.skywalker.json';
var config_file_path = path.resolve(__dirname, config_file);
exports.setConfig = function (name, value) {
    var finalConfig;
    var temp = finalConfig = {};
    if (fs.existsSync(config_file_path)) {
        var config = require(config_file_path);
        temp = finalConfig = config;
    }
    ;
    var subNames = name.split('.');
    subNames.map(function (subName, index) {
        if (!temp[subName])
            temp[subName] = {};
        if (index == subNames.length - 1) {
            temp[subName] = value;
        }
        else {
            temp = temp[subName];
        }
    });
    fs.writeFileSync(config_file_path, JSON.stringify(finalConfig, null, 2));
};
exports.getConfig = function (name) {
    if (fs.existsSync(config_file_path)) {
        var config = require(config_file_path) || {};
        if (!name) {
            console.log(JSON.stringify(config, null, 2));
            return config;
        }
        var temp_1 = config;
        name.split('.').map(function (subName) {
            temp_1 = temp_1 ? temp_1[subName] : undefined;
        });
        console.log(JSON.stringify(temp_1, null, 2));
        return temp_1;
    }
    else {
        throw new Error("there is no " + config_file + " in skywalker, please set config.");
    }
};
