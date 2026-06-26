# 青焰Hub WWW

青焰Hub 官网第一版，基于 Vue 3 + Vite 实现。当前页面聚焦 Seedance 视频生成额度咨询、套餐交付与使用协助。

## 技术选型

- Vue 3：适合单页官网起步，后续接入套餐数据、客服入口、表单和多页面时维护成本低。
- Vite：开发启动快，构建产物是纯静态文件，便于部署到 Cloudflare Pages、Vercel、Netlify、Nginx 或对象存储。
- 原生 CSS：当前视觉稿以内容和图片资产为主，不额外引入 UI 组件库，避免第一版样式被组件库绑架。

## 本地开发

```bash
npm install
npm run dev
```

## 构建发布

```bash
npm run build
npm run preview
```

构建产物位于 `dist/`。静态托管时将发布目录设置为 `dist`，构建命令设置为 `npm run build`。

如果使用 VS Code Live Server 预览构建结果，可以直接打开 `dist/index.html`。项目已配置相对资源路径，避免 `/assets` 被解析到站点根目录导致空白页。

## 镜像发布

镜像名：

```text
registry.cn-qingdao.aliyuncs.com/wod/verdantflare:www-1.0.0
```

本地构建：

```bash
npm ci
npm run build

docker build \
  -f docker/Dockerfile \
  -t registry.cn-qingdao.aliyuncs.com/wod/verdantflare:www-1.0.0 \
  --build-arg AUTHOR=verdantflarehub \
  --build-arg VERSION=www-1.0.0 \
  .
```

本地运行：

```bash
docker run --rm -p 8080:8087 registry.cn-qingdao.aliyuncs.com/wod/verdantflare:www-1.0.0
```

镜像内 nginx 监听 `8087`，方便在 rootless 容器或非特权运行时中启动。部署到 Kubernetes 时，可以用 Service 将 `80` 转发到容器 `8087`。

推送：

```bash
docker push registry.cn-qingdao.aliyuncs.com/wod/verdantflare:www-1.0.0
```

GitHub Actions 流水线位于 `.github/workflows/build.yml`，只有一个 workflow。它按顺序执行两个阶段：

- `Build html`：安装依赖并构建 `dist`。
- `Build image`：使用 `dist` 打包并推送 `linux/amd64` 镜像到阿里云 ACR。

仓库需要配置：

- `REGISTRY_USER_ALIYUN`
- `REGISTRY_PASSWORD_ALIYUN`

## 目录

```text
src/App.vue       首页内容与数据
src/styles.css    全局样式
public/assets/    首页压缩图片资产
docker/           镜像构建与 nginx 配置
```

`.tmp/` 是本地临时资料目录，不属于项目源码或发布资料，已通过 `.gitignore` 排除。
