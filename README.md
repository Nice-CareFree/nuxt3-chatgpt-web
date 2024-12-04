# Nuxt3 ChatGPT Web

一个基于 Nuxt3 + Vue3 + TypeScript + Tailwind CSS 开发的 ChatGPT Web 应用，支持 Docker 部署和 Electron 桌面应用。

## 功能特点

- 💡 基于 Nuxt3 + Vue3 + TypeScript
- 🎨 使用 Tailwind CSS 和 shadcn-vue 构建美观的 UI
- 🌙 支持亮色/暗色主题切换
- 🔄 支持多种 AI 模型配置
- 🚀 支持 Docker 快速部署
- 💻 支持 Electron 桌面应用
- 📱 响应式设计，支持移动端
- 🔒 支持自定义 API 配置

## 演示截图
![这是图片](/public/PixPin_2024-12-04_18-33-59.png "Magic Gardens")

## Docker 部署

### 1. 使用预构建镜像

```bash
# 拉取镜像
docker pull carefreezi/nuxt3-chatgpt-web:latest

# 运行容器
docker run -d \
  --name nuxt3-chatgpt-web \
  -p 3000:3000 \
  carefreezi/nuxt3-chatgpt-web:latest
```

### 2. 使用 docker-compose 部署

```bash
# 克隆项目
git clone https://github.com/Nice-CareFree/nuxt3-chatgpt-web.git
cd nuxt3-chatgpt-web

# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 3. 更新部署

```bash
# 给更新脚本添加执行权限
chmod +x update.sh

# 执行更新
./update.sh
```

## Electron 桌面应用开发与构建

### 1. 开发环境配置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm electron:dev
```

### 2. 构建桌面应用

```bash
# 构建应用
pnpm electron:build
```

构建完成后，可以在 `electron-dist` 目录找到对应平台的安装包：
- Windows: `.exe` 安装包
- macOS: `.dmg` 安装包
- Linux: `.AppImage` 可执行文件

### 3. Docker 环境下构建 Electron

如果您在 Docker 环境中部署了 Web 应用，可以按以下步骤构建 Electron 应用：

1. 在本地开发环境中：
```bash
# 克隆项目
git clone https://github.com/Nice-CareFree/nuxt3-chatgpt-web.git
cd nuxt3-chatgpt-web

# 安装依赖
pnpm install

# 构建 Electron 应用
pnpm electron:build
```

2. 构建完成后，可以在 `electron-dist` 目录找到安装包。

## 项目结构

```
nuxt3-chatgpt-web/
├── components/         # 组件目录
├── pages/             # 页面目录
├── stores/            # 状态管理
├── electron/          # Electron 相关文件
├── public/           # 静态资源
└── docker/           # Docker 相关文件
```

## 环境要求

- Node.js 18+
- pnpm 8+
- Docker (可选)
- Docker Compose (可选)

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 构建 Electron 应用
pnpm electron:build
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

[MIT License](LICENSE)
