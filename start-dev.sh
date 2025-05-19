#!/bin/bash

# 启动开发服务器的脚本
# 不要在代码库中存储 API Token
# 请通过环境变量或 .env.local 文件设置 REPLICATE_API_TOKEN

# 检查环境变量是否已设置
if [ -z "$REPLICATE_API_TOKEN" ]; then
  echo "注意: REPLICATE_API_TOKEN 环境变量未设置"
  echo "请确保你已在 .env.local 文件中设置此变量或通过命令行设置"
fi

# 启动开发服务器
npm run dev 