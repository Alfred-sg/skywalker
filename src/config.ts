import * as fs from 'fs';
import * as path from 'path';

export const setConfig = (name: string, value: string | number) => {
  const config_file: string = '../../.skywalker.json';
  const config_file_path = path.resolve(__dirname, config_file);
  let finalConfig;
  let temp = finalConfig = {};

  if ( fs.existsSync(config_file_path) ){
    const config = require(config_file_path);

    temp = finalConfig = config;
  };

  name.split(',').map(subName => {
    temp[subName] = value
    temp = temp[subName]
  });

  fs.writeFileSync(config_file_path, JSON.stringify(finalConfig, null, 2));
}

export const getConfig = (name: string) => {
  const config_file: string = '../../.skywalker.json';
  const config_file_path = path.resolve(__dirname, config_file);

  if ( fs.existsSync(config_file_path) ){
    const config = require(config_file_path);
    return config[name]
  };
}