# VerdantFlare WWW

VerdantFlare 的公开官网，部署于 `www.verdantflarehub.com`。WWW 面向未登录访客、潜在客户和开发者，负责品牌介绍、公开能力发现、公开文档与咨询转化；登录后的业务操作统一进入 VerdantFlare Hub。

## 产品边界

WWW 承载：

- 首页品牌、视频能力和交付方式介绍。
- `/models` 及 `/models/:modelId` 公开模型目录与详情。
- `/apps` 及 `/apps/:appId` 公开应用目录、详情与当前版本。
- `/solutions/*`、`/developers`、`/docs`、`/pricing` 和 `/contact`。
- 跳转 Hub 在线体验、模型市场、应用市场、API Center 和登录入口的 CTA。

WWW 不承载 API Key、组织权益、余额、订单、任务记录、客户项目或应用安装操作。相关 CTA 必须携带稳定 ID 和来源参数跳转 `hub.verdantflarehub.com`。

首页顶部按“首页、模型、应用、方案、套餐、开发者”排列，分别定位到 `/#home`、`/#model`、`/#apps`、`/#solutions`、`/#price`、`/#developers`。公开模型在首页模型段及 `/models` 提供只读资料；开发者段说明 API 接入；实际授权、体验和调用进入 Hub。旧的模型订单地址仅展示公开套餐说明，不在 WWW 创建订单。

## 公开目录事实源

公开页面统一从 `src/catalog/public.js` 读取 Control 的匿名只读 `/api/control/public/catalog`。新记录默认不公开；管理员显式公开的模型，以及已公开且位于 Preview/Stable 目录通道的应用才进入 WWW。接口只返回公开资料，不返回组织授权、内部验证、Key 或运行状态。页面不再打包静态价格和应用版本，接口失败时显示错误而不是旧样例。

数据流：

```text
Hub 管理端 → Control PostgreSQL → 匿名只读目录 API → WWW /models、/apps
```

公开模型报价仅供展示；实际模型可调用性、权限和结算由网关负责。公开应用版本仅为目录资料，不代表 Station 已安装。

## 技术栈

- Vue 3
- Vite 6
- 原生 CSS
- Nginx 静态托管

## 本地开发

```bash
npm install
npm run dev
```

本地需同时启动 Control Service；Vite 将 `/api/control/public/*` 代理到 `http://localhost:8080`。容器 Nginx 在阿里云集群内将该只读路径代理到 Control。

跨站进入 Hub 的地址通过环境变量配置：

```bash
VITE_HUB_URL=https://hub.verdantflarehub.com
```

构建和预览：

```bash
npm run build
npm run preview
```

## 容器构建

```bash
docker build \
  -f docker/Dockerfile \
  -t "${REGISTRY_ENDPOINT_ALIYUN}/wod/verdantflare:www-1.3.0" \
  .
```

镜像只包含构建后的静态文件。Hub、Login、Control Service 和数据库均独立部署，不放入 WWW 容器。
