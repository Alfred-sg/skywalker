import { existsSync } from "fs";
import * as path from 'path';
import * as OssUtil from '../utils/oss';
import fsmap from '../utils/fsmap';
import Context from '../core/Context';

export default async (ctx: Context, options: any) => {
  if ( !options.accessKeyId || !options.accessKeySecret || !options.bucket ) {
    throw new Error(`oss config require accessKeyId, accessKeySecret and bucket, please check.`);
  };
  
  const client = OssUtil.config(options);
  try {
    client.getBucketInfo(options.bucket);
  } catch(err) {
    throw new Error(`bucket ${options.bucket} is not found.\nERROR MESSAGE: ${err.message}`);
  };

  const { deployDirectory } = ctx.argv;

  if ( !deployDirectory ) {
    throw new Error('argv deployDirectory is required, please check.');
  };

  const { dist = 'dist' } = ctx.argv;
  const dir = path.resolve(process.cwd(), dist);
  if ( !existsSync(dir) ) {
    throw new Error(`${dir} is not existed, please check.`);
  };

  const { gitBranch: { env, version }, argv: { deployVersion } } = ctx;
  // @ts-ignore
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
};
