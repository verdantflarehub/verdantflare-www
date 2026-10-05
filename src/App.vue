<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AppDetail from "./view/app/detail/index.vue";
import AppList from "./view/app/list/index.vue";
import ModelDetail from "./view/model/detail/index.vue";
import ModelList from "./view/model/list/index.vue";
import PublicContentView from "./view/content/PublicContentView.vue";
import { hubHref, loginHref } from "./config/external";
import { marketApps, models, loadPublicCatalog } from "./catalog/public";

const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const navItems = [
  { href: "/", label: { zh: "首页", en: "Home" } },
  { href: "/#model", section: "model", label: { zh: "模型", en: "Models" } },
  { href: "/#apps", section: "apps", label: { zh: "应用", en: "Apps" } },
  { href: "/solutions/creator", label: { zh: "解决方案", en: "Solutions" } },
  { href: "/developers", label: { zh: "开发者", en: "Developers" } },
  { href: "/pricing", label: { zh: "套餐", en: "Pricing" } },
];

const currentPath = ref(window.location.pathname);
const currentHash = ref(window.location.hash);
const locale = ref(localStorage.getItem("verdantflare_locale") || "zh");
watch(locale, (value) => { document.documentElement.lang = value === "en" ? "en" : "zh-CN"; }, { immediate: true });
const sessionState = ref("unknown");
let sessionRequest = 0;
const refreshSession = async () => {
  const request = ++sessionRequest;
  try {
    const response = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
    if (request === sessionRequest) {
      sessionState.value = response.ok ? "authenticated" : response.status === 401 ? "anonymous" : "unknown";
    }
  } catch {
    if (request === sessionRequest) sessionState.value = "unknown";
  }
};
const refreshSessionWhenVisible = () => {
  if (document.visibilityState === "visible") refreshSession();
};
const modelRoute = (modelId) => models.some((model) => model.id === modelId)
  ? { name: "model-detail", modelId } : { name: "model-list" };
const appRoute = (appId) => marketApps.some((app) => app.id === appId)
  ? { name: "app-detail", appId } : { name: "app-list" };

