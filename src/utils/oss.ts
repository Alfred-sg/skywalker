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
    const { res: { status } } = result;
    if ( status == 200 ) {
      const nameChunks = result.name.split('/');
      const fileName = nameChunks[nameChunks.length - 1];
      // @ts-ignore // 忽略错误
      console.log(`${chalk.green(fileName)} upload successed, oss url is ${chalk.blue(result.url)}`);
    }
  } catch(err) {
    console.log(chalk.red(`upload ${localfile} to oss failed, please check.`));
    console.log(err);
    return;
  }

  return result;
}
