#!/usr/bin/env node
require('yargs')
  .usage("Usage: skywalker <cmd> [options]")
  .locale("zh_CN")
  .version(require('../package.json').version)
  .alias('version', 'v')
  .command('deploy', 'deploy static resource', (yargs) => {
    yargs.option('deployVersion', {
      type: 'string',
      description: 'version to deploy'// 发布的版本
    }).option('branchName', {
      type: 'string',
      description: 'git branchName to operate'// 操作的分支
    }).option('dist', {
      type: 'string',
      description: 'dist'
    }).option('region', {
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
    }).option('dingtalkAccessToken', {
      type: 'string',
      description: 'dingtalk access token'
    }).option('dingtalkSecret', {
      type: 'string',
      description: 'dingtalk secret'
    });
  }, (argv) => {
    require('../lib/index').default();
  })
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help')
  .help()
  .alias('h', 'help')
  .argv;
