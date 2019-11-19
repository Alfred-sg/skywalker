#!/usr/bin/env node

require('yargs')
  .usage("Usage: skywalker <cmd> [options]")
  .locale("zh_CN")
  .version(require('../package.json').version)
  .alias('version', 'v')
  .command('deploy', 'deploy static resource', (yargs) => {
    yargs.option('region', {
      type: 'string',
      description: 'oss region, see https://help.aliyun.com/document_detail/32068.html'
    })
    .option('accessKeyId', {
      type: 'string',
      description: 'oss accessKeyId, see https://help.aliyun.com/document_detail/32068.html'
    })
    .option('accessKeySecret', {
      type: 'string',
      description: 'oss accessKeySecret, see https://help.aliyun.com/document_detail/32068.html'
    })
    .option('bucket', {
      type: 'string',
      description: 'oss bucket, see https://help.aliyun.com/document_detail/32068.html'
    })
    .option('objectRoot', {
      type: 'string',
      description: 'root path of oss object, see https://help.aliyun.com/document_detail/32068.html'
    });
  }, (argv) => {
    require('../lib/index').default();
  })
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help')
  .help()
  .alias('h', 'help')
  .argv;
