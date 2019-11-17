import OSS from 'ali-oss';
import * as chalk from 'chalk';

// [OSS 文档](https://help.aliyun.com/document_detail/32068.html)
interface OssOptions {
  region?: string,// bucket所在的区域， 默认oss-cn-hangzhou
  accessKeyId: string,// 通过阿里云控制台创建的AccessKey
  accessKeySecret: string,// 通过阿里云控制台创建的AccessSecret
  bucket: string,// 通过控制台或PutBucket创建的bucket
  secure?: boolean,// (secure: true)则使用HTTPS，(secure: false)则使用HTTP
  timeout?: string | number,// 超时时间，默认60
}

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
