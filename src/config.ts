import * as fs from 'fs';
import * as path from 'path';

const config_file: string = '../.skywalker.json';
const config_file_path = path.resolve(__dirname, config_file);

export const setConfig = (name: string, value: string | number) => {
  let finalConfig;
  let temp = finalConfig = {};

  if ( fs.existsSync(config_file_path) ){
    const config = require(config_file_path);

    temp = finalConfig = config;
  };

  const subNames = name.split('.');
  subNames.map((subName, index) => {
    if (!temp[subName]) temp[subName] = {};
    if (index == subNames.length - 1){
      temp[subName] = value
    } else {
      temp = temp[subName];
    }
  });
  
  fs.writeFileSync(config_file_path, JSON.stringify(finalConfig, null, 2));
}

export const getConfig = (name?: string | boolean) => {
  if ( fs.existsSync(config_file_path) ){
    const config = require(config_file_path) || {};
    if (!name || typeof name !== 'string'){
      if (!name) console.log(JSON.stringify(config, null, 2));
      return config;
    }

    let temp = config;
    name.split('.').map(subName => {
      temp = temp ? temp[subName] : undefined;
    });

    console.log(JSON.stringify(temp, null, 2));
    return temp;
  } else {
    throw new Error(`there is no ${config_file} in skywalker, please set config.`);
  }
}