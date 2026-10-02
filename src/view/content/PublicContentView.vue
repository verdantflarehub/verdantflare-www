<script setup>
import { computed, ref } from "vue";
import { hubHref } from "../../config/external";

const props = defineProps({
  page: { type: String, required: true },
  locale: { type: String, default: "zh" },
});

const submitted = ref(false);

const pages = {
  "solution-video": {
    eyebrow: { zh: "视频生成解决方案", en: "Video generation" },
    title: { zh: "从创意描述到可验证的视频结果", en: "From creative intent to a verifiable video result" },
    lead: { zh: "组合模型、参考素材与异步任务，让广告、短片和预演进入可追踪的生产流程。", en: "Combine models, references, and asynchronous tasks for traceable ad, short-film, and previs workflows." },
    primary: { label: { zh: "在线体验", en: "Try online" }, href: hubHref("/experience", { entry: "solution-video" }) },
    secondary: { label: { zh: "查看视频模型", en: "Explore video models" }, href: "/models/verdantflare-dance-2" },
    image: "/assets/usecase-script-video.webp",
    sections: [
      { title: { zh: "先验证，再进入生产", en: "Validate before production" }, text: { zh: "使用临时体验 Session 测试提示词、参考图和画幅；确认能力后，再通过 API 或 Studio 进入正式流程。", en: "Test prompts, references, and aspect ratios in a temporary session before moving to API or Studio production." } },
      { title: { zh: "异步任务可追踪", en: "Traceable asynchronous tasks" }, text: { zh: "任务保留状态、请求标识、模型版本、失败原因与结果地址，避免生成过程成为黑盒。", en: "Keep status, request ID, model version, failure reason, and result location attached to every task." } },
      { title: { zh: "适合真实内容团队", en: "Built for content teams" }, text: { zh: "覆盖脚本验证、广告样片、商品展示和分镜预演，结果可下载或继续进入 Studio。", en: "Use it for script validation, ad samples, product visuals, and storyboard previs, then download or continue in Studio." } },
    ],
  },
  "solution-creator": {
    eyebrow: { zh: "创作者解决方案", en: "Creator solution" },
    title: { zh: "把模型、应用和本地工作站连成一条创作路径", en: "Connect models, apps, and a local station into one creative path" },
    lead: { zh: "公开市场负责发现能力，Hub 负责试用和授权，Studio 与 Station 负责正式项目和本地执行。", en: "Use the public market to discover, Hub to evaluate, and Studio with Station for project production." },
    primary: { label: { zh: "浏览应用", en: "Browse apps" }, href: "/apps" },
    secondary: { label: { zh: "进入 Hub", en: "Open Hub" }, href: hubHref("/", { entry: "solution-creator" }) },
    image: "/assets/usecase-ad-storyboard.webp",
    sections: [
      { title: { zh: "发现", en: "Discover" }, text: { zh: "按创作目标比较应用、模型、输入输出和资源条件，不先被部署细节打断。", en: "Compare apps, models, inputs, outputs, and resource requirements by creative goal." } },
      { title: { zh: "验证", en: "Evaluate" }, text: { zh: "在有限额度和自动清理的体验环境中确认效果，保留任务状态与用量。", en: "Validate results in a quota-limited, automatically cleaned experience environment." } },
      { title: { zh: "生产", en: "Produce" }, text: { zh: "在 Studio 中绑定正式项目，并由当前 Station 安装和执行已授权应用。", en: "Bind work to a formal Studio project and install authorized apps on the active Station." } },
    ],
  },
  "solution-enterprise": {
    eyebrow: { zh: "企业解决方案", en: "Enterprise solution" },
    title: { zh: "让能力、身份和数据边界同时可管理", en: "Manage capability, identity, and data boundaries together" },
    lead: { zh: "通过组织、角色、权益和区域约束管理模型与应用访问；正式项目资产继续留在 Studio 与客户数据边界内。", en: "Control access through organizations, roles, entitlements, and regions while formal project assets remain in Studio." },
    primary: { label: { zh: "联系企业顾问", en: "Contact enterprise" }, href: "/contact?intent=enterprise" },
    secondary: { label: { zh: "查看公开套餐", en: "View public plans" }, href: "/pricing" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "统一身份", en: "Unified identity" }, text: { zh: "Login 提供统一认证，Center ID 将身份映射到组织、角色和权益版本。", en: "Login provides authentication while Center ID maps identity to organizations, roles, and entitlement versions." } },
      { title: { zh: "显式权益", en: "Explicit entitlements" }, text: { zh: "应用、模型、API、体验额度和有效期均按组织计算，默认不因加入组织而自动开放。", en: "Apps, models, APIs, experience quota, and validity are explicitly granted per organization." } },
      { title: { zh: "数据分界", en: "Data boundaries" }, text: { zh: "Center 管理平台权益和用量，不直接读取客户项目目录、未上传素材和本地工作版本。", en: "Center manages platform entitlement and usage without directly reading customer project files or local working versions." } },
    ],
  },
  developers: {
    eyebrow: { zh: "开发者", en: "Developers" },
    title: { zh: "从模型目录到第一次成功调用", en: "From model discovery to the first successful call" },
    lead: { zh: "在 API Center 选择已授权模型、创建最小权限 Key、查看示例并跟踪异步任务。", en: "Choose an entitled model, create a scoped key, use an example, and track asynchronous tasks in API Center." },
    primary: { label: { zh: "进入 API Center", en: "Open API Center" }, href: hubHref("/api/models", { entry: "developers" }) },
    secondary: { label: { zh: "公开文档", en: "Public docs" }, href: "/docs" },
    image: "/assets/usecase-ecommerce.webp",
    sections: [
      { title: { zh: "模型目录", en: "Model catalog" }, text: { zh: "查看输入类型、典型延迟、公开价格说明和组织授权状态。", en: "Review input types, typical latency, public pricing notes, and organization availability." } },
      { title: { zh: "安全凭证", en: "Scoped credentials" }, text: { zh: "API Key 只在创建时完整显示一次，并按用途设置范围和有效期。", en: "API keys are shown once and scoped by purpose and validity period." } },
      { title: { zh: "任务与用量", en: "Tasks and usage" }, text: { zh: "异步生成任务保留状态、错误和用量，便于排查与预算管理。", en: "Asynchronous generation keeps status, errors, and usage for diagnosis and budget control." } },
    ],
  },
  docs: {
    eyebrow: { zh: "公开文档", en: "Documentation" },
    title: { zh: "快速理解 VerdantFlare 的产品边界", en: "Understand VerdantFlare product boundaries quickly" },
    lead: { zh: "从公开市场、API 接入、Studio 与 Station 的职责开始，选择与你当前目标最相关的入口。", en: "Start with the public market, API access, Studio, and Station responsibilities, then choose the path that matches your goal." },
    primary: { label: { zh: "API 快速开始", en: "API quickstart" }, href: hubHref("/api/models", { entry: "docs" }) },
    secondary: { label: { zh: "浏览应用", en: "Browse apps" }, href: "/apps" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "市场与 Hub", en: "Market and Hub" }, text: { zh: "WWW 提供公开说明；登录后的 Hub 根据组织权益提供试用、API 和业务操作入口。", en: "WWW explains public capabilities; Hub exposes trials, APIs, and operations based on organization entitlements." } },
      { title: { zh: "Studio 与 Station", en: "Studio and Station" }, text: { zh: "Studio 管理正式项目，Station 是当前本机运行环境；应用从市场安装到当前 Station。", en: "Studio manages formal projects, while Station is the active local runtime where market apps are installed." } },
      { title: { zh: "安全与数据", en: "Security and data" }, text: { zh: "凭证、项目素材、体验临时数据和正式资产遵循不同的存储与生命周期边界。", en: "Credentials, project media, trial data, and formal assets follow separate storage and lifecycle boundaries." } },
    ],
  },
  pricing: {
    eyebrow: { zh: "套餐与合作", en: "Plans and engagement" },
    title: { zh: "先确认使用方式，再确定适合的套餐", en: "Choose a plan after confirming how you will use the platform" },
    lead: { zh: "公开页面只说明套餐结构。模型范围、额度、并发、有效期和企业服务以 Hub 权益或双方确认的方案为准。", en: "This page explains plan structure; model scope, quota, concurrency, validity, and enterprise service follow Hub entitlements or the confirmed service plan." },
    primary: { label: { zh: "咨询方案", en: "Discuss a plan" }, href: "/contact?intent=pricing" },
    secondary: { label: { zh: "先在线体验", en: "Try first" }, href: hubHref("/experience", { entry: "pricing" }) },
    image: "/assets/hero-glass-ad.webp",
    sections: [
      { title: { zh: "体验", en: "Experience" }, text: { zh: "适合快速验证一个模型或应用；临时数据自动清理，额度和并发受限。", en: "For quickly validating a model or app with limited quota, concurrency, and automatic cleanup." } },
      { title: { zh: "团队", en: "Team" }, text: { zh: "适合持续使用 API、Studio 与本地 Station 的创作团队，按成员和能力授权。", en: "For teams using APIs, Studio, and local Stations with member- and capability-based access." } },
      { title: { zh: "企业", en: "Enterprise" }, text: { zh: "适合需要企业身份、区域限制、专项额度、服务等级和交付支持的组织。", en: "For organizations needing enterprise identity, regional controls, dedicated quota, SLAs, and delivery support." } },
    ],
  },
  contact: {
    eyebrow: { zh: "联系团队", en: "Contact" },
    title: { zh: "告诉我们你想验证或接入什么", en: "Tell us what you want to evaluate or integrate" },
    lead: { zh: "选择目标并留下必要信息。提交只创建咨询线索，不会自动创建 Center 组织或开通付费权益。", en: "Choose a goal and leave the necessary details. Submitting creates an inquiry, not a Center organization or paid entitlement." },
    image: "/assets/usecase-ad-storyboard.webp",
    sections: [],
  },
};

