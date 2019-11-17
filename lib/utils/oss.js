"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var OSS = require("ali-oss");
var chalk = require("chalk");
// [OSS 文档](https://help.aliyun.com/document_detail/32068.html)
var client;
/**
* 创建 oss client
* @param {OssOptions} options 选项
*/
exports.config = function (options) {
    client = new OSS(options);
};
/**
 * 上传文件
 * 增量上传，上传前删除及检查 TODO
 * @param {string} object oss 文件地址
 * @param {string} localfile 本地文件地址
 */
exports.upload = function (object, localfile) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!client) {
                    console.log(chalk.red('before perform action on oss client, you should use OSSUtil.config to instantiate oss client.'));
                    return [2 /*return*/];
                }
                ;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.put(object, localfile)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(chalk.red("upload " + localfile + " to oss failed, please check."));
                return [2 /*return*/];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
