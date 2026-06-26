# 青焰Hub WWW

## 概述

青焰Hub 官网第一版，聚焦青焰视频生成模型服务的额度咨询、套餐交付与使用协助。

当前页面是单页门户，面向短视频创作者、内容团队和开发者，核心目标是清楚展示服务内容、使用场景、交付流程和联系入口。

## 技术选型

- Vue 3：适合单页官网起步，后续接入套餐数据、客服入口、表单和多页面时维护成本低。
- Vite：开发启动快，构建产物是纯静态文件，便于静态托管或容器化发布。
- 原生 CSS：当前视觉稿以内容和图片资产为主，不额外引入 UI 组件库，避免第一版样式被组件库绑架。
- Nginx：容器镜像中用于承载构建后的静态资源。

## 项目结构

```text
index.html        Vite HTML 入口
package.json      前端依赖与 npm 脚本
vite.config.js    Vite 构建配置
src/              Vue 页面源码
public/assets/    首页图片资产
docker/           镜像构建与 Nginx 配置
```

`.tmp/` 是本地临时资料目录，不属于项目源码或发布资料，已通过 `.gitignore` 排除。

## 本地调试

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

构建静态产物：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 容器构建

本地沿用 CI 同名环境变量，镜像仓库登录由本机 Docker 配置处理。

```bash
docker build \
  -f docker/Dockerfile \
  -t "${REGISTRY_ENDPOINT_ALIYUN}/wod/verdantflare:www-1.0.0" \
   .
docker push "${REGISTRY_ENDPOINT_ALIYUN}/wod/verdantflare:www-1.0.0"
```
