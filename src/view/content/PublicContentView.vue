<script setup>
import { computed } from "vue";
import { hubHref } from "../../config/external";

const props = defineProps({
  page: { type: String, required: true },
  locale: { type: String, default: "zh" },
});

const pages = {
  "solution-video": {
    eyebrow: { zh: "视频生成解决方案", en: "Video generation" },
    title: { zh: "让脑海中的镜头，先一步出现。", en: "Bring the shot in your mind into view." },
    lead: { zh: "从描述和参考素材开始，探索广告、短片与分镜预演的不同可能。这是视频创作的方案方向；当前在线体验以 Hub 已开放的模型入口为准。", en: "Explore ideas for ads, short films, and storyboards using prompts and references. This is our direction for video creation; current online experiences are limited to models enabled in Hub." },
    primary: { label: { zh: "查看模型能力", en: "Explore model capabilities" }, href: hubHref("/api/models", { entry: "solution-video" }) },
    secondary: { label: { zh: "查看视频模型", en: "Explore video models" }, href: "/models/verdantflare-dance-2" },
    image: "/assets/usecase-script-video.webp",
    sections: [
      { title: { zh: "先验证，再进入生产", en: "Validate before production" }, text: { zh: "当前可体验已开放的文本模型；视频、参考图与画幅等输入按模型单独接入，是否可用请查看 Hub 的实际入口。", en: "Try enabled text models today. Video, reference images, and aspect-ratio controls require model-specific integration; check Hub for available entry points." } },
      { title: { zh: "任务追踪规划", en: "Planned task tracking" }, text: { zh: "视频方案规划保留任务状态、请求标识、模型版本、失败原因与结果地址；完整异步流程待对应能力接入和验证。", en: "The video workflow is planned to retain task status, request IDs, model versions, errors, and result locations. The complete asynchronous flow awaits integration and validation." } },
      { title: { zh: "面向内容团队", en: "For content teams" }, text: { zh: "规划覆盖脚本验证、广告样片、商品展示和分镜预演；结果下载与 Studio 项目衔接以各入口实际开放能力为准。", en: "Planned use cases include script validation, ad samples, product visuals, and storyboard previs. Downloads and Studio project handoff depend on the capabilities available at each entry point." } },
    ],
  },
  "solution-creator": {
    eyebrow: { zh: "创作者解决方案", en: "Creator solution" },
    title: { zh: "从灵感出发，把创作连起来。", en: "From first spark to a creative workflow." },
    lead: { zh: "在 Hub 发现模型与应用，体验已开放的模型。应用市场当前仅展示资料；通过 Studio 向关联 Station 下载和安装的分发链路仍在对接。", en: "Discover models and apps in Hub and try enabled models. App Market currently provides listings only; downloading and installing published apps through Studio on a connected Station is still being integrated." },
    primary: { label: { zh: "浏览应用", en: "Browse apps" }, href: "/apps" },
    secondary: { label: { zh: "进入 Hub", en: "Open Hub" }, href: hubHref("/", { entry: "solution-creator" }) },
    image: "/assets/usecase-ad-storyboard.webp",
    sections: [
      { title: { zh: "发现", en: "Discover" }, text: { zh: "按创作目标比较应用、模型、输入输出和资源条件，不先被部署细节打断。", en: "Compare apps, models, inputs, outputs, and resource requirements by creative goal." } },
      { title: { zh: "验证", en: "Evaluate" }, text: { zh: "使用当前组织的 API Key 和真实额度体验已开放模型，并查看调用记录与用量。Hub 暂不提供应用在线试用。", en: "Try enabled models using your organization's API key and actual credits, then review call records and usage. Hub does not currently offer online app trials." } },
      { title: { zh: "生产路径", en: "Production path" }, text: { zh: "正式项目由 Studio 管理，应用由关联 Station 执行。Hub 发布版本到 Studio 安装的链路待接通，当前请以 Studio 已安装、已授权的应用为准。", en: "Studio manages formal projects and the connected Station runs apps. Distribution from Hub releases to Studio installation is still pending; use the apps already installed and authorized in Studio." } },
    ],
  },
  "solution-enterprise": {
    eyebrow: { zh: "企业解决方案", en: "Enterprise solution" },
    title: { zh: "让团队专注创作，让管理清晰有序。", en: "Room to create. Clarity to manage." },
    lead: { zh: "通过组织、角色、权益和区域约束管理模型与应用访问；正式项目资产继续留在 Studio 与客户数据边界内。", en: "Control access through organizations, roles, entitlements, and regions while formal project assets remain in Studio." },
    primary: { label: { zh: "联系企业顾问", en: "Contact enterprise" }, href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Enterprise" },
    secondary: { label: { zh: "查看公开套餐", en: "View public plans" }, href: "/pricing" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "统一身份", en: "One identity" }, text: { zh: "使用统一账号登录，按组织与角色管理访问。切换团队时，对应授权随之切换。", en: "Sign in with one account and manage access by organization and role. Access follows the team you select." } },
      { title: { zh: "显式权益", en: "Explicit entitlements" }, text: { zh: "应用、模型、API、体验额度和有效期均按组织计算，默认不因加入组织而自动开放。", en: "Apps, models, APIs, experience quota, and validity are explicitly granted per organization." } },
      { title: { zh: "数据分界", en: "Data boundaries" }, text: { zh: "Center 管理平台权益和用量，不直接读取客户项目目录、未上传素材和本地工作版本。", en: "Center manages platform entitlement and usage without directly reading customer project files or local working versions." } },
    ],
  },
  developers: {
    eyebrow: { zh: "开发者", en: "Developers" },
    title: { zh: "从模型目录到第一次成功调用", en: "From model discovery to the first successful call" },
    lead: { zh: "在 API Center 查看模型、由有权限的管理员创建限定模型的 Key，参考调用示例并查看已接入的调用记录与用量。", en: "Explore models in API Center, have an authorized administrator create a model-scoped key, follow a call example, and review supported call records and usage." },
    primary: { label: { zh: "进入 API Center", en: "Open API Center" }, href: hubHref("/api/models", { entry: "developers" }) },
    secondary: { label: { zh: "公开文档", en: "Public docs" }, href: "/docs" },
    image: "/assets/usecase-ecommerce.webp",
    sections: [
      { title: { zh: "模型目录", en: "Model catalog" }, text: { zh: "查看已公布的模型资料与参考报价；实际调用能力以网关支持、Key 模型范围和组织额度为准。", en: "Review published model details and reference prices. Actual access depends on gateway support, the key's model scope, and organization credits." } },
      { title: { zh: "安全凭证", en: "Scoped credentials" }, text: { zh: "API Key 只在创建时完整显示一次，并按用途设置范围和有效期。", en: "API keys are shown once and scoped by purpose and validity period." } },
      { title: { zh: "调用与用量", en: "Calls and usage" }, text: { zh: "查看已接入的模型体验记录和网关用量。视频等异步生成流程按模型单独接入，不代表目录中的全部模型均可在线体验。", en: "Review supported model-experience records and gateway usage. Asynchronous flows such as video generation require model-specific integration; a catalog listing does not guarantee an online experience." } },
    ],
  },
  docs: {
    eyebrow: { zh: "公开文档", en: "Documentation" },
    title: { zh: "找到入口，开始你的第一次创作。", en: "Find your way to your first creation." },
    lead: { zh: "了解模型目录、已开放的模型体验与 API 接入，以及 Hub 应用市场、Studio 和 Station 各自的职责。", en: "Learn about model discovery, enabled model experiences, API access, and the roles of Hub App Market, Studio, and Station." },
    primary: { label: { zh: "API 快速开始", en: "API quickstart" }, href: hubHref("/api/models", { entry: "docs" }) },
    secondary: { label: { zh: "浏览应用", en: "Browse apps" }, href: "/apps" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "市场与 Hub", en: "Market and Hub" }, text: { zh: "WWW 展示公开资料；Hub 提供已开放的模型体验、API Key 与用量入口。Hub 应用市场当前仅展示应用资料，不提供应用在线试用。", en: "WWW presents public information. Hub provides enabled model experiences, API key management, and usage. Hub App Market currently displays app details without online app trials." } },
      { title: { zh: "Studio 与 Station", en: "Studio and Station" }, text: { zh: "Studio 管理正式项目和关联 Station 的应用；安装和执行发生在 Station。Hub 已发布应用经 Studio 下载、安装的分发链路仍在对接。", en: "Studio manages formal projects and apps on the connected Station, where installation and execution take place. Distribution of published Hub apps through Studio is still being integrated." } },
      { title: { zh: "安全与数据", en: "Security and data" }, text: { zh: "模型体验使用组织 API Key 和真实额度；正式项目与素材由 Studio 及其关联服务管理，体验结果不会自动进入正式项目。", en: "Model experiences use organization API keys and actual credits. Studio and its connected services manage formal projects and assets; experience results are not automatically added to a project." } },
    ],
  },
  pricing: {
    eyebrow: { zh: "套餐与合作", en: "Plans and engagement" },
    title: { zh: "为你的创作，找到合适的方案。", en: "Find the right plan for your work." },
    lead: { zh: "从创作与体验到团队与企业接入，先选择使用阶段。模型范围、额度、并发、有效期和价格以 Hub 权益或双方确认的方案为准。", en: "Start with your stage, from creation and exploration to team integration. Model scope, credits, concurrency, validity, and pricing follow Hub entitlements or your confirmed agreement." },
    primary: { label: { zh: "咨询方案", en: "Discuss a plan" }, href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Plans" },
    secondary: { label: { zh: "体验已开放模型", en: "Try enabled models" }, href: hubHref("/experience", { entry: "pricing" }) },
    image: "/assets/hero-glass-ad.webp",
    sections: [
      { title: { zh: "创作与体验", en: "Create & Explore" }, text: { zh: "浏览已公开能力，并在获得组织授权后使用已开放的在线体验；额度与用量在 Hub 查看。", en: "Discover published capabilities and try enabled experiences after organization access is granted; see credits and usage in Hub." } },
      { title: { zh: "团队与企业接入", en: "Team & Enterprise" }, text: { zh: "围绕持续 API 调用、成员协作和正式项目交付，单独确认模型、额度与服务范围。", en: "For ongoing API use, team collaboration, and formal project delivery, confirm models, credits, and service scope separately." } },
    ],
  },
  contact: {
    eyebrow: { zh: "联系团队", en: "Contact" },
    title: { zh: "聊聊你想做的事。", en: "Tell us what you want to make." },
    lead: { zh: "无论是验证一个想法，还是为团队接入模型，都可以通过邮件联系我们。", en: "Whether you’re testing an idea or bringing models to your team, get in touch by email." },
    image: "/assets/usecase-ad-storyboard.webp",
    sections: [],
  },
};

