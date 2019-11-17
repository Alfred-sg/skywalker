import { readdirSync, statSync, existsSync } from "fs";
import { resolve,  } from "path";

interface Callback {
  (path: string, isDir: boolean): unknown;
}

/**
 * 获取文件或文件夹映射
 * @param {string} path 目录名
 * @return {object} 文件映射
 */
export default function fsmap(path: string, callback: Callback){
  if (!existsSync(path)) return;

  const fsList = readdirSync(path);
  fsList.map(fs => {
    const fsPath = resolve(path, fs);
    const fsStat = statSync(fsPath);

    if ( fsStat.isDirectory() ){
      callback(fsPath, true);
      fsmap(fsPath, callback);
    };

    if ( fsStat.isFile() ){
      callback(fsPath, false);
    };
  });
};