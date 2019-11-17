import * as OSS from 'ali-oss';
import * as chalk from 'chalk';
import { OssOptions } from '../types';

// [OSS 文档](https://help.aliyun.com/document_detail/32068.html)
let client: OSS;

/**
* 创建 oss client
* @param {OssOptions} options 选项
*/
export const config = (options: OssOptions) => {
  client = new OSS(options);
};

/**
 * 上传文件
 * 增量上传，上传前删除及检查 TODO
 * @param {string} object oss 文件地址
 * @param {string} localfile 本地文件地址
 */
export const upload = async (object: string, localfile: string) => {
  if (!client){
    console.log(chalk.red('before perform action on oss client, you should use OSSUtil.config to instantiate oss client.'));
    return;
  };

  let result;
  try {
    result = await client.put(object, localfile);
  } catch(err) {
    console.log(chalk.red(`upload ${localfile} to oss failed, please check.`));
    return;
  }

  return result;
}