const route = computed(() => {
  const path = currentPath.value.replace(/\/+$/, "") || "/";
  const hash = currentHash.value.replace(/^#\/?/, "").replace(/\/+$/, "");

  if (hash === "login") {
    return { name: "external-login" };
  }

  if (hash === "market") {
    return { name: "model-list" };
  }

  if (path === "/models") {
    return { name: "model-list" };
  }

  if (path.startsWith("/models/")) {
    const segments = path.split("/").filter(Boolean);
    return modelRoute(segments.at(-1));
  }

  if (hash === "market/order") {
    return { name: "public-content", page: "pricing" };
  }

  if (hash.startsWith("market/detail/")) {
    const segments = hash.split("/").filter(Boolean);
    return modelRoute(segments.at(-1));
  }

  if (hash === "app-market") {
    return { name: "app-list" };
  }

  if (path === "/apps") {
    return { name: "app-list" };
  }

  if (path.startsWith("/apps/")) {
    const segments = path.split("/").filter(Boolean);
    if (segments.at(-1) === "history" && segments.length >= 3) {
      return appRoute(segments.at(-2));
    }
    return appRoute(segments.at(-1));
  }

  if (hash.startsWith("app-market/detail/")) {
    const segments = hash.split("/").filter(Boolean);
    return appRoute(segments.at(-1));
  }

  if (hash.startsWith("app-market/history/")) {
    const segments = hash.split("/").filter(Boolean);
    return appRoute(segments.at(-1));
  }

  if (path === "/view/model/list") {
    return { name: "model-list" };
  }

  if (path === "/view/model/order") {
    return { name: "public-content", page: "pricing" };
  }

  if (path === "/app" || path === "/view/app/list") {
    return { name: "app-list" };
  }

  if (path.startsWith("/app/detail") || path.startsWith("/view/app/detail")) {
    const segments = path.split("/").filter(Boolean);
    return appRoute(segments.at(-1));
  }

  if (path.startsWith("/app/history") || path.startsWith("/view/app/history")) {
    const segments = path.split("/").filter(Boolean);
    return appRoute(segments.at(-1));
  }

  if (path === "/login") {
    return { name: "external-login" };
  }

  const contentRoutes = {
    "/solutions/video": "solution-video",
    "/solutions/creator": "solution-creator",
    "/solutions/enterprise": "solution-enterprise",
    "/developers": "developers",
    "/docs": "docs",
    "/pricing": "pricing",
    "/contact": "contact",
  };

  if (contentRoutes[path]) {
    return { name: "public-content", page: contentRoutes[path] };
  }

  if (path.startsWith("/view/model/detail")) {
    const segments = path.split("/").filter(Boolean);
    return modelRoute(segments.at(-1));
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
    enterHub: "进入 Hub",
    brandName: "青焰",
    heroTitle: "让想法，",
    heroSubtitle: "有了画面。",
    heroCopy:
      "从一句描述、一张参考图，到下一段视频。探索青焰的模型与创作应用，在 Hub 中体验，",
    heroCopyEnd: "让灵感走向作品。",
    heroPriceCta: "咨询青焰套餐",
    heroFlowCta: "了解交付流程",
    modelKicker: "Model",
    modelTitle: "找到适合这一刻的模型。",
    modelLead:
      "了解模型能做什么、如何输入、怎样计费。登录 Hub，查看组织授权与可调用状态，再选择适合你的接入方式。",
    modelCta: "进入模型市场",
    publicModelCta: "查看公开模型目录",
    appKicker: "Apps",
    appTitle: "好工具，让创作更顺手。",
    appLead:
      "发现创作工具与工作流，了解版本、权限和运行条件。需要本地执行的应用，通过 Studio 安装到当前 Station。",
    appCta: "进入应用市场",
    publicAppCta: "查看公开应用目录",
    videoKicker: "Video Generation",
    videoTitle: "先看见，再让创意向前。",
    videoLead:
      "验证一段脚本，尝试一种镜头语言，或为商品寻找新的表达。从短视频到分镜预演，找到你的创作起点。",
    videoCta: "体验视频生成",
    packagesKicker: "Packages",
    packagesTitle: "从你的创作需求出发。",
    packagesLead:
      "个人探索、团队协作，或持续的 API 接入。告诉我们你的使用场景，一起确认模型范围、额度和交付方案。",
    workflowKicker: "Workflow",
    workflowTitle: "每一步，都心中有数。",
    workflowLead:
      "从需求沟通到开始使用，提前确认额度、有效期与支持范围。清楚地开始，安心地创作。",
    rulesKicker: "Rules",
    rulesTitle: "开始之前，了解你的权益。",
    rulesLead:
      "公开页面只说明套餐结构，包括额度范围、有效期、交付方式和支持边界；实际权益以 Hub 配置或双方确认的方案为准。",
    priceKicker: "Price",
    priceTitle: "聊聊你的下一件作品。",
    faqKicker: "FAQ",
    faqTitle: "常见问题",
    footerBrand: "青焰 · VerdantFlare",
    footerLinks: "模型 · 应用 · 创作",
  },
  en: {
    login: "Login",
    enterHub: "Open Hub",
    brandName: "VerdantFlare",
    heroTitle: "Your idea.",
    heroSubtitle: "In motion.",
    heroCopy:
      "Start with a few words or a reference image. Explore models and creative apps, try them in Hub, and take your next video ",
    heroCopyEnd: "from idea to screen.",
    heroPriceCta: "Consult Packages",
    heroFlowCta: "View Workflow",
    modelKicker: "Model",
    modelTitle: "The right model for your next idea.",
    modelLead:
      "Compare capabilities, inputs, and pricing. Sign in to Hub to check your organization’s access and live availability before integrating.",
    modelCta: "Enter Model Market",
    publicModelCta: "View Public Models",
    appKicker: "Apps",
    appTitle: "Good tools. More room to create.",
    appLead:
      "Discover creative tools and workflows. Review versions, permissions, and requirements, then use Studio to install local apps on your active Station.",
    appCta: "Enter App Market",
    publicAppCta: "View Public Apps",
    videoKicker: "Video Generation",
    videoTitle: "See it. Then take it further.",
    videoLead:
      "Test a script, explore a camera move, or find a fresh angle for your product. From short videos to storyboard previews, start with what inspires you.",
    videoCta: "Try Video Generation",
    packagesKicker: "Packages",
    packagesTitle: "A plan that starts with your work.",
    packagesLead:
      "Explore on your own, create with a team, or build with the API. Tell us what you need, and we’ll help define the models, credits, and delivery plan.",
    workflowKicker: "Workflow",
    workflowTitle: "Know what comes next.",
    workflowLead:
      "From your first conversation to your first session, agree on credits, validity, and support before getting started.",
    rulesKicker: "Rules",
    rulesTitle: "Your access, clearly explained.",
    rulesLead:
      "Public pages explain the plan structure. Actual access follows the entitlement configured in Hub or the service plan confirmed with the customer.",
    priceKicker: "Price",
    priceTitle: "Tell us about your next project.",
    faqKicker: "FAQ",
    faqTitle: "Frequently Asked Questions",
    footerBrand: "VerdantFlare",
    footerLinks: "Models · Apps · Creation",
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
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    target?.scrollIntoView({ behavior, block: "start" });
  });
};

const handleNavClick = (event, item) => {
  if (!item.section || (currentPath.value.replace(/\/+$/, "") || "/") !== "/") {
    return;
  }

  event.preventDefault();
  const nextHash = `#${item.section}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState({}, "", `/${nextHash}`);
    currentHash.value = nextHash;
  }
  scrollToHash();
};

const scrollRouteToTop = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const hash = window.location.hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  const shouldReset =
    hash === "login" ||
    hash === "market" ||
    hash.startsWith("market/detail/") ||
    hash === "app-market" ||
    hash.startsWith("app-market/detail/") ||
    hash.startsWith("app-market/history/") ||
    path === "/login" ||
    path === "/view/model/list" ||
    path.startsWith("/view/model/detail") ||
    path === "/app" ||
    path === "/view/app/list" ||
    path.startsWith("/app/detail") ||
    path.startsWith("/app/history") ||
    path.startsWith("/view/app/detail") ||
    path.startsWith("/view/app/history");

  const isPublicCatalogRoute =
    path === "/models" ||
    path.startsWith("/models/") ||
    path === "/apps" ||
    path.startsWith("/apps/");

  if (!shouldReset && !isPublicCatalogRoute) return;

  nextTick(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
};

const handleNavigation = () => {
  currentPath.value = window.location.pathname;
  currentHash.value = window.location.hash;
  scrollToHash();
  scrollRouteToTop();
  if (route.value.name === "external-login") {
    window.location.replace(loginHref("legacy-login"));
  }
};

onMounted(() => {
  loadPublicCatalog();
  refreshSession();
  window.addEventListener("popstate", handleNavigation);
  window.addEventListener("hashchange", handleNavigation);
  window.addEventListener("focus", refreshSession);
  document.addEventListener("visibilitychange", refreshSessionWhenVisible);
  scrollToHash();
  scrollRouteToTop();
  if (route.value.name === "external-login") {
    window.location.replace(loginHref("legacy-login"));
  }
});

onUnmounted(() => {
  sessionRequest += 1;
  window.removeEventListener("popstate", handleNavigation);
  window.removeEventListener("hashchange", handleNavigation);
  window.removeEventListener("focus", refreshSession);
  document.removeEventListener("visibilitychange", refreshSessionWhenVisible);
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
      zh: "青焰模型服务咨询，额度和交付方式在开通前确认。",
      en: "Consult VerdantFlare model services; confirm credits and delivery before activation.",
    },
  },
];

const modelItems = [
  {
    title: { zh: "统一模型入口", en: "Unified Model Entry" },
    text: {
      zh: "在一个目录中比较模型能力、输入要求与已发布报价，找到适合当前任务的选择。",
      en: "Compare capabilities, input requirements, and published pricing in one catalog.",
    },
  },
  {
    title: { zh: "额度和 API 接入", en: "Credits and API Access" },
    text: {
      zh: "登录后查看组织可用的模型与额度，通过 API 接入自己的工作流。实际可用性与结算以网关记录为准。",
      en: "Check your organization’s models and credits, then connect through the API. Live availability and billing follow gateway records.",
    },
  },
  {
    title: { zh: "合作支持", en: "Partnership Support" },
    text: {
      zh: "面向团队采购、长期额度和生产环境接入，提前确认模型范围、交付周期和售后边界。",
      en: "For team requirements, long-term credits, and production access, confirm model scope, delivery schedule, and support boundaries first.",
    },
  },
];

const appItems = [
  {
    title: { zh: "本地 AI 与 Agent", en: "Local AI and Agents" },
    text: {
      zh: "公开目录可涵盖本地模型、对话入口和智能体应用；具体条目以已发布资料为准。",
      en: "The public catalog can cover local models, chat surfaces, and agent apps; listed items depend on published records.",
    },
  },
  {
    title: { zh: "创作与工作流", en: "Creation and Workflows" },
    text: {
      zh: "浏览已发布的创作与自动化工具，选择适合自己的工作流；安装前先核对运行条件。",
      en: "Explore published creative and automation tools, and check their requirements before installing.",
    },
  },
  {
    title: { zh: "版本和权限透明", en: "Transparent Versions and Permissions" },
    text: {
      zh: "先了解公开版本与资源要求，在 Hub 查看授权，再由 Studio 管理当前 Station 的安装与运行。",
      en: "Review versions and resource requirements, check access in Hub, and manage installation and runtime on your active Station through Studio.",
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
      { zh: "开通前确认有效期", en: "Confirm validity before activation" },
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
      en: "Describe usage volume, purpose, delivery time, and whether batch access is required.",
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
    title: { zh: "确认方案", en: "Confirm Plan" },
    text: {
      zh: "确认适用套餐、权益范围和后续开通方式。",
      en: "Confirm the plan, entitlement scope, and activation path.",
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
      zh: "遇到不可用或交付异常，按已确认的服务方案处理。",
      en: "Handle availability or delivery issues according to the confirmed service plan.",
    },
  },
];

const rules = [
  {
    label: { zh: "套餐内容", en: "Package Content" },
    text: {
      zh: "公开页面只作说明，实际权益以 Hub 配置或双方确认的服务方案为准。",
      en: "Public content is informational; actual access follows Hub entitlements or the confirmed service plan.",
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
      zh: "大额需求先确认容量、交付周期和稳定性，再制定开通方案。",
      en: "For large requirements, confirm capacity, delivery timing, and stability before activation.",
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
    question: { zh: "青焰现在主要提供什么？", en: "What does VerdantFlare provide now?" },
    answer: {
      zh: "官网提供公开模型、应用和解决方案说明；登录 Hub 后可查看组织权益、在线体验、API 接入和用量。",
      en: "WWW presents public models, apps, and solutions. After signing in, Hub provides organization access, online experience, API integration, and usage.",
    },
  },
  {
    question: { zh: "确认需求后多久可以开通？", en: "How soon can access be activated?" },
    answer: {
      zh: "以需求确认结果为准。不同套餐、容量和交付方式会影响开通时间。",
      en: "Activation time follows the confirmed requirements and depends on plan, capacity, and delivery method.",
    },
  },
  {
    question: { zh: "如何了解价格和套餐？", en: "How do I find pricing and plans?" },
    answer: {
      zh: "模型目录展示已发布的报价说明。团队或定制需求可联系我们，开通前会确认模型范围、额度、有效期和交付方式。",
      en: "The model catalog includes published pricing notes. Contact us for team or custom plans; model scope, credits, validity, and delivery are confirmed before activation.",
    },
  },
  {
    question: { zh: "青焰额度是否永久有效？", en: "Are verdantflare credits valid forever?" },
    answer: {
      zh: "额度不默认永久有效。请查看 Hub 中的有效期和使用限制，或以双方确认的服务方案为准。",
      en: "Credits do not have unlimited validity by default. Check the expiry and limits in Hub or your confirmed service plan.",
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
      <a class="brand" href="/#home" aria-label="VerdantFlare 官网首页">
        <img class="brand-mark" src="/brand/verdantflare-logo.png" alt="" />
        <span>{{ text.brandName }}</span>
      </a>
      <div class="nav-links" aria-label="页面导航">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          @click="handleNavClick($event, item)"
        >
          {{ getLabel(item.label) }}
        </a>
      </div>
      <div class="nav-actions">
        <a class="nav-login" :href="sessionState === 'anonymous' ? loginHref('header-login') : hubHref('/', { entry: 'header-login' })">{{ sessionState === 'anonymous' ? text.login : text.enterHub }}</a>
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
  <AppList v-else-if="route.name === 'app-list'" :locale="locale" />
  <AppDetail
    v-else-if="route.name === 'app-detail'"
    :app-id="route.appId"
    :locale="locale"
  />
  <PublicContentView
    v-else-if="route.name === 'public-content'"
    :page="route.page"
    :locale="locale"
  />
  <main v-else-if="route.name !== 'external-login'" id="home">
    <section
      class="hero"
      aria-labelledby="hero-title"
      :style="{ '--hero-image': `url('${assetPath('hero-glass-ad.webp')}')` }"
    >
      <div class="hero-inner">
        <div>
          <p class="eyebrow">{{ isEnglish ? 'VerdantFlare · Creative intelligence' : '青焰 · 让创作发生' }}</p>
          <h1 id="hero-title"><span class="headline-phrase">{{ text.heroTitle }}</span><span class="headline-phrase">{{ text.heroSubtitle }}</span></h1>
          <p class="hero-copy">
            {{ text.heroCopy }}<span class="keep-phrase">{{ text.heroCopyEnd }}</span>
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
          <a class="button primary" :href="hubHref('/api/models', { entry: 'home-model' })">{{ text.modelCta }}</a>
          <a class="button" href="/models">{{ text.publicModelCta }}</a>
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
          <a class="button primary" :href="hubHref('/market', { entry: 'home-apps' })">{{ text.appCta }}</a>
          <a class="button" href="/apps">{{ text.publicAppCta }}</a>
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
          <a class="button primary" :href="hubHref('/experience', { entry: 'home-video' })">
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
