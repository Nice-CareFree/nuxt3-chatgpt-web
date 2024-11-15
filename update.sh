#!/bin/bash

# 进入项目目录
cd /www/wwwroot/nuxt3-chatgpt-web

# 拉取最新代码
git pull

# 构建新镜像
docker-compose build --no-cache

# 停止并删除旧容器
docker-compose down

# 启动新容器
docker-compose up -d

# 等待容器启动
sleep 10

# 检查容器状态
docker ps | grep nuxt3-chatgpt-web

# 清理未使用的镜像
docker image prune -f

# 输出日志
echo "Deployment completed at $(date)" 