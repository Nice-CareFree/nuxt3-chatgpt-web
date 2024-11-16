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

# 安装所有依赖
RUN pnpm install

# 复制源代码
COPY . .

# 执行构建 - 这里使用 nuxt build 而不是 generate
RUN pnpm build

# 最终阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/electron ./electron
COPY --from=builder /app/public ./public

# 安装生产依赖
RUN npm install -g pnpm && \
    pnpm install --prod

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# 使用 node 直接运行 Nuxt 服务
CMD ["node", ".output/server/index.mjs"]