# 构建阶段
FROM node:18-alpine as builder

# 更新软件源并安装必要工具
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache git python3 make g++

# 全局安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 使用 pnpm 安装依赖，只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

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