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

# 复制 package.json
COPY package.json ./

# 安装所有依赖(包括devDependencies)
RUN pnpm install

# 复制源代码
COPY . .

# 执行构建
RUN pnpm electron:build

# 如果需要部署为web服务，可以添加运行阶段
FROM node:18

WORKDIR /app

COPY --from=builder /app/electron-dist ./electron-dist
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]