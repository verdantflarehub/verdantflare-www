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
      { title: { zh: "让成果留下依据", en: "Keep the context behind the result" }, text: { zh: "视频是成果，不等于可编辑工程。VF 正在完善结果、来源与项目版本的衔接；下载、归档和后续复用以具体入口的实际支持为准。", en: "A video is an output, not necessarily an editable project. VF is improving the connection between results, provenance, and project versions; downloads, archiving, and reuse depend on the capabilities available at each entry point." } },
    ],
  },
  "solution-creator": {
    eyebrow: { zh: "创作与资产复用", en: "Creation and asset reuse" },
    title: { zh: "作品完成了，积累才刚开始。", en: "Finished work. A new starting point." },
    lead: { zh: "一份角色参考、一套场景资料、一份真实工程，都值得留给下一次创作。VF 已有固定版本、来源记录与受控存储基础，正在完善从项目成果到资产、再到新项目的复用体验。", en: "A character reference, scene materials, or source project can be a starting point for your next creation. VF has foundations for fixed versions, provenance, and controlled storage. We’re improving the path from project outputs to reusable assets and new projects." },
    primary: { label: { zh: "浏览应用", en: "Browse apps" }, href: "/apps" },
    secondary: { label: { zh: "进入 Hub", en: "Open Hub" }, href: hubHref("/", { entry: "solution-creator" }) },
    image: "/assets/usecase-ad-storyboard.webp",
    sections: [
      { title: { zh: "保存，不只保留结果", en: "Keep more than the result" }, text: { zh: "从 Studio 进入 Project，记录项目修订和选用版本。结果素材与真实工程分开保留；应用没有提供的源文件，不会因入库而自动出现。", en: "Open Project through Studio to record revisions and selected versions. Keep output media distinct from source files; archiving cannot create source files an app never provided." } },
      { title: { zh: "入库，不等于公开", en: "An asset library is not public sharing" }, text: { zh: "在 World 中登记明确选中的成果，保留来源与固定版本。资产授权与项目权限分别核对，不自动上传到公开市场；查找和预览体验仍在完善。", en: "Register explicitly selected outputs in World with provenance and fixed versions. Asset and project permissions are checked separately, with no automatic publication to a public market. Discovery and preview experiences are still being improved." } },
      { title: { zh: "复用，不只是复制文件", en: "Reuse is more than copying files" }, text: { zh: "将资产固定版本带入下一项目，再检查应用、模型和依赖是否满足。已有引用保存入口，但各类工程的实际编辑、重跑与完整跨项目流程仍需逐项验证。", en: "Bring a fixed asset version into the next project, then check app, model, and dependency requirements. Reference saving is implemented; editing, rerunning, and complete cross-project workflows still require validation for each type of project." } },
    ],
  },
  "solution-enterprise": {
    eyebrow: { zh: "企业解决方案", en: "Enterprise solution" },
    title: { zh: "让团队的成果，成为长期积累。", en: "Turn team output into lasting value." },
    lead: { zh: "围绕项目版本、素材来源与资产复用，梳理团队的创作流程。平台权益由 Center 管理，私有项目和资产遵循客户部署的数据边界；实际交付范围需按环境与应用确认。", en: "Shape your team’s workflow around project versions, provenance, and asset reuse. Center manages platform access; private projects and assets follow your deployment’s data boundaries. Delivery scope depends on the environment and apps." },
    primary: { label: { zh: "联系企业顾问", en: "Contact enterprise" }, href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Enterprise" },
    secondary: { label: { zh: "查看公开套餐", en: "View public plans" }, href: "/pricing" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "版本有依据", en: "Know which version was used" }, text: { zh: "已有固定修订与资产引用基础，帮助记录项目选用了哪一版内容。版本比较、引用关系和团队复用体验仍在完善。", en: "Fixed revisions and asset references provide a foundation for recording which version a project used. Version comparisons, reference views, and team reuse experiences are still being improved." } },
      { title: { zh: "权限分清楚", en: "Keep permissions distinct" }, text: { zh: "组织模型权益、项目成员权限与资产授权不是同一件事。能读取素材不等于取得商用许可，正式使用前仍需核对来源与授权范围。", en: "Organization model access, project membership, and asset grants are separate. Permission to read a file does not establish commercial rights; check its origin and license before use." } },
      { title: { zh: "数据边界讲明白", en: "Be explicit about data boundaries" }, text: { zh: "Center 不直接读取客户私有资产。Station 可以在客户自己的基础设施运行，但不一定是个人电脑；调用外部模型时仍可能外发输入。备份、恢复与留存范围需单独确认。", en: "Center does not directly read private customer assets. A Station can run on customer infrastructure, not necessarily a personal computer; external model calls may still send inputs outside that boundary. Backup, recovery, and retention scope must be agreed separately." } },
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
    lead: { zh: "先分清工具、项目与资产：在 Hub 了解模型和应用，从 Studio 进入项目与资产功能，由关联 Station 提供执行环境。具体能力以当前接入范围为准。", en: "Distinguish tools, projects, and assets: discover models and apps in Hub, access project and asset features through Studio, and run apps on the connected Station. Availability depends on your current integration." },
    primary: { label: { zh: "API 快速开始", en: "API quickstart" }, href: hubHref("/api/models", { entry: "docs" }) },
    secondary: { label: { zh: "了解资产复用", en: "Explore asset reuse" }, href: "/solutions/creator" },
    image: "/assets/usecase-previz-room.webp",
    sections: [
      { title: { zh: "市场与 Hub", en: "Market and Hub" }, text: { zh: "WWW 展示公开资料；Hub 提供已开放的模型体验、API Key 与用量入口。Hub 应用市场当前仅展示应用资料，不提供应用在线试用。", en: "WWW presents public information. Hub provides enabled model experiences, API key management, and usage. Hub App Market currently displays app details without online app trials." } },
      { title: { zh: "项目与资产", en: "Projects and assets" }, text: { zh: "Studio 是统一入口，Project 管项目修订与固定引用，World 管跨项目资产，Artifact 管内容存储。已有基础能力，独立应用迁移与完整复用体验仍待完成验收。", en: "Studio is the shared entry point. Project manages revisions and fixed references, World manages cross-project assets, and Artifact stores content. Foundations exist, while independent app migration and the complete reuse experience still await full validation." } },
      { title: { zh: "执行与交接", en: "Execution and handoff" }, text: { zh: "应用安装和执行发生在关联 Station，不默认在个人电脑。Hub 到 Studio 的应用分发仍在对接；模型体验结果不会自动进入正式项目，调用外部模型须核对输入外发范围。", en: "App installation and execution take place on the connected Station, not necessarily your personal computer. App distribution from Hub to Studio is still being integrated; model-experience results are not automatically added to projects. Check what inputs external model calls send out." } },
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
      { title: { zh: "团队与企业接入", en: "Team & Enterprise" }, text: { zh: "围绕 API、项目交付与资产积累需求，评估应用适配、部署和数据边界。模型额度、备份留存及服务范围单独确认，不默认包含完整资产管理交付。", en: "Review app integration, deployment, and data boundaries around your API, project delivery, and asset management needs. Model credits, backup retention, and service scope are agreed separately; a complete asset management rollout is not included by default." } },
    ],
  },
  contact: {
    eyebrow: { zh: "联系团队", en: "Contact" },
    title: { zh: "聊聊你想做的事。", en: "Tell us what you want to make." },
    lead: { zh: "无论是验证一个想法、接入模型，还是梳理团队的项目与资产流程，都可以通过邮件联系我们。", en: "Whether you’re testing an idea, integrating models, or planning your team’s project and asset workflow, get in touch by email." },
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
          <p>{{ locale === 'en' ? 'Tell us about your creative goals, asset types, existing tools, and deployment needs. Please do not include private assets or credentials. The button opens your email application; review and send your message there.' : '欢迎说明创作目标、资产类型、现有工具与部署需求；无需附上私有素材或凭据。点击按钮会打开邮件应用，由你确认内容后发送。' }}</p>
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
          <h2>{{ locale === 'en' ? 'Discover tools in Hub.' : '下一步，先在 Hub 了解工具。' }}</h2>
          <p>{{ locale === 'en' ? 'Browse model and app listings, and use enabled model experiences with the required access. Hub does not offer online app trials or manage private project assets. App distribution to Studio is still being integrated.' : '浏览模型与应用资料，按权限体验已开放模型。Hub 不提供应用在线试用，也不管理私有项目资产；向 Studio 分发应用的链路仍在对接。' }}</p>
        </div>
        <a class="button primary" :href="hubHref('/', { entry: page })">{{ locale === 'en' ? 'Open Hub' : '进入 Hub' }}</a>
      </div>
    </section>
  </main>
</template>
