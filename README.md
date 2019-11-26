# skywalker

前端自动化部署工具。

## Feature

* 支持本地执行部署流程。
* 支持 jenkins 执行部署流程。
* 支持发布到 oss 环境。
* [TODO] 支持发布到 cdn 环境。
* [TODO] 支持通过 ssh 发布。

## Usage

```sh
# 发布指定 object/dev 文件夹下
skywalker deploy --region=your-region --accessKeyId=your-access-key-id --accessKeySecret=your-access-key-secret --bucket=your-bucket --objectRoot=your-object-root --branchName=daily/0.0.2 --version=dev
```

## LICENSE

MIT
