export interface OssOptions {
  region?: string,// bucket所在的区域， 默认oss-cn-hangzhou
  accessKeyId: string,// 通过阿里云控制台创建的AccessKey
  accessKeySecret: string,// 通过阿里云控制台创建的AccessSecret
  bucket: string,// 通过控制台或PutBucket创建的bucket
  secure?: boolean,// (secure: true)则使用HTTPS，(secure: false)则使用HTTP
  timeout?: string | number,// 超时时间，默认60
};