import { extname } from 'path';
import * as OSS from 'ali-oss';
import * as chalk from 'chalk';
import { OssOptions } from '../types';

// [OSS 文档](https://help.aliyun.com/document_detail/32068.html)
let client: OSS;

// 删除过时的文件 TODO

/**
* 创建 oss client
* @param {OssOptions} options 选项
*/
export const config = (options: OssOptions) => {
  try {
    client = new OSS(options);
  } catch(err) {
    console.log(chalk.red(`instantiate oss client failed, please check.`), err);
  };
};

/**
* 校验 oss client 是否实例化
*/
const check = () => {
  if ( !client ) {
    throw new Error('before perform action on oss client, you should use OSSUtil.config to instantiate oss client.');
  };
}

/**
 * 上传文件元数据
 * https://help.aliyun.com/document_detail/111412.html?spm=a2c4g.11186623.6.1180.39611a45Oi3FxG
 * @param {string} path 文件路径
 */
const getMetaData = (path: string) => {
  const extName = extname(path);
  let contentType: string;
  switch(extName) {
    case 'html':
      contentType = 'text/html';
      break;
    case 'jpeg':
    case 'gif':
    case 'png':
      contentType = `image/${extName}`;
      break;
    case 'js':
      contentType = 'application/javascript';
      break;
    default:
      contentType = `application/${extName}`;
  }

  return {
    headers: {
      'Content-Type': contentType,
      'Content-Encoding': 'gzip',
    }
  };
};

/**
 * 校验文件是否存在
 * @param {string} object oss 文件地址
 */
export const has = async (object: string) => {
  check();

  let existed: boolean = false;
  const result = await client.get(object).catch(err => {
    if ( err.code === 'NoSuchKey' ) {
      existed = false
    } else {
      console.log(err);
    };
  });

  // @ts-ignore // 忽略错误
  const { res: { status } } = result;
  if ( status === 200 ) {
    existed = true
  };

  return existed;
};

/**
 * 获取文件
 */
export const get = async (object: string) => {
  check();

  const result = client.get(object).catch(err => {
    console.log(chalk.red(`${object} is not existed, please check.`), err);
  });

  return result;
};

/**
 * 查询 object 列表
 * @param {string} dir object 文件夹
 */
export const list = async (dir: string) => {
  const result = await client.list({
    'prefix': dir,
    'delimiter': '/',
    'max-keys': ''
  }, {}).catch(err => {
    console.log(err);
  });;

  return result;
}

/**
 * 上传文件
 * 增量上传，上传前删除及检查 TODO
 * @param {string} object oss 文件地址
 * @param {string} localfile 本地文件地址
 */
export const upload = async (object: string, localfile: string) => {
  check();

  const result = await client.put(object, localfile, getMetaData(localfile)).catch(err => {
    console.log(chalk.red(`upload ${localfile} to oss failed, please check.`), err);
  });

  // @ts-ignore // 忽略错误
  const { res: { status }, name, url } = result;

  if ( status == 200 ) {
    const nameChunks = name.split('/');
    const fileName = nameChunks[nameChunks.length - 1];
    console.log(`${chalk.green(fileName)} upload successed, oss url is ${chalk.blue(url)}`);
  }

  return result;
};

/**
 * 删除 object
 * @param {string} object oss 文件地址
 */
export const del = async (object: string) => {
  const result = await client.delete(object).catch(err => {
    console.log(err);
  });

  return result;
};
