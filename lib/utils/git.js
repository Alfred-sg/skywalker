"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var exec_1 = require("./exec");
exports.default = {
    detect: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec_1.default('git branch -vv')];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    }); },
    checkout: function (branchName, newBranchFlag) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec_1.default("git checkout " + (newBranchFlag ? '-b ' : '') + branchName)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    createTempBranch: function (branchName, newBranchFlag) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec_1.default("git checkout " + (newBranchFlag ? '-b ' : '') + branchName)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
};
