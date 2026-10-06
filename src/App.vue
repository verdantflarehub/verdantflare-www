<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AppDetail from "./view/app/detail/index.vue";
import AppList from "./view/app/list/index.vue";
import ModelDetail from "./view/model/detail/index.vue";
import ModelList from "./view/model/list/index.vue";
import PublicContentView from "./view/content/PublicContentView.vue";
import { hubHref, loginHref } from "./config/external";
import { catalogState, marketApps, models, loadPublicCatalog } from "./catalog/public";
import { tModelName, tModelSummary, tProvider } from "./view/model/i18n";

const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const navItems = [
  { href: "/#home", section: "home", label: { zh: "首页", en: "Home" } },
  { href: "/#model", section: "model", label: { zh: "模型", en: "Models" } },
  { href: "/#apps", section: "apps", label: { zh: "应用", en: "Apps" } },
  { href: "/#solutions", section: "solutions", label: { zh: "方案", en: "Solutions" } },
  { href: "/#price", section: "price", label: { zh: "套餐", en: "Plans" } },
  { href: "/#developers", section: "developers", label: { zh: "开发者", en: "Developers" } },
];
const activeSection = ref("home");

const currentPath = ref(window.location.pathname);
const currentHash = ref(window.location.hash);
const locale = ref(localStorage.getItem("verdantflare_locale") || "zh");
watch(locale, (value) => {
  document.documentElement.lang = value === "en" ? "en" : "zh-CN";
  document.title = value === "en"
    ? "VerdantFlare | Models, Apps & Video Creation"
    : "VerdantFlare | 模型、应用与视频生成解决方案";
}, { immediate: true });
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
    heroFlowCta: "查看方案",
    modelKicker: "Models",
    modelTitle: "先认识模型，再决定如何使用。",
    modelLead: "从已公开的模型资料了解能力与适用场景。这里只提供只读信息；登录 Hub 后再确认组织授权、在线体验和 API 接入。",
    modelCta: "进入 Hub 模型市场",
    publicModelCta: "查看完整公开目录",
    appKicker: "Apps",
    appTitle: "好工具，让创作更顺手。",
    appLead:
      "发现创作工具与工作流，了解版本、权限和运行条件。需要本地执行的应用，通过 Studio 安装到当前 Station。",
    appCta: "进入应用市场",
    publicAppCta: "查看公开应用目录",
    solutionKicker: "Solutions",
    solutionTitle: "从发现能力，到完成作品。",
    solutionLead: "青焰把模型、应用与创作环境连接起来。先找到适合的能力，在支持的入口验证，再把确认的工作流带入正式创作。",
    solutionCta: "查看应用与场景",
    packagesKicker: "Plans",
    packagesTitle: "按使用阶段，选择合作方式。",
    packagesLead: "两个使用层级，从能力验证到团队接入。这里只说明服务形态；实际模型、额度、有效期和价格以 Hub 权益或双方确认的方案为准。",
    developerKicker: "Developers",
    developerTitle: "从了解能力，到第一次调用。",
    developerLead: "在 Hub 查看组织可用模型与额度，创建 API Key，按接入说明调用，并跟踪任务与用量。真实授权和结算始终以业务系统为准。",
    developerCta: "进入 API Center",
    developerDocsCta: "查看接入说明",
    publicModelsTitle: "已公开的模型",
    publicModelsHint: "只读资料 · 来自公开目录",
    catalogLoading: "正在读取公开目录…",
    catalogEmpty: "暂无公开模型，具体可用能力请以 Hub 为准。",
    catalogError: "公开目录暂时无法读取，请稍后再试。",
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
    heroFlowCta: "Explore Solutions",
    modelKicker: "Models",
    modelTitle: "Know the model before you use it.",
    modelLead: "Explore published capabilities and use cases here. This is read-only information; sign in to Hub to check organization access, online experience, and API integration.",
    modelCta: "Open Hub Model Market",
    publicModelCta: "View Full Public Catalog",
    appKicker: "Apps",
    appTitle: "Good tools. More room to create.",
    appLead:
      "Discover creative tools and workflows. Review versions, permissions, and requirements, then use Studio to install local apps on your active Station.",
    appCta: "Enter App Market",
    publicAppCta: "View Public Apps",
    solutionKicker: "Solutions",
    solutionTitle: "From capability to finished work.",
    solutionLead: "VerdantFlare connects models, apps, and creative environments. Find the right capability, validate it where supported, then take a proven workflow into production.",
    solutionCta: "Explore Apps and Scenarios",
    packagesKicker: "Plans",
    packagesTitle: "Choose how you work with us.",
    packagesLead: "Two levels, from validating a capability to team integration. This page explains service shapes only; models, credits, validity, and pricing follow Hub entitlements or your confirmed agreement.",
    developerKicker: "Developers",
    developerTitle: "From discovery to your first call.",
    developerLead: "In Hub, check available models and credits, create an API key, follow the integration guide, and track tasks and usage. Business access and billing remain authoritative there.",
    developerCta: "Open API Center",
    developerDocsCta: "Read Integration Guide",
    publicModelsTitle: "Published models",
    publicModelsHint: "Read-only · public catalog",
    catalogLoading: "Loading the public catalog…",
    catalogEmpty: "No public models yet. Check Hub for available capabilities.",
    catalogError: "The public catalog is temporarily unavailable. Please try again later.",
    footerBrand: "VerdantFlare",
    footerLinks: "Models · Apps · Creation",
  },
};

