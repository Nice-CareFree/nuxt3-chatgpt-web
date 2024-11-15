# 构建阶段
FROM node:18-alpine AS builder

# 安装必要工具
RUN apk add --no-cache git python3 build-base libc6-compat

# 全局安装 pnpm
RUN npm install -g pnpm

# 设置 npm 和 pnpm 配置
RUN pnpm config set registry https://registry.npmjs.org && \
    pnpm config set progress false

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json ./

# 先安装所有依赖（包括开发依赖）
RUN pnpm install --no-frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 清理并重新安装生产依赖
RUN rm -rf node_modules && \
    pnpm install --prod --no-frozen-lockfile

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 只复制必要的文件
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# 设置环境变量
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", ".output/server/index.mjs"] 