const content = computed(() => pages[props.page] || pages.developers);
const text = (value) => value?.[props.locale] || value?.zh || "";

const submit = () => {
  submitted.value = true;
};
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
      <div class="public-wrap contact-layout">
        <div>
          <h2>{{ locale === 'en' ? 'Choose the shortest path' : '选择最短路径' }}</h2>
          <p>{{ locale === 'en' ? 'For a quick capability check, open Experience. For API integration or enterprise requirements, send an inquiry.' : '快速验证能力可直接进入体验中心；API 接入或企业需求可以提交咨询。' }}</p>
          <div class="contact-direct-links">
            <a :href="hubHref('/experience', { entry: 'contact' })">{{ locale === 'en' ? 'Open Experience' : '进入体验中心' }}</a>
            <a :href="hubHref('/api/models', { entry: 'contact' })">{{ locale === 'en' ? 'Open API Center' : '进入 API Center' }}</a>
          </div>
        </div>
        <form v-if="!submitted" class="contact-form" @submit.prevent="submit">
          <label><span>{{ locale === 'en' ? 'Goal' : '咨询目标' }}</span><select required><option>{{ locale === 'en' ? 'API trial' : 'API 试用' }}</option><option>{{ locale === 'en' ? 'Studio trial' : 'Studio 试用' }}</option><option>{{ locale === 'en' ? 'Enterprise' : '企业合作' }}</option></select></label>
          <label><span>{{ locale === 'en' ? 'Company or team' : '公司或团队' }}</span><input required /></label>
          <label><span>{{ locale === 'en' ? 'Contact' : '联系方式' }}</span><input type="email" required placeholder="name@company.com" /></label>
          <label><span>{{ locale === 'en' ? 'What do you want to achieve?' : '希望解决的问题' }}</span><textarea rows="5" required /></label>
          <label class="contact-consent"><input type="checkbox" required /><span>{{ locale === 'en' ? 'I agree to be contacted about this inquiry.' : '我同意团队就本次咨询与我联系。' }}</span></label>
          <button class="button primary" type="submit">{{ locale === 'en' ? 'Submit inquiry' : '提交咨询' }}</button>
        </form>
        <div v-else class="contact-success">
          <strong>{{ locale === 'en' ? 'Inquiry saved in this prototype' : '咨询已在当前原型中记录' }}</strong>
          <p>{{ locale === 'en' ? 'Backend submission will be connected after the page and field set are approved.' : '页面和字段确认后再接入后端提交，本次不会发送真实数据。' }}</p>
          <button class="button" @click="submitted = false">{{ locale === 'en' ? 'Submit another' : '重新填写' }}</button>
        </div>
      </div>
    </section>

    <section v-else class="public-journey">
      <div class="public-wrap">
        <div>
          <h2>{{ locale === 'en' ? 'Continue with your organization context' : '带着组织上下文继续' }}</h2>
          <p>{{ locale === 'en' ? 'Sign in to see the models, apps, quota, and operations available to your organization.' : '登录后查看当前组织真正可用的模型、应用、额度和操作。' }}</p>
        </div>
        <a class="button primary" :href="hubHref('/', { entry: page })">{{ locale === 'en' ? 'Open Hub' : '进入 Hub' }}</a>
      </div>
    </section>
  </main>
</template>
