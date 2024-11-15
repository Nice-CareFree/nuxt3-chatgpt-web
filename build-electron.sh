#!/bin/bash

# 清理旧的构建文件
rm -rf dist
rm -rf electron-dist

# 生成静态文件
echo "Generating static files..."
pnpm generate

# 构建 Electron 应用
echo "Building Electron app..."
pnpm electron:build

echo "Build completed!" 