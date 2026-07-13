<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import AppDetail from "./view/app/detail/index.vue";
import AppHistory from "./view/app/history/index.vue";
import AppList from "./view/app/list/index.vue";
import Login from "./view/login/index.vue";
import ModelDetail from "./view/model/detail/index.vue";
import ModelList from "./view/model/list/index.vue";
import ModelOrder from "./view/model/order/index.vue";

const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const navItems = [
  { href: "/#home", label: { zh: "首页", en: "Home" } },
  { href: "/#model", label: { zh: "模型", en: "Model" } },
  { href: "/#apps", label: { zh: "应用", en: "Apps" } },
  { href: "/#video", label: { zh: "视频", en: "Video" } },
  {
    href: "https://github.com/verdantflarehub",
    label: { zh: "Github", en: "Github" },
    external: true,
  },
  { href: "/#price", label: { zh: "合作", en: "Price" } },
  { href: "/#faq", label: { zh: "FAQ", en: "FAQ" } },
];

const currentPath = ref(window.location.pathname);
const currentHash = ref(window.location.hash);
const locale = ref(localStorage.getItem("verdantflare_locale") || "zh");

const route = computed(() => {
  const path = currentPath.value.replace(/\/+$/, "") || "/";
  const hash = currentHash.value.replace(/^#\/?/, "").replace(/\/+$/, "");

  if (hash === "login") {
    return { name: "login" };
  }

  if (hash === "market") {
    return { name: "model-list" };
  }

  if (hash === "market/order") {
    return { name: "model-order" };
  }

  if (hash.startsWith("market/detail/")) {
    const segments = hash.split("/").filter(Boolean);
    return { name: "model-detail", modelId: segments.at(-1) };
  }

  if (hash === "app-market") {
    return { name: "app-list" };
  }

  if (hash.startsWith("app-market/detail/")) {
    const segments = hash.split("/").filter(Boolean);
    return { name: "app-detail", appId: segments.at(-1) };
  }

  if (hash.startsWith("app-market/history/")) {
    const segments = hash.split("/").filter(Boolean);
    return { name: "app-history", appId: segments.at(-1) };
  }

  if (path === "/view/model/list") {
    return { name: "model-list" };
  }

  if (path === "/view/model/order") {
    return { name: "model-order" };
  }

  if (path === "/app" || path === "/view/app/list") {
    return { name: "app-list" };
  }

  if (path.startsWith("/app/detail") || path.startsWith("/view/app/detail")) {
    const segments = path.split("/").filter(Boolean);
    return { name: "app-detail", appId: segments.at(-1) };
  }

  if (path.startsWith("/app/history") || path.startsWith("/view/app/history")) {
    const segments = path.split("/").filter(Boolean);
    return { name: "app-history", appId: segments.at(-1) };
  }

  if (path === "/login") {
    return { name: "login" };
  }

  if (path.startsWith("/view/model/detail")) {
    const segments = path.split("/").filter(Boolean);
    return { name: "model-detail", modelId: segments.at(-1) };
  }

  return { name: "home" };
});

const isEnglish = computed(() => locale.value === "en");
const langLabel = computed(() => (isEnglish.value ? "EN / 中文" : "中文 / EN"));

const toggleLocale = () => {
  locale.value = isEnglish.value ? "zh" : "en";
  localStorage.setItem("verdantflare_locale", locale.value);
};

const getLabel = (label) => label[locale.value] || label.zh;

const copy = {
  zh: {
    login: "登录",
    heroTitle: "青焰Hub",
    heroSubtitle: "青焰视频生成",
    heroCopy:
      "面向短视频创作者、企业内容团队和开发者，提供视频生成模型、模型市场、积分购买和合作入口。首页保持完整品牌介绍，也可以在站内切换到模型市场继续浏览。",
    heroPriceCta: "咨询青焰套餐",
    heroFlowCta: "了解交付流程",
    modelKicker: "Model",
    modelTitle: "模型市场承接所有可调用能力和积分订单。",
    modelLead:
      "首页先说明产品和服务边界，模型区负责把用户引导到模型市场，继续查看模型列表、价格、API 接入方式和订单入口。",
    modelCta: "进入模型市场",
    appKicker: "Apps",
    appTitle: "应用市场负责承接工具、工作流和应用安装入口。",
    appLead:
      "应用区按照模型区的方式展示核心应用能力，用户先在首页了解应用类型，再进入应用市场查看应用列表、详情、版本和权限说明。",
    appCta: "进入应用市场",
    videoKicker: "Video Generation",
    videoTitle: "从脚本、分镜和商品卖点生成可测试的视频素材。",
    videoLead:
      "视频生成是首页的核心能力展示。样片区优先展示短视频、广告、电商和分镜预演四类高频场景。",
    videoCta: "体验视频生成",
    packagesKicker: "Packages",
    packagesTitle: "先用咨询型套餐上线，等交付稳定后再公开价格。",
    packagesLead:
      "第一版不需要复杂价格表。把适用人群、额度范围和交付规则讲清楚，比展示一堆数字更可信。",
    workflowKicker: "Workflow",
    workflowTitle: "交付流程要比视觉更清楚。",
    workflowLead:
      "早期项目最重要的是降低沟通成本。用户下单前就应该知道额度、有效期、交付方式和售后边界。",
    rulesKicker: "Rules",
    rulesTitle: "下单前说清楚，比上线后讲故事更重要。",
    rulesLead:
      "所有套餐以下单前确认的信息为准，包括额度、有效期、交付方式、可用范围和售后规则。大额采购、长期使用或企业需求，请先联系客服确认库存与稳定性。",
    priceKicker: "Price",
    priceTitle: "合作先确认模型、额度和交付方式。",
    faqKicker: "FAQ",
    faqTitle: "常见问题",
    footerBrand: "青焰Hub · www.verdantflarehub.com",
    footerLinks: "服务规则 / 隐私政策 / 售后说明 / 备案信息占位",
  },
  en: {
    login: "Login",
    heroTitle: "verdantflare Hub",
    heroSubtitle: "verdantflare Video Generation",
    heroCopy:
      "Built for short-form creators, content teams, and developers. Access video generation models, the model marketplace, credit purchasing, and partnership support from one site.",
    heroPriceCta: "Consult Packages",
    heroFlowCta: "View Workflow",
    modelKicker: "Model",
    modelTitle: "The model marketplace hosts callable models, credits, and orders.",
    modelLead:
      "The home page explains the product and service boundaries, while the model section guides users to model lists, pricing, API integration, and ordering.",
    modelCta: "Enter Model Market",
    appKicker: "Apps",
    appTitle: "The app market hosts tools, workflows, and installable app entries.",
    appLead:
      "The app section mirrors the model section: introduce app capabilities on the home page, then guide users into the app market for lists, details, versions, and permissions.",
    appCta: "Enter App Market",
    videoKicker: "Video Generation",
    videoTitle: "Generate testable video assets from scripts, storyboards, and product ideas.",
    videoLead:
      "Video generation is the core capability on this page, with examples for short videos, ads, ecommerce, and storyboard previews.",
    videoCta: "Try Video Generation",
    packagesKicker: "Packages",
    packagesTitle: "Start with consultative packages, then publish prices after delivery stabilizes.",
    packagesLead:
      "The first version does not need a complex price table. Clear audience, credit range, and delivery rules are more credible than a pile of numbers.",
    workflowKicker: "Workflow",
    workflowTitle: "The delivery workflow must be clearer than the visuals.",
    workflowLead:
      "Early-stage projects need lower communication cost. Users should know the credits, validity, delivery method, and support boundaries before ordering.",
    rulesKicker: "Rules",
    rulesTitle: "Clarify terms before ordering; storytelling can wait.",
    rulesLead:
      "All packages follow the information confirmed before ordering, including credits, validity, delivery method, usage scope, and support rules. For large purchases, long-term use, or enterprise needs, contact support first.",
    priceKicker: "Price",
    priceTitle: "Confirm models, credits, and delivery before cooperation.",
    faqKicker: "FAQ",
    faqTitle: "Frequently Asked Questions",
    footerBrand: "verdantflare Hub · www.verdantflarehub.com",
    footerLinks: "Service Rules / Privacy Policy / Support Terms / ICP Placeholder",
  },
};

const text = computed(() => copy[locale.value] || copy.zh);

const scrollToHash = () => {
  const hash = window.location.hash.replace(/^#/, "");
  if (
    !["home", "model", "apps", "video", "scenes", "flow", "price", "faq"].includes(hash)
  ) {
    return;
  }

  nextTick(() => {
    const target = document.getElementById(hash);
    target?.scrollIntoView({ block: "start" });
  });
};

const scrollRouteToTop = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const hash = window.location.hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  const shouldReset =
    hash === "login" ||
    hash === "market" ||
    hash === "market/order" ||
    hash.startsWith("market/detail/") ||
    hash === "app-market" ||
    hash.startsWith("app-market/detail/") ||
    hash.startsWith("app-market/history/") ||
    path === "/login" ||
    path === "/view/model/list" ||
    path === "/view/model/order" ||
    path.startsWith("/view/model/detail") ||
    path === "/app" ||
    path === "/view/app/list" ||
    path.startsWith("/app/detail") ||
    path.startsWith("/app/history") ||
    path.startsWith("/view/app/detail") ||
    path.startsWith("/view/app/history");

  if (!shouldReset) return;

  nextTick(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
};

const handleNavigation = () => {
  currentPath.value = window.location.pathname;
  currentHash.value = window.location.hash;
  scrollToHash();
  scrollRouteToTop();
};

onMounted(() => {
  window.addEventListener("popstate", handleNavigation);
  window.addEventListener("hashchange", handleNavigation);
  scrollToHash();
  scrollRouteToTop();
});

onUnmounted(() => {
  window.removeEventListener("popstate", handleNavigation);
  window.removeEventListener("hashchange", handleNavigation);
});

const heroMeta = [
  {
    title: { zh: "核心能力", en: "Core" },
    text: { zh: "文本到视频 / 分镜成片", en: "Text-to-video / storyboard to clip" },
  },
  {
    title: { zh: "服务形态", en: "Service" },
    text: { zh: "模型额度与 API 接入", en: "Credits and API access" },
  },
  {
    title: { zh: "适用团队", en: "Audience" },
    text: { zh: "创作者、企业、开发者", en: "Creators, teams, developers" },
  },
  {
    title: { zh: "合作", en: "Price" },
    text: { zh: "定制额度和交付方案", en: "Custom credits and delivery" },
  },
];

const storyLines = [
  {
    label: "Prompt",
    text: {
      zh: "一支 8 秒产品广告片，清晨自然光，玻璃杯中冰块缓慢落下。",
      en: "An 8-second product ad, morning natural light, ice dropping into a glass.",
    },
  },
  {
    label: "Frame",
    text: {
      zh: "close-up / slow motion / product reveal / soft morning light",
      en: "close-up / slow motion / product reveal / soft morning light",
    },
  },
  {
    label: "Delivery",
    text: {
      zh: "青焰模型服务咨询，额度和交付方式下单前确认。",
      en: "Consult verdantflare model service; confirm credits and delivery before ordering.",
    },
  },
];

const modelItems = [
  {
    title: { zh: "统一模型入口", en: "Unified Model Entry" },
    text: {
      zh: "把可用模型、积分价格、API 示例和订单入口集中到模型市场，方便用户快速比较和接入。",
      en: "Collect available models, credit pricing, API examples, and ordering in one marketplace for easier comparison and integration.",
    },
  },
  {
    title: { zh: "额度和 API 接入", en: "Credits and API Access" },
    text: {
      zh: "围绕文本、推理、图片理解、视频生成等模型能力，提供积分额度、调用示例和交付说明。",
      en: "Provide credits, request examples, and delivery notes for text, reasoning, vision, video generation, and related model capabilities.",
    },
  },
  {
    title: { zh: "合作支持", en: "Partnership Support" },
    text: {
      zh: "面向团队采购、长期额度和生产环境接入，提前确认模型范围、交付周期和售后边界。",
      en: "For team purchases, long-term credits, and production access, confirm model scope, delivery schedule, and support boundaries first.",
    },
  },
];

const appItems = [
  {
    title: { zh: "本地 AI 与 Agent", en: "Local AI and Agents" },
    text: {
      zh: "围绕 Ollama、OpenClaw、Open WebUI 等应用，提供本地模型、对话入口和智能体能力。",
      en: "Provide local models, chat surfaces, and agent capabilities through apps such as Ollama, OpenClaw, and Open WebUI.",
    },
  },
  {
    title: { zh: "创作与工作流", en: "Creation and Workflows" },
    text: {
      zh: "支持 ComfyUI、n8n 等创作和自动化应用，把模型能力接到真实生产流程。",
      en: "Support creation and automation apps such as ComfyUI and n8n, connecting model capabilities to real workflows.",
    },
  },
  {
    title: { zh: "版本和权限透明", en: "Transparent Versions and Permissions" },
    text: {
      zh: "详情页展示版本历史、资源规格、权限说明和安装入口，降低试用和部署成本。",
      en: "Detail pages expose version history, resource specs, permissions, and install actions to reduce deployment friction.",
    },
  },
];

const scenes = [
  {
    index: "01 / Script",
    title: { zh: "短视频脚本成片", en: "Short Video Scripts" },
    text: {
      zh: "把脚本、分镜或镜头描述转成视频素材，用于内容前期验证。",
      en: "Turn scripts, storyboards, or shot descriptions into video assets for early content validation.",
    },
    image: "usecase-script-video.webp",
    alt: { zh: "短视频脚本成片创作者工作室", en: "Creator studio for short video script generation" },
  },
  {
    index: "02 / Ad",
    title: { zh: "广告创意测试", en: "Ad Creative Testing" },
    text: {
      zh: "快速生成多版视觉方向，用于投放素材、产品卖点和品牌短片预览。",
      en: "Generate multiple visual directions for ad assets, product messages, and brand film previews.",
    },
    image: "usecase-ad-storyboard.webp",
    alt: { zh: "广告创意测试分镜工作台", en: "Storyboard desk for ad creative testing" },
  },
  {
    index: "03 / Product",
    title: { zh: "电商产品展示", en: "Ecommerce Product Display" },
    text: {
      zh: "围绕商品图、卖点和场景描述生成动态素材，提高内容迭代速度。",
      en: "Create dynamic assets from product images, selling points, and scene prompts to speed up iteration.",
    },
    image: "usecase-ecommerce.webp",
    alt: { zh: "电商产品展示视频静帧", en: "Video still for ecommerce product display" },
  },
  {
    index: "04 / Previz",
    title: { zh: "故事板与分镜预演", en: "Storyboard Previsualization" },
    text: {
      zh: "为导演、设计师和创意团队提供低成本的视频预览。",
      en: "Provide low-cost video previews for directors, designers, and creative teams.",
    },
    image: "usecase-previz-room.webp",
    alt: { zh: "故事板与分镜预演空间", en: "Storyboard and previs workspace" },
  },
];

const packages = [
  {
    label: "Starter",
    title: { zh: "创作者试用", en: "Creator Trial" },
    text: {
      zh: "适合个人测试和小批量生成，重点是快速跑通第一批素材。",
      en: "For individual testing and small batches, focused on getting the first assets running quickly.",
    },
    features: [
      { zh: "小额额度咨询", en: "Small credit consultation" },
      { zh: "下单前确认有效期", en: "Confirm validity before ordering" },
      { zh: "基础使用说明", en: "Basic usage notes" },
    ],
    cta: { zh: "咨询", en: "Consult" },
  },
  {
    label: "Team",
    title: { zh: "内容团队", en: "Content Team" },
    text: {
      zh: "适合短视频账号、广告素材和批量试错，先确认库存和交付周期。",
      en: "For short-video accounts, ad assets, and batch testing. Confirm availability and delivery timing first.",
    },
    features: [
      { zh: "中等额度需求", en: "Medium credit needs" },
      { zh: "批量需求确认", en: "Batch requirement confirmation" },
      { zh: "交付记录说明", en: "Delivery record notes" },
    ],
    cta: { zh: "获取报价", en: "Get Quote" },
  },
  {
    label: "Custom",
    title: { zh: "定制需求", en: "Custom Needs" },
    text: {
      zh: "适合长期使用、大额额度或特殊交付方式，单独约定售后规则。",
      en: "For long-term use, larger credit needs, or special delivery methods with agreed support terms.",
    },
    features: [
      { zh: "先确认库存", en: "Confirm availability first" },
      { zh: "约定交付方式", en: "Agree on delivery method" },
      { zh: "明确售后边界", en: "Define support boundaries" },
    ],
    cta: { zh: "联系客服", en: "Contact Support" },
  },
];

const flowSteps = [
  {
    step: "01",
    title: { zh: "提交需求", en: "Submit Needs" },
    text: {
      zh: "说明使用量、用途、交付时间和是否批量采购。",
      en: "Describe usage volume, purpose, delivery time, and whether it is a batch purchase.",
    },
  },
  {
    step: "02",
    title: { zh: "人工确认", en: "Manual Confirmation" },
    text: {
      zh: "确认额度、有效期、交付方式和售后边界。",
      en: "Confirm credits, validity, delivery method, and support boundaries.",
    },
  },
  {
    step: "03",
    title: { zh: "完成付款", en: "Complete Payment" },
    text: {
      zh: "按确认后的套餐付款，并保留订单记录。",
      en: "Pay for the confirmed package and keep the order record.",
    },
  },
  {
    step: "04",
    title: { zh: "交付使用", en: "Delivery" },
    text: {
      zh: "提供调用凭证、账号/额度说明或对应使用方式。",
      en: "Receive API credentials, account or credit notes, or the agreed usage method.",
    },
  },
  {
    step: "05",
    title: { zh: "售后协助", en: "Support" },
    text: {
      zh: "遇到不可用或交付异常，按订单规则协商处理。",
      en: "If delivery or availability issues occur, handle them according to the order terms.",
    },
  },
];

const rules = [
  {
    label: { zh: "套餐内容", en: "Package Content" },
    text: {
      zh: "以下单前确认的信息为准，页面文案不替代最终订单约定。",
      en: "Confirmed pre-order information prevails; page copy does not replace final order terms.",
    },
  },
  {
    label: { zh: "有效期", en: "Validity" },
    text: {
      zh: "不同额度和交付方式可能有不同有效期，需要提前说明。",
      en: "Different credits and delivery methods may have different validity periods and should be stated in advance.",
    },
  },
  {
    label: { zh: "大额采购", en: "Large Purchase" },
    text: {
      zh: "不建议直接下单，先确认库存、交付周期和稳定性。",
      en: "Do not order directly for large purchases; confirm availability, delivery cycle, and stability first.",
    },
  },
  {
    label: { zh: "合规用途", en: "Compliant Use" },
    text: {
      zh: "不支持违法、侵权或违反平台规则的用途。",
      en: "Illegal, infringing, or platform-violating use cases are not supported.",
    },
  },
];

const faqs = [
  {
    question: { zh: "青焰Hub 现在主要提供什么？", en: "What does verdantflare Hub provide now?" },
    answer: {
      zh: "第一阶段主要提供青焰视频生成模型服务的额度咨询、套餐交付和使用协助。",
      en: "In the first phase, verdantflare Hub provides credit consultation, package delivery, and usage support for verdantflare video generation model services.",
    },
  },
  {
    question: { zh: "下单后多久交付？", en: "How long does delivery take after ordering?" },
    answer: {
      zh: "以客服下单前确认为准。不同套餐、库存和交付方式会影响交付时间。",
      en: "Delivery time follows the confirmation before ordering. Package type, availability, and delivery method may all affect timing.",
    },
  },
  {
    question: { zh: "是否可以直接写价格？", en: "Can fixed prices be listed directly?" },
    answer: {
      zh: "如果套餐和库存稳定，可以写固定价格；如果还在早期，建议先用咨询套餐和获取报价。",
      en: "If packages and availability are stable, fixed prices can be listed. In the early stage, consultation packages and quotes are safer.",
    },
  },
  {
    question: { zh: "青焰额度是否永久有效？", en: "Are verdantflare credits valid forever?" },
    answer: {
      zh: "不建议承诺永久有效。有效期、限制和售后规则应以下单前确认为准。",
      en: "Permanent validity should not be promised. Validity, limits, and support rules should follow the pre-order confirmation.",
    },
  },
  {
    question: { zh: "青焰模型是什么？", en: "What is the verdantflare model?" },
    answer: {
      zh: "青焰模型是面向视频生成的智能体模型服务，统一调度文本理解、分镜生成、视频生成和超分增强能力，对外提供青焰自己的模型服务入口。",
      en: "verdantflare is an agent-style model service for video generation, coordinating text understanding, storyboard creation, video generation, and upscaling through verdantflare's own service entry.",
    },
  },
  {
    question: { zh: "后续会支持更多模型能力吗？", en: "Will more model capabilities be supported later?" },
    answer: {
      zh: "会持续增强生成、编辑、超分和工作流能力，但官网对外统一以青焰模型服务呈现。",
      en: "Generation, editing, upscaling, and workflow capabilities will continue to improve, while the website presents them as verdantflare model services.",
    },
  },
];
</script>

<template>
  <header class="site-header">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="/#home" aria-label="青焰Hub 首页">
        <i class="brand-mark" aria-hidden="true"></i>
        <span>{{ text.heroTitle }}</span>
      </a>
      <div class="nav-links" aria-label="页面导航">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
        >
          {{ getLabel(item.label) }}
        </a>
      </div>
      <div class="nav-actions">
        <a class="nav-login" href="/#login">{{ text.login }}</a>
        <button class="nav-lang" type="button" @click="toggleLocale">
          {{ langLabel }}
        </button>
      </div>
    </nav>
  </header>

  <ModelList v-if="route.name === 'model-list'" :locale="locale" />
  <ModelDetail
    v-else-if="route.name === 'model-detail'"
    :model-id="route.modelId"
    :locale="locale"
  />
  <ModelOrder v-else-if="route.name === 'model-order'" :locale="locale" />
  <AppList v-else-if="route.name === 'app-list'" :locale="locale" />
  <AppDetail
    v-else-if="route.name === 'app-detail'"
    :app-id="route.appId"
    :locale="locale"
  />
  <AppHistory
    v-else-if="route.name === 'app-history'"
    :app-id="route.appId"
    :locale="locale"
  />
  <Login v-else-if="route.name === 'login'" />

  <main v-else id="home">
    <section
      class="hero"
      aria-labelledby="hero-title"
      :style="{ '--hero-image': `url('${assetPath('hero-glass-ad.webp')}')` }"
    >
      <div class="hero-inner">
        <div>
          <p class="eyebrow">www.verdantflarehub.com</p>
          <h1 id="hero-title">{{ text.heroTitle }} <span>{{ text.heroSubtitle }}</span></h1>
          <p class="hero-copy">
            {{ text.heroCopy }}
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#price">{{ text.heroPriceCta }}</a>
            <a class="button" href="#flow">{{ text.heroFlowCta }}</a>
          </div>
          <div class="hero-meta" aria-label="服务摘要">
            <div v-for="item in heroMeta" :key="getLabel(item.title)">
              <strong>{{ getLabel(item.title) }}</strong>
              {{ getLabel(item.text) }}
            </div>
          </div>
        </div>

        <div class="storyboard" aria-label="视频创作流程示例">
          <div v-for="line in storyLines" :key="line.label" class="story-line">
            <b>{{ line.label }}</b>
            <span>{{ getLabel(line.text) }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="model" class="section dark">
      <div class="wrap">
        <p class="section-kicker">{{ text.modelKicker }}</p>
        <h2 class="section-title">{{ text.modelTitle }}</h2>
        <p class="section-lead">
          {{ text.modelLead }}
        </p>
        <div class="section-actions">
          <a class="button primary" href="/#market">{{ text.modelCta }}</a>
        </div>

        <div class="intro-grid">
          <figure class="feature-image">
            <img
              :src="assetPath('usecase-ad-storyboard.webp')"
              :alt="
                isEnglish
                  ? 'Storyboard desk for ad creative testing'
                  : '广告分镜和创意测试的工作台画面'
              "
              loading="lazy"
            />
          </figure>
          <div class="plain-list">
            <article
              v-for="item in modelItems"
              :key="getLabel(item.title)"
              class="plain-item"
            >
              <h3>{{ getLabel(item.title) }}</h3>
              <p>{{ getLabel(item.text) }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="apps" class="section dark">
      <div class="wrap">
        <p class="section-kicker">{{ text.appKicker }}</p>
        <h2 class="section-title">{{ text.appTitle }}</h2>
        <p class="section-lead">
          {{ text.appLead }}
        </p>
        <div class="section-actions">
          <a class="button primary" href="/#app-market">{{ text.appCta }}</a>
        </div>

        <div class="intro-grid">
          <figure class="feature-image">
            <img
              :src="assetPath('usecase-script-video.webp')"
              :alt="
                isEnglish
                  ? 'App workflows and AI application market preview'
                  : '应用市场和 AI 工作流预览画面'
              "
              loading="lazy"
            />
          </figure>
          <div class="plain-list">
            <article
              v-for="item in appItems"
              :key="getLabel(item.title)"
              class="plain-item"
            >
              <h3>{{ getLabel(item.title) }}</h3>
              <p>{{ getLabel(item.text) }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="video" class="section light">
      <div id="scenes" class="wrap">
        <p class="section-kicker">{{ text.videoKicker }}</p>
        <h2 class="section-title">{{ text.videoTitle }}</h2>
        <p class="section-lead">
          {{ text.videoLead }}
        </p>
        <div class="section-actions">
          <a class="button primary" href="/#market/detail/kling-video-o1">
            {{ text.videoCta }}
          </a>
        </div>

        <div class="gallery" aria-label="使用场景样片">
          <article v-for="scene in scenes" :key="getLabel(scene.title)" class="scene">
            <img
              :src="assetPath(scene.image)"
              :alt="getLabel(scene.alt)"
              loading="lazy"
            />
            <div class="scene-copy">
              <span>{{ scene.index }}</span>
              <h3>{{ getLabel(scene.title) }}</h3>
              <p>{{ getLabel(scene.text) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="price" class="price-page" aria-labelledby="packages-title">
      <div class="price-band light">
        <div class="wrap">
          <p class="section-kicker">{{ text.packagesKicker }}</p>
          <h2 id="packages-title" class="section-title">
            {{ text.packagesTitle }}
          </h2>
          <p class="section-lead">
            {{ text.packagesLead }}
          </p>

          <div class="packages">
            <article v-for="item in packages" :key="item.label" class="package">
              <small>{{ item.label }}</small>
              <h3>{{ getLabel(item.title) }}</h3>
              <p>{{ getLabel(item.text) }}</p>
              <ul>
                <li v-for="feature in item.features" :key="getLabel(feature)">
                  {{ getLabel(feature) }}
                </li>
              </ul>
              <a href="mailto:hello@verdantflarehub.com">{{ getLabel(item.cta) }}</a>
            </article>
          </div>
        </div>
      </div>

      <div id="flow" class="price-band dark">
        <div class="wrap">
          <p class="section-kicker">{{ text.workflowKicker }}</p>
          <h2 class="section-title">{{ text.workflowTitle }}</h2>
          <p class="section-lead">
            {{ text.workflowLead }}
          </p>

          <div class="flow">
            <article v-for="step in flowSteps" :key="step.step" class="flow-step">
              <span>{{ step.step }}</span>
              <h3>{{ getLabel(step.title) }}</h3>
              <p>{{ getLabel(step.text) }}</p>
            </article>
          </div>
        </div>
      </div>

      <div class="price-band light">
        <div class="wrap">
          <p class="section-kicker">{{ text.rulesKicker }}</p>
          <h2 id="trust-title" class="section-title">
            {{ text.rulesTitle }}
          </h2>
          <div class="trust">
            <p class="section-lead">
              {{ text.rulesLead }}
            </p>
            <div class="rules">
              <div v-for="rule in rules" :key="getLabel(rule.label)" class="rule">
                <b>{{ getLabel(rule.label) }}</b>
                <span>{{ getLabel(rule.text) }}</span>
              </div>
            </div>
          </div>
          <div class="price-contact">
            <div>
              <p class="section-kicker">{{ text.priceKicker }}</p>
              <h3>{{ text.priceTitle }}</h3>
            </div>
            <a class="button primary" href="mailto:hello@verdantflarehub.com">
              hello@verdantflarehub.com
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="section dark">
      <div class="wrap">
        <p class="section-kicker">{{ text.faqKicker }}</p>
        <h2 class="section-title">{{ text.faqTitle }}</h2>
        <div class="faq">
          <article v-for="item in faqs" :key="getLabel(item.question)" class="faq-item">
            <h3>{{ getLabel(item.question) }}</h3>
            <p>{{ getLabel(item.answer) }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>{{ text.footerBrand }}</span>
      <span>{{ text.footerLinks }}</span>
    </div>
  </footer>
</template>