const text = computed(() => copy[locale.value] || copy.zh);
const publicModelPreview = computed(() => models.slice(0, 4));

const scrollToHash = () => {
  const hash = window.location.hash.replace(/^#/, "");
  const targetId = { video: "solutions", scenes: "solutions", flow: "price", faq: "developers" }[hash] || hash;
  if (!["home", "model", "apps", "solutions", "price", "developers"].includes(targetId)) return;

  nextTick(() => {
    const target = document.getElementById(targetId);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    target?.scrollIntoView({ behavior, block: "start" });
    activeSection.value = targetId;
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

let scrollFrame = 0;
const updateActiveSection = () => {
  if (route.value.name !== "home" || scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 72;
    const threshold = headerHeight + 48;
    for (const id of ["developers", "price", "solutions", "apps", "model", "home"]) {
      if (document.getElementById(id)?.getBoundingClientRect().top <= threshold) {
        activeSection.value = id;
        break;
      }
    }
  });
};

onMounted(() => {
  loadPublicCatalog();
  refreshSession();
  window.addEventListener("popstate", handleNavigation);
  window.addEventListener("hashchange", handleNavigation);
  window.addEventListener("focus", refreshSession);
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  document.addEventListener("visibilitychange", refreshSessionWhenVisible);
  scrollToHash();
  scrollRouteToTop();
  updateActiveSection();
  if (route.value.name === "external-login") {
    window.location.replace(loginHref("legacy-login"));
  }
});

onUnmounted(() => {
  sessionRequest += 1;
  window.removeEventListener("popstate", handleNavigation);
  window.removeEventListener("hashchange", handleNavigation);
  window.removeEventListener("focus", refreshSession);
  window.removeEventListener("scroll", updateActiveSection);
  window.removeEventListener("resize", updateActiveSection);
  document.removeEventListener("visibilitychange", refreshSessionWhenVisible);
  window.cancelAnimationFrame(scrollFrame);
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
    label: "01 / Create",
    title: { zh: "创作与体验", en: "Create & Explore" },
    text: {
      zh: "适合先了解模型和应用、验证具体创作任务的个人与小团队。",
      en: "For individuals and small teams exploring models and apps around a concrete creative task.",
    },
    features: [
      { zh: "浏览公开能力，按组织权益进入在线体验", en: "Discover public capabilities; try online where your organization has access" },
      { zh: "从应用市场找到创作工作流", en: "Find a creative workflow in the app market" },
      { zh: "在 Hub 查看实际额度与使用记录", en: "Check real credits and usage in Hub" },
    ],
    cta: { zh: "进入 Hub 了解", en: "Explore in Hub" },
    href: hubHref("/", { entry: "home-plan-create" }),
  },
  {
    label: "02 / Scale",
    title: { zh: "团队与企业接入", en: "Team & Enterprise" },
    text: {
      zh: "适合需要持续调用、成员协作和正式项目交付的组织。",
      en: "For organizations that need ongoing API use, collaboration, and formal project delivery.",
    },
    features: [
      { zh: "按组织管理成员、角色与能力授权", en: "Manage members, roles, and access by organization" },
      { zh: "结合 API、Studio 与 Station 执行生产流程", en: "Bring API, Studio, and Station into production workflows" },
      { zh: "单独确认模型范围、额度和服务边界", en: "Confirm model scope, credits, and service boundaries" },
    ],
    cta: { zh: "联系团队", en: "Contact the Team" },
    href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Team%20Plan",
  },
];

const coreCapabilities = [
  {
    number: "01",
    title: { zh: "模型与 API", en: "Models & API" },
    text: { zh: "从公开资料了解模型能力；在 Hub 核对组织授权、额度，并通过 API 接入自己的工作流。", en: "Explore model capabilities publicly, then check organization access and credits in Hub before integrating via API." },
  },
  {
    number: "02",
    title: { zh: "应用与工作流", en: "Apps & workflows" },
    text: { zh: "发现已发布应用和创作流程；只有获得组织权益后，才能在对应运行环境中使用。", en: "Discover published apps and creative workflows; use them in the right runtime after access is granted." },
  },
  {
    number: "03",
    title: { zh: "Studio 与 Station", en: "Studio & Station" },
    text: { zh: "在 Studio 管理正式项目，由当前 Station 安装、运行已授权应用，保持项目资产与平台权益的边界。", en: "Manage formal projects in Studio and run entitled apps on the active Station, keeping project assets and platform access separate." },
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
          :class="{ active: route.name === 'home' && activeSection === item.section }"
          :aria-current="route.name === 'home' && activeSection === item.section ? 'location' : undefined"
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
            <a class="button" href="#solutions">{{ text.heroFlowCta }}</a>
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

    <section id="model" class="section dark model-section" aria-labelledby="model-title">
      <div class="wrap">
        <p class="section-kicker">{{ text.modelKicker }}</p>
        <h2 id="model-title" class="section-title">{{ text.modelTitle }}</h2>
        <p class="section-lead">{{ text.modelLead }}</p>
        <div class="section-actions">
          <a class="button primary" :href="hubHref('/api/models', { entry: 'home-model' })">{{ text.modelCta }}</a>
          <a class="button" href="/models">{{ text.publicModelCta }}</a>
        </div>
        <div class="public-model-preview">
          <div class="public-model-preview-header">
            <h3>{{ text.publicModelsTitle }}</h3>
            <span>{{ text.publicModelsHint }}</span>
          </div>
          <p v-if="catalogState.loading" class="catalog-status">{{ text.catalogLoading }}</p>
          <p v-else-if="catalogState.error" class="catalog-status" role="status">{{ text.catalogError }}</p>
          <p v-else-if="!publicModelPreview.length" class="catalog-status">{{ text.catalogEmpty }}</p>
          <div v-else class="public-model-rows">
            <div v-for="model in publicModelPreview" :key="model.id" class="public-model-row">
              <div>
                <strong>{{ tModelName(model, locale) }}</strong>
                <span>{{ tProvider(model.provider, locale) }}</span>
              </div>
              <p>{{ tModelSummary(model, locale) }}</p>
            </div>
          </div>
          <p v-if="models.length > publicModelPreview.length" class="public-model-more">{{ isEnglish ? `Showing ${publicModelPreview.length} of ${models.length} published models. All access and calls remain in Hub.` : `展示 ${publicModelPreview.length} / ${models.length} 个已公开模型；实际授权与调用均在 Hub。` }}</p>
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

    <section id="solutions" class="section light solutions-section">
      <div class="wrap">
        <p class="section-kicker">{{ text.solutionKicker }}</p>
        <h2 class="section-title">{{ text.solutionTitle }}</h2>
        <p class="section-lead">{{ text.solutionLead }}</p>
        <div class="core-capabilities">
          <article v-for="item in coreCapabilities" :key="item.number" class="core-capability">
            <span>{{ item.number }}</span>
            <h3>{{ getLabel(item.title) }}</h3>
            <p>{{ getLabel(item.text) }}</p>
          </article>
        </div>
        <div class="solutions-scenarios-heading">
          <h3>{{ isEnglish ? 'Where ideas take shape' : '这些场景，从这里开始' }}</h3>
          <p>{{ isEnglish ? 'Examples of creative directions, not a promise that every workflow is available for every organization.' : '创作方向示例；具体工作流与可用性以已发布应用及组织权益为准。' }}</p>
        </div>
        <div class="section-actions">
          <a class="button primary" href="#apps">{{ text.solutionCta }}</a>
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
              <a :href="item.href">{{ getLabel(item.cta) }} <span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <p class="plan-note">{{ isEnglish ? 'No fixed public price is implied. Organization access, credits, validity, and billing are confirmed in Hub or an agreed service plan.' : '此处不展示虚构的固定价格；组织权限、额度、有效期和账单以 Hub 或已确认的服务方案为准。' }}</p>
        </div>
      </div>
    </section>

    <section id="developers" class="section dark developers-section" aria-labelledby="developers-title">
      <div class="wrap">
        <p class="section-kicker">{{ text.developerKicker }}</p>
        <h2 id="developers-title" class="section-title">{{ text.developerTitle }}</h2>
        <p class="section-lead">{{ text.developerLead }}</p>
        <div class="section-actions">
          <a class="button primary" :href="hubHref('/api/models', { entry: 'home-developers' })">{{ text.developerCta }}</a>
          <a class="button" href="/docs">{{ text.developerDocsCta }}</a>
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
