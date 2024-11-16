# 构建阶段
FROM node:18 AS builder

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    gcc \
    g++ \
    icnsutils \
    graphicsmagick \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# 全局安装 pnpm
RUN npm install -g pnpm

# 设置 npm 和 pnpm 配置
RUN npm config set registry https://registry.npmmirror.com/ && \
    pnpm config set registry https://registry.npmmirror.com/ && \
    pnpm config set progress false

WORKDIR /app

# 首先只复制 package.json
COPY package.json ./

# 安装所有依赖（包括开发依赖）
RUN pnpm install

# 复制其余源代码
COPY . .

# 验证 electron-builder 是否正确安装
RUN ls -la node_modules/.bin/electron-builder

# 执行构建 - 同时构建 web 服务和 Electron 应用
RUN pnpm docker:build

# Web 服务运行阶段
FROM node:18-alpine AS web

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# 只安装生产依赖
RUN npm install -g pnpm && \
    pnpm install --prod

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# 运行 web 服务
CMD ["node", ".output/server/index.mjs"]

# Electron 构建产物阶段
FROM alpine:latest AS electron

WORKDIR /app

# 复制 Electron 构建产物
COPY --from=builder /app/electron-dist ./electron-dist