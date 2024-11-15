# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 更新软件源并安装必要工具
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache curl git python3 make g++

# 全局安装 pnpm
RUN npm install -g pnpm

# 配置 pnpm 镜像源
RUN pnpm config set registry https://registry.npmmirror.com/

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package.json ./

# 使用 pnpm 安装依赖，不使用 frozen-lockfile
RUN pnpm install

# 复制源代码
COPY . .

# 设置构建环境变量
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server

# 使用 pnpm 构建应用
RUN pnpm build

# 设置运行环境变量
ENV HOST=0.0.0.0
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", ".output/server/index.mjs"] 