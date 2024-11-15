#!/bin/bash

# 设置版本号
VERSION="v1.1.0"

# 构建新镜像
echo "Building new Docker image..."
docker build -t carefreezi/nuxt3-chatgpt-web:latest -t carefreezi/nuxt3-chatgpt-web:$VERSION .

# 推送镜像到 Docker Hub
echo "Pushing images to Docker Hub..."
docker push carefreezi/nuxt3-chatgpt-web:latest
docker push carefreezi/nuxt3-chatgpt-web:$VERSION

echo "Image published successfully!"
echo "Tags published:"
echo "- carefreezi/nuxt3-chatgpt-web:latest"
echo "- carefreezi/nuxt3-chatgpt-web:$VERSION" 