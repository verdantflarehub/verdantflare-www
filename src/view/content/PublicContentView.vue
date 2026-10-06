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
    title: { zh: "让脑海中的镜头，先一步出现。", en: "Bring the shot in your mind into view." },
    lead: { zh: "从描述和参考素材开始，探索广告、短片与分镜预演的不同可能。提交后，在任务记录中跟踪进展。", en: "Start with a prompt and references. Explore ideas for ads, short films, and storyboards, then follow progress in your task history." },
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
    title: { zh: "从灵感出发，把创作连起来。", en: "From first spark to a creative workflow." },
    lead: { zh: "发现适合的模型与应用，在 Hub 中确认授权、在线体验，再通过 Studio 在当前 Station 开展本地创作。", en: "Discover models and apps, check access and try them in Hub, then use Studio to create on your active Station." },
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
    title: { zh: "找到入口，开始你的第一次创作。", en: "Find your way to your first creation." },
    lead: { zh: "了解如何发现模型、接入 API，或通过 Studio 在当前 Station 使用应用。从你想完成的事情开始。", en: "Learn how to discover models, connect through the API, or use Studio apps on your active Station. Start with what you want to make." },
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
    title: { zh: "为你的创作，找到合适的方案。", en: "Find the right plan for your work." },
    lead: { zh: "从创作与体验到团队与企业接入，先选择使用阶段。模型范围、额度、并发、有效期和价格以 Hub 权益或双方确认的方案为准。", en: "Start with your stage, from creation and exploration to team integration. Model scope, credits, concurrency, validity, and pricing follow Hub entitlements or your confirmed agreement." },
    primary: { label: { zh: "咨询方案", en: "Discuss a plan" }, href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Plans" },
    secondary: { label: { zh: "先在线体验", en: "Try first" }, href: hubHref("/experience", { entry: "pricing" }) },
    image: "/assets/hero-glass-ad.webp",
    sections: [
      { title: { zh: "创作与体验", en: "Create & Explore" }, text: { zh: "浏览已公开能力，并在获得组织授权后使用已开放的在线体验；额度与用量在 Hub 查看。", en: "Discover published capabilities and try enabled experiences after organization access is granted; see credits and usage in Hub." } },
      { title: { zh: "团队与企业接入", en: "Team & Enterprise" }, text: { zh: "围绕持续 API 调用、成员协作和正式项目交付，单独确认模型、额度与服务范围。", en: "For ongoing API use, team collaboration, and formal project delivery, confirm models, credits, and service scope separately." } },
    ],
  },
  contact: {
    eyebrow: { zh: "联系团队", en: "Contact" },
    title: { zh: "聊聊你想做的事。", en: "Tell us what you want to make." },
    lead: { zh: "无论是验证一个想法，还是为团队接入模型，都可以通过邮件联系我们。下方表单仅供本地预览，尚未接入发送服务。", en: "Whether you’re testing an idea or bringing models to your team, get in touch by email. The form below is a local preview only and does not send an inquiry." },
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
            <a href="mailto:hello@verdantflarehub.com">hello@verdantflarehub.com</a>
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
          <button class="button primary" type="submit">{{ locale === 'en' ? 'Preview only · not sent' : '预览填写结果 · 不会发送' }}</button>
        </form>
        <div v-else class="contact-success">
          <strong>{{ locale === 'en' ? 'Preview complete. Nothing was sent.' : '预览完成，信息未发送。' }}</strong>
          <p>{{ locale === 'en' ? 'This form is not connected to a sending service and does not save your inquiry. Please email hello@verdantflarehub.com to reach the team.' : '此表单尚未接入发送服务，也不会保存咨询。请发送邮件至 hello@verdantflarehub.com 联系团队。' }}</p>
          <button class="button" @click="submitted = false">{{ locale === 'en' ? 'Submit another' : '重新填写' }}</button>
        </div>
      </div>
    </section>

    <section v-else class="public-journey">
      <div class="public-wrap">
        <div>
          <h2>{{ locale === 'en' ? 'Make your next move in Hub.' : '下一步，在 Hub 中开始。' }}</h2>
          <p>{{ locale === 'en' ? 'Sign in to see your organization’s models, apps, and credits.' : '登录后查看当前组织可用的模型、应用与额度。' }}</p>
        </div>
        <a class="button primary" :href="hubHref('/', { entry: page })">{{ locale === 'en' ? 'Open Hub' : '进入 Hub' }}</a>
      </div>
    </section>
  </main>
</template>
