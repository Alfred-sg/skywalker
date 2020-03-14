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

1. 在工程目录的 .skywalker.json 文件添加 dingtalk 相关配置。
2. 使用 skywalker deploy 命令完成发布。

```json
{
  "dingtalk": {
    "accessToken": "your access token",
    "secret": "your secret",
    "success": {// 成功访问页面
      "dev": "project page for dev",
      "prod": "project page for prod"
    },
    "error": {// jenkins 发布地址配置
      "dev": "jenkins page for dev",
      "prod": "jenkins page for prod"
    },
    "subscribe": ["success", "prod"],// 意为只订阅成功的线上发布日志
  }
}
```

## LICENSE

MIT
