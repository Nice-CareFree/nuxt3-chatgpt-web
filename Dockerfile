# 依赖阶段 - 安装所有依赖
FROM node:18 AS deps
WORKDIR /app

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

# 复制package相关文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖（包括devDependencies）
RUN pnpm config set registry https://registry.npmmirror.com/ && \
    pnpm install --frozen-lockfile

# 构建阶段
FROM node:18 AS builder
WORKDIR /app

# 安装必要的系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3 \
    make \
    gcc \
    g++ \
    icnsutils \
    graphicsmagick \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

# 复制依赖和源码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 执行nuxt generate构建
RUN pnpm generate

# 生产阶段
FROM node:18 AS runner

# 安装必要的系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    gcc \
    g++ \
    icnsutils \
    graphicsmagick \
    xz-utils \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

# 复制package.json和lock文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖，但排除一些纯开发工具
# 这里我们需要保留electron相关的devDependencies
RUN pnpm config set registry https://registry.npmmirror.com/ && \
    pnpm install --frozen-lockfile && \
    # 可以选择性地删除一些确定不需要的开发依赖，但要保留electron相关的
    rm -rf node_modules/@types && \
    rm -rf node_modules/typescript && \
    # 清理pnpm缓存
    pnpm store prune

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/electron ./electron
COPY --from=builder /app/public ./public

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# 使用node运行服务
CMD ["node", ".output/server/index.mjs"]