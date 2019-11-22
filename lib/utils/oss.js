"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var path_1 = require("path");
var zlib = require("zlib");
var OSS = require("ali-oss");
var chalk = require("chalk");
// [OSS 文档](https://help.aliyun.com/document_detail/32068.html)
var client;
// 删除过时的文件 TODO
/**
* 创建 oss client
* @param {OssOptions} options 选项
*/
exports.config = function (options) {
    try {
        client = new OSS(options);
    }
    catch (err) {
        console.log(chalk.red("instantiate oss client failed, please check."), err);
    }
    ;
};
/**
* 校验 oss client 是否实例化
*/
var check = function () {
    if (!client) {
        throw new Error('before perform action on oss client, you should use OSSUtil.config to instantiate oss client.');
    }
    ;
};
/**
 * 上传文件元数据
 * https://help.aliyun.com/document_detail/111412.html?spm=a2c4g.11186623.6.1180.39611a45Oi3FxG
 * @param {string} path 文件路径
 */
var getMetaData = function (path) {
    var extName = path_1.extname(path).slice(1);
    var contentType;
    var contentEncoding;
    switch (extName) {
        case 'html':
            contentType = 'text/html';
            break;
        case 'jpeg':
        case 'gif':
        case 'png':
            contentType = "image/" + extName;
            break;
        case 'js':
            contentType = 'application/javascript';
            contentEncoding = 'gzip';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        default:
            contentType = "application/" + extName;
            contentEncoding = undefined;
    }
    return {
        headers: {
            'Content-Type': contentType,
            'Content-Encoding': contentEncoding,
        }
    };
};
/**
 * 校验文件是否存在
 * @param {string} object oss 文件地址
 */
exports.has = function (object) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var existed, result, status;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                check();
                existed = false;
                return [4 /*yield*/, client.get(object).catch(function (err) {
                        if (err.code === 'NoSuchKey') {
                            existed = false;
                        }
                        else {
                            console.log(err);
                        }
                        ;
                    })];
            case 1:
                result = _a.sent();
                status = result.res.status;
                if (status === 200) {
                    existed = true;
                }
                ;
                return [2 /*return*/, existed];
        }
    });
}); };
/**
 * 获取文件
 */
exports.get = function (object) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var result;
    return tslib_1.__generator(this, function (_a) {
        check();
        result = client.get(object).catch(function (err) {
            console.log(chalk.red(object + " is not existed, please check."), err);
        });
        return [2 /*return*/, result];
    });
}); };
/**
 * 查询 object 列表
 * @param {string} dir object 文件夹
 */
exports.list = function (dir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.list({
                    'prefix': dir,
                    'delimiter': '/',
                    'max-keys': ''
                }, {}).catch(function (err) {
                    console.log(err);
                })];
            case 1:
                result = _a.sent();
                ;
                return [2 /*return*/, result];
        }
    });
}); };
/**
 * 上传文件
 * 增量上传，上传前删除及检查 TODO
 * @param {string} object oss 文件地址
 * @param {string} localfile 本地文件地址
 */
exports.upload = function (object, localfile) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var metaData, headers, contentEncoding, result, gzip, inp, stream, status, name, url, nameChunks, fileName;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                check();
                metaData = getMetaData(localfile);
                headers = metaData.headers;
                contentEncoding = headers['Content-Encoding'];
                if (!(contentEncoding === 'gzip')) return [3 /*break*/, 2];
                gzip = zlib.createGzip();
                inp = fs.createReadStream(localfile);
                stream = inp.pipe(gzip);
                return [4 /*yield*/, client.putStream(object, stream, metaData).catch(function (err) {
                        console.log(chalk.red("upload " + localfile + " to oss failed, please check."), err);
                    })];
            case 1:
                // @ts-ignore
                result = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, client.put(object, localfile, metaData).catch(function (err) {
                    console.log(chalk.red("upload " + localfile + " to oss failed, please check."), err);
                })];
            case 3:
                result = _a.sent();
                _a.label = 4;
            case 4:
                ;
                status = result.res.status, name = result.name, url = result.url;
                if (status == 200) {
                    nameChunks = name.split('/');
                    fileName = nameChunks[nameChunks.length - 1];
                    console.log(chalk.green(fileName) + " upload successed, oss url is " + chalk.green(url));
                }
                return [2 /*return*/, result];
        }
    });
}); };
/**
 * 删除 object
 * @param {string} object oss 文件地址
 */
exports.del = function (object) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.delete(object).catch(function (err) {
                    console.log(err);
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
