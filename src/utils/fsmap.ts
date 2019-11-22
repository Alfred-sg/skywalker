import { readdirSync, statSync } from "fs";
import { resolve,  } from "path";

interface Callback {
  (paths: { path: string, simplePath: string }, isDir: boolean): unknown;
};

interface Options {
  root?: string,
};

/**
 * 获取文件或文件夹映射
 * @param {string} path 目录名
 * @return {object} 文件映射
 */
export default function fsmap(path: string, callback: Callback, options: Options = {
}){
  if ( !options.root ) options.root = path;
  const rootLength = options.root ? options.root.length : 0;

  const fsList = readdirSync(path);
  fsList.map(fs => {
    const fsPath = resolve(path, fs);
    const simplePath = fsPath.slice(rootLength + 1);
    const paths = {
      path: fsPath.replace(/\\/g, '/'),
      simplePath: simplePath.replace(/\\/g, '/'),
    };
    const fsStat = statSync(fsPath);

    if ( fsStat.isDirectory() ){
      callback(paths, true);
      fsmap(fsPath, callback, options);
    };

    if ( fsStat.isFile() ){
      callback(paths, false);
    };
  });
};
