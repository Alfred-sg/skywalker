import { existsSync } from "fs";
import * as path from 'path';
import * as OssUtil from '../utils/oss';
import fsmap from '../utils/fsmap';
import Context from '../core/ctx';

export default async (ctx: Context) => {

}


{
  name: 'oss',
  // task 和参数解析一并考虑 TODO
  /**
   * oss 上传
   * @param {Options} options 选项
   */
  check: async (ctx: Context) => {
    const { oss } = ctx.config;
    if ( !oss || !oss.accessKeyId || !oss.accessKeySecret || !oss.bucket ) {
      throw new Error(`oss config require accessKeyId, accessKeySecret and bucket, please check.`);
    };

    const client = OssUtil.config(oss);

    try {
      client.getBucketInfo(oss.bucket);
    } catch(err) {
      throw new Error(`bucket ${oss.bucket} is not found.\nERROR MESSAGE: ${err.message}`);
    };

    const { deployDirectory } = ctx.argv;

    if ( !deployDirectory ) {
      throw new Error('argv deployDirectory is required, please check.');
    };
  },
  run: async (ctx: Context) => {
    const { deployDirectory, dist = 'dist' } = ctx.argv;
    const dir = path.resolve(process.cwd(), dist);
    if ( !existsSync(dir) ) {
      throw new Error(`${dir} is not existed, please check.`);
    };

    const { branch, argv: { deployVersion } } = ctx;
    // @ts-ignore
    const { env, version } = branch;
    const objectRoot = `${deployDirectory}${deployVersion ? '/' + deployVersion : version ? '/' + version : ''}`;
    
    const all_upload_tasks: any[] = [];
    fsmap(dir, (paths, isDirectory) => {
      if ( isDirectory ) return;
      all_upload_tasks.push(async () => {
        const object = `${objectRoot}/${paths.simplePath}`;
        await OssUtil.upload(object, paths.path);
      });
    });

    return Promise.all(all_upload_tasks.map(task => task()));
  }
};
