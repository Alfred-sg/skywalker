# tac-skywalker

前端自动化部署工具。

## Feature

* 支持本地执行部署流程。
* 支持 jenkins 执行部署流程。
* 支持发布到 oss 环境。
* 支持发送钉钉消息
* [TODO] 支持发布到 cdn 环境。
* [TODO] 支持通过 ssh 发布。

## Usage

### 将资源发布到 oss 平台

1. 使用 skywalker config 完成 oss 相关配置。
2. 使用 skywalker deploy 命令完成打包（指定 process.DEPLOY_ENV = argv.deployEnv）并发布。

```sh
# 在 skywalker 目录中添加 .skywalker.json 配置内容
skywalker config oss.accessKeyId your-access-key-id
skywalker config oss.accessKeySecret your-access-key-secret
skywalker config oss.endpoint your-endpoint
skywalker config oss.bucket your-bucket

# 使用 cnpm 命令将 build 目录下的打包资源发布到 test/0.0.2 目录下
skywalker deploy --npmClient=cnpm --deployEnv=dev --dist=build --deployDirectory=test --deployVersion=0.0.2 
```

### 发送钉钉消息

1. 在工程目录的 .skywalker.js 文件添加 dingtalk 相关配置，导出为否值不发送钉钉消息。
2. 使用 skywalker deploy 命令完成发布。

```js
module.exports = {
  dingtalk: {
    "accessToken": "your access token",
    "secret": "your secret",
    getTextContent({ env, branch }, err){
      const envTexts = {
        dev: '测试环境',
        prod: '线上环境',
      }
      const appUrls = {
        "dev": "project url for dev",
        "prod": "project url for prod"
      };
      const jenkinsUrls = {
        "dev": "jenkins url for dev",
        "prod": "jenkins url for prod"
      };

      return err ? {
        title: `h5应用${envTexts[env]}发布失败`,
        text: `请检查，或点击前往 jenkins 重新发布。\n错误内容：${err.message}`,
        picUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584196130913&di=aa379191805328395a7e86211f92cb49&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F29%2F90%2F03573af86229ae7.jpg',
        messageUrl: jenkinsUrls[env],
      } : {
        title: `h5应用${envTexts[env]}发布成功`,
        text: `请点击访问！！！\n访问地址：${appUrls[env]}\n发布内容：${branch.message}`,
        picUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584196175766&di=9c0c18c886ea80323fca6de157fd9833&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F52%2F93%2F395746b3d7c606e.jpg',
        messageUrl: appUrls[env],
      }
    }
  }
}
```

## LICENSE

MIT
