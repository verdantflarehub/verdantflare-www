# VerdantFlare WWW

VerdantFlare 的公开官网，部署于 `www.verdantflarehub.com`。WWW 面向未登录访客、潜在客户和开发者，负责品牌介绍、公开能力发现、公开文档与咨询转化；登录后的业务操作统一进入 VerdantFlare Hub。

## 产品边界

WWW 承载：

- 首页品牌、视频能力和交付方式介绍。
- `/models` 及 `/models/:modelId` 公开模型目录与详情。
- `/apps` 及 `/apps/:appId` 公开应用目录、详情与版本记录。
- `/solutions/*`、`/developers`、`/docs`、`/pricing` 和 `/contact`。
- 跳转 Hub 在线体验、模型市场、应用市场、API Center 和登录入口的 CTA。

WWW 不承载 API Key、组织权益、余额、订单、任务记录、客户项目或应用安装操作。相关 CTA 必须携带稳定 ID 和来源参数跳转 `hub.verdantflarehub.com`。

首页顶部的“模型”和“应用”导航分别定位到 `/#model`、`/#apps`；相应区块提供公开目录入口和 Hub 业务入口。旧的模型订单地址仅展示公开套餐说明，不在 WWW 创建订单。

## 公开目录事实源

公开页面统一从 `src/catalog/public.js` 读取目录。该入口使用显式 Published allowlist，只允许经过公开审核的模型和应用出现在 WWW；内部候选、组织授权状态和 Preview 运营数据不能直接从业务数据集泄漏到官网。

当前目录采用构建期静态数据：

```text
src/view/model/data.js ─┐
                       ├─> src/catalog/public.js ─> /models、/apps
src/view/app/data.js ───┘
```

后续接入公共只读目录 API 或 CMS 时，只替换 `src/catalog/public.js` 的数据适配层，页面组件不直接依赖 Control Service，也不读取组织权益。

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
  -t "${REGISTRY_ENDPOINT_ALIYUN}/wod/verdantflare:www-1.1.0" \
  .
```

镜像只包含构建后的静态文件。Hub、Login、Control Service 和数据库均独立部署，不放入 WWW 容器。
