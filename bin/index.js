#!/usr/bin/env node
require('yargs')
  .usage("Usage: skywalker <cmd> [options]")
  .locale("zh_CN")
  .version(require('../package.json').version)
  .alias('version', 'v')
  .command('deploy', 'deploy static resource', (yargs) => {
    yargs
    .option('deployEnv', {
      type: 'string',
      description: 'deploy env',// 发布环境
      default: 'prod',
    })
    .option('npmClient', {
      type: 'string',
      description: 'npm client'// 发布的版本
    })
    .option('dist', {
      type: 'string',
      description: 'dist',
      default: 'dist',
    })
    .option('deployDirectory', {
      type: 'string',
      description: 'deploy directory'// 发布目录
    })
    .option('deployVersion', {
      type: 'string',
      description: 'version to deploy'// 发布版本，影响发布目录
    });
  }, () => {
    require('../lib/index').default();
  })
  .command('config', 'set or get config', (yargs) => {}, (argv) => {
    if (argv._[2]) require('../lib/config').setConfig(argv._[1], argv._[2]);
    else require('../lib/config').getConfig(argv._[1]);
  })
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help')
  .help()
  .alias('h', 'help')
  .argv;
