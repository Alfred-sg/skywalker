export interface OssOptions {
  region?: string,// bucket所在的区域， 默认oss-cn-hangzhou
  accessKeyId: string,// 通过阿里云控制台创建的AccessKey
  accessKeySecret: string,// 通过阿里云控制台创建的AccessSecret
  bucket: string,// 通过控制台或PutBucket创建的bucket
  secure?: boolean,// (secure: true)则使用HTTPS，(secure: false)则使用HTTP
  timeout?: string | number,// 超时时间，默认60
};

export interface OssConfig extends OssOptions {
  objectRoot?: string,
};

export interface Branch {
  current?: boolean,
  name: string,
  hash: string,
  message: string,
  available: boolean,
  env?: string,
  version?: string,
  isRemote?: boolean,
};

export interface Argv {
  [key: string]: any;
  _: string[];
  $0: string;
}

export interface UserConfig {
  pre?: (ctx: Context) => {}[],// lint、单测 TODO
  post?: (ctx: Context) => {}[],
  oss?: OssConfig,
  envMap?: { [key: string]: string },
  dist?: string,
  npmClient?: 'npm' | 'cnpm' | 'tnpm' | 'yarn',
};

export interface Context {
  config_file: string;
  cwd: string;
  argv: Argv;
  config: { [key: string]: any };
  branch: Branch;
}