const content = computed(() => pages[props.page] || pages.developers);
const text = (value) => value?.[props.locale] || value?.zh || "";
</script>

<template>
  <main class="public-content-page">
    <section class="public-hero">
      <div class="public-wrap public-hero-grid">
        <div class="public-hero-copy">
          <p>{{ text(content.eyebrow) }}</p>
          <h1>{{ text(content.title) }}</h1>
          <div class="public-lead">{{ text(content.lead) }}</div>
          <div v-if="content.primary" class="public-actions">
            <a class="button primary" :href="content.primary.href">{{ text(content.primary.label) }}</a>
            <a class="button" :href="content.secondary.href">{{ text(content.secondary.label) }}</a>
          </div>
        </div>
        <figure class="public-hero-media"><img :src="content.image" alt="" /></figure>
      </div>
    </section>

    <section v-if="content.sections.length" class="public-section">
      <div class="public-wrap public-principles">
        <article v-for="(item, index) in content.sections" :key="item.title.zh">
          <span>0{{ index + 1 }}</span>
          <h2>{{ text(item.title) }}</h2>
          <p>{{ text(item.text) }}</p>
        </article>
      </div>
    </section>

    <section v-if="page === 'contact'" class="public-section contact-section">
      <div class="public-wrap contact-email">
        <div>
          <h2>{{ locale === 'en' ? 'Contact us by email' : '通过邮件联系团队' }}</h2>
          <p>{{ locale === 'en' ? 'Tell us about your goals, model or API requirements, and team needs. The button opens your email application; review and send your message there.' : '欢迎说明创作目标、模型或 API 接入需求，以及团队情况。点击按钮会打开邮件应用，由你确认内容后发送。' }}</p>
          <div class="contact-direct-links">
            <a class="button primary" href="mailto:hello@verdantflarehub.com">{{ locale === 'en' ? 'Write an inquiry' : '撰写咨询邮件' }}</a>
            <a href="mailto:hello@verdantflarehub.com">hello@verdantflarehub.com</a>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="public-journey">
      <div class="public-wrap">
        <div>
          <h2>{{ locale === 'en' ? 'Make your next move in Hub.' : '下一步，在 Hub 中开始。' }}</h2>
          <p>{{ locale === 'en' ? 'Sign in to explore models and app listings, and review your organization’s API access and credits.' : '登录后浏览模型与应用资料，并查看当前组织的 API 使用权限和额度。' }}</p>
        </div>
        <a class="button primary" :href="hubHref('/', { entry: page })">{{ locale === 'en' ? 'Open Hub' : '进入 Hub' }}</a>
      </div>
    </section>
  </main>
</template>
