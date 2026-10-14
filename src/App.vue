<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AppDetail from "./view/app/detail/index.vue";
import AppList from "./view/app/list/index.vue";
import ModelDetail from "./view/model/detail/index.vue";
import ModelList from "./view/model/list/index.vue";
import ProviderLogo from "./view/model/ProviderLogo.vue";
import PublicContentView from "./view/content/PublicContentView.vue";
import LegalDocumentView from "./view/legal/LegalDocumentView.vue";
import { resolveLegalRoute } from "./view/legal/legalRoute";
import { hubHref, loginHref } from "./config/external";
import { catalogState, marketApps, models, loadPublicCatalog } from "./catalog/public";
import { tModelName, tModelSummary, tProvider } from "./view/model/i18n";
import { theme, toggleTheme } from "./theme";
import { appCardIdFromHash, isAppListLocation } from "./catalog/appNavigation";

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
const currentSearch = ref(window.location.search);
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
const appRoute = (appId) => {
  try { appId = decodeURIComponent(appId); } catch { /* Preserve invalid legacy IDs for the existing list fallback. */ }
  return marketApps.some((app) => app.id === appId)
    ? { name: "app-detail", appId } : { name: "app-list" };
};

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

  const legalRoute = resolveLegalRoute(path);
  if (legalRoute) return legalRoute;

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
    heroTitle: "每次创作，",
    heroSubtitle: "都是新起点。",
    heroCopy:
      "不只得到一份结果，更让成果有版本、来源可追溯。VF 正在完善从项目到资产、再到下一次创作的复用体验，",
    heroCopyEnd: "让创作持续积累。",
    heroPriceCta: "咨询青焰套餐",
    heroFlowCta: "了解资产复用",
    modelKicker: "Models",
    modelTitle: "先认识模型，再决定如何使用。",
    modelLead: "从已公开的模型资料了解能力与适用场景。这里只提供只读信息；登录 Hub 后再确认组织授权、在线体验和 API 接入。",
    modelCta: "进入 Hub 模型市场",
    publicModelCta: "查看完整公开目录",
    appKicker: "Apps",
    appTitle: "选对工具，也看清留下什么。",
    appLead:
      "发现创作工具与工作流，了解版本和运行条件。Hub 应用市场目前仅展示资料，经 Studio 安装到关联 Station 的分发链路仍在对接。",
    appCta: "进入应用市场",
    publicAppCta: "查看公开应用目录",
    solutionKicker: "Solutions",
    solutionTitle: "让每一次创作，成为下一次创作的起点。",
    solutionLead: "成果不该止于一次下载。VF 已有固定版本、来源记录与受控存储基础，正在完善资产查找、预览和跨项目复用；具体开放范围以接入环境和应用验证为准。",
    solutionCta: "了解创作与复用",
    packagesKicker: "Plans",
    packagesTitle: "按使用阶段，选择合作方式。",
    packagesLead: "两个使用层级，从能力验证到团队接入。这里只说明服务形态；实际模型、额度、有效期和价格以 Hub 权益或双方确认的方案为准。",
    developerKicker: "Developers",
    developerTitle: "从了解能力，到第一次调用。",
    developerLead: "在 Hub 核对组织可用模型与额度，由有权限的管理员创建 API Key，再按说明接入工作流。模型调用与项目资产管理分别授权，体验结果不会自动归档到项目。",
    developerCta: "进入 API Center",
    developerDocsCta: "查看接入说明",
    publicModelsTitle: "已公开的模型",
    publicModelsHint: "只读资料 · 来自公开目录",
    catalogLoading: "正在读取公开目录…",
    catalogEmpty: "暂无公开模型，具体可用能力请以 Hub 为准。",
    catalogError: "公开目录暂时无法读取，请稍后再试。",
    footerBrand: "青焰 · VerdantFlare",
    footerLinks: "模型 · 应用 · 创作资产",
  },
  en: {
    login: "Login",
    enterHub: "Open Hub",
    brandName: "VerdantFlare",
    heroTitle: "Create today.",
    heroSubtitle: "Build on it.",
    heroCopy:
      "Go beyond a finished file, with versions and traceable origins. We’re improving how work becomes reusable assets for your next project. ",
    heroCopyEnd: "Keep building.",
    heroPriceCta: "Consult Packages",
    heroFlowCta: "Explore asset reuse",
    modelKicker: "Models",
    modelTitle: "Know the model before you use it.",
    modelLead: "Explore published capabilities and use cases here. This is read-only information; sign in to Hub to check organization access, online experience, and API integration.",
    modelCta: "Open Hub Model Market",
    publicModelCta: "View Full Public Catalog",
    appKicker: "Apps",
    appTitle: "Choose your tools. Know what you keep.",
    appLead:
      "Discover creative tools and workflows, versions, and requirements. Hub App Market currently provides listings only; installation through Studio on your connected Station is still being integrated.",
    appCta: "Enter App Market",
    publicAppCta: "View Public Apps",
    solutionKicker: "Solutions",
    solutionTitle: "Make every creation a starting point.",
    solutionLead: "Your work should go beyond a download. VF has foundations for fixed versions, provenance, and controlled storage. Asset discovery, previews, and reuse across projects are being improved; availability depends on your environment and validated app support.",
    solutionCta: "Explore creation and reuse",
    packagesKicker: "Plans",
    packagesTitle: "Choose how you work with us.",
    packagesLead: "Two levels, from validating a capability to team integration. This page explains service shapes only; models, credits, validity, and pricing follow Hub entitlements or your confirmed agreement.",
    developerKicker: "Developers",
    developerTitle: "From discovery to your first call.",
    developerLead: "Check your organization’s models and credits in Hub, have an authorized administrator create an API key, and integrate it into your workflow. Model access and project assets have separate permissions; experience results are not automatically archived to a project.",
    developerCta: "Open API Center",
    developerDocsCta: "Read Integration Guide",
    publicModelsTitle: "Published models",
    publicModelsHint: "Read-only · public catalog",
    catalogLoading: "Loading the public catalog…",
    catalogEmpty: "No public models yet. Check Hub for available capabilities.",
    catalogError: "The public catalog is temporarily unavailable. Please try again later.",
    footerBrand: "VerdantFlare",
    footerLinks: "Models · Apps · Creative assets",
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
  if (isAppListLocation(path, window.location.hash) && appCardIdFromHash(window.location.hash)) return;
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
  currentSearch.value = window.location.search;
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
    title: { zh: "重点方向", en: "Focus" },
    text: { zh: "项目成果与资产复用", en: "Project outputs and asset reuse" },
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
    label: "Project",
    text: {
      zh: "从项目出发：保存成果的固定版本，留下真实来源。",
      en: "Start with a project: preserve fixed versions and their origins.",
    },
  },
  {
    label: "Asset",
    text: {
      zh: "明确选择后入库：区分结果素材、真实工程与依赖。",
      en: "Choose what to keep: distinguish media, source files, and dependencies.",
    },
  },
  {
    label: "Reuse",
    text: {
      zh: "目标是带入下一项目继续创作；完整复用体验仍在完善。",
      en: "Bring it into your next project. The full reuse experience is still being developed.",
    },
  },
];

const appItems = [
  {
    title: { zh: "先看输入与输出", en: "Start with inputs and outputs" },
    text: {
      zh: "了解应用使用什么素材、产生什么结果。有图片或视频，不等于同时拥有可编辑工程；请以具体应用的实际支持为准。",
      en: "Check what an app takes in and produces. An image or video does not imply an editable source project; support depends on the app.",
    },
  },
  {
    title: { zh: "再看能否继续使用", en: "Check what you can reuse" },
    text: {
      zh: "关注工程格式、模型与插件依赖，以及项目和资产接入范围。文件已保存，不代表能在任意环境编辑或重跑。",
      en: "Review source formats, model and plugin dependencies, and project or asset integration. A saved file is not a guarantee it can be edited or rerun anywhere.",
    },
  },
  {
    title: { zh: "版本和权限透明", en: "Transparent Versions and Permissions" },
    text: {
      zh: "先在 Hub 了解公开版本与资源要求。Studio 管理关联 Station 的应用，Hub 发布版本的下载与安装分发仍在对接。",
      en: "Review public versions and resource requirements in Hub. Studio manages apps on the connected Station; distribution of Hub releases for download and installation is still being integrated.",
    },
  },
];

const scenes = [
  {
    index: "01 / Script",
    title: { zh: "角色资料，留给下一段故事", en: "Characters for the next story" },
    text: {
      zh: "目标是把选定的角色参考与设定按版本保存，供后续项目查找和选用；不承诺自动还原角色模型或保证生成一致性。",
      en: "The goal is to version selected character references and notes for later projects, without promising automatic character reconstruction or consistent generation.",
    },
    image: "usecase-script-video.webp",
    alt: { zh: "短视频脚本成片创作者工作室", en: "Creator studio for short video script generation" },
  },
  {
    index: "02 / Ad",
    title: { zh: "品牌素材，不必从头整理", en: "Build on brand materials" },
    text: {
      zh: "围绕已选定的视觉素材、来源与使用范围组织下一轮创作。跨项目选用与许可说明是正在完善的重点。",
      en: "Organize the next creative round around selected visuals, their origins, and permitted use. Cross-project selection and license information are areas we’re improving.",
    },
    image: "usecase-ad-storyboard.webp",
    alt: { zh: "广告创意测试分镜工作台", en: "Storyboard desk for ad creative testing" },
  },
  {
    index: "03 / Product",
    title: { zh: "产品版本，保留迭代依据", en: "Keep the history behind a product visual" },
    text: {
      zh: "用固定版本关联商品参考与成果，明确这次选用了哪份素材；后续更新不应悄悄替换旧项目的引用。",
      en: "Link product references and outputs through fixed versions, so later updates do not silently replace assets used by an earlier project.",
    },
    image: "usecase-ecommerce.webp",
    alt: { zh: "电商产品展示视频静帧", en: "Video still for ecommerce product display" },
  },
  {
    index: "04 / Previz",
    title: { zh: "真实工程，才能继续编辑", en: "Keep source files for the next edit" },
    text: {
      zh: "如应用实际提供工程或工作流，应连同依赖保留。能否重新打开或运行，仍需对应应用与当前 Station 验证。",
      en: "Where an app provides source files or workflows, preserve their dependencies too. Reopening or running them requires validation with the app and current Station.",
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
      zh: "围绕团队的模型接入、项目交付与资产积累需求，确认适合的服务范围。",
      en: "Define a service scope around your team’s model access, project delivery, and asset management needs.",
    },
    features: [
      { zh: "按组织管理成员、角色与能力授权", en: "Manage members, roles, and access by organization" },
      { zh: "共同评估资产流程、部署与数据边界", en: "Review asset workflows, deployment, and data boundaries together" },
      { zh: "单独确认模型范围、额度和服务边界", en: "Confirm model scope, credits, and service boundaries" },
    ],
    cta: { zh: "联系团队", en: "Contact the Team" },
    href: "mailto:hello@verdantflarehub.com?subject=VerdantFlare%20Team%20Plan",
  },
];

const coreCapabilities = [
  {
    number: "01",
    title: { zh: "Project：记住创作过程", en: "Project: keep the context" },
    text: { zh: "从 Studio 进入项目，记录成果的修订与选用的资产版本，让下一次创作有据可循。能否继续编辑或运行，仍以对应应用的实际支持为准。", en: "Open your project through Studio to track revisions and selected asset versions, giving future work a clear starting point. Further editing or execution depends on the app’s actual support." },
  },
  {
    number: "02",
    title: { zh: "World：积累可复用资产", en: "World: build an asset library" },
    text: { zh: "明确选择后将成果登记为资产，保留来源和固定版本。资产入库不等于公开发布，查找、预览与跨项目复用体验正在完善。", en: "Explicitly select outputs to register as assets with fixed versions and provenance. Registration is not public sharing; discovery, previews, and cross-project reuse are being improved." },
  },
  {
    number: "03",
    title: { zh: "Station：明确执行与数据边界", en: "Station: know where work runs" },
    text: { zh: "应用在关联 Station 上执行，内容由 Artifact 受控存储。本地不默认指你的电脑；调用外部模型时，仍需核对素材外发范围。", en: "Apps run on the connected Station, with content managed by Artifact. Local does not necessarily mean your computer; external model calls require checking what data is sent out." },
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

  <button
    class="nav-theme"
    type="button"
    :aria-label="theme === 'dark' ? (isEnglish ? 'Switch to light mode' : '切换到浅色模式') : (isEnglish ? 'Switch to dark mode' : '切换到深色模式')"
    :title="theme === 'dark' ? (isEnglish ? 'Light mode' : '浅色模式') : (isEnglish ? 'Dark mode' : '深色模式')"
    :aria-pressed="theme === 'light'"
    @click="toggleTheme"
  >
    <svg v-if="theme === 'dark'" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
    <svg v-else aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.98 13.1A9 9 0 0 1 10.9 3.02 9 9 0 1 0 20.98 13.1Z" /></svg>
    <span>{{ theme === 'dark' ? (isEnglish ? 'Light' : '浅色') : (isEnglish ? 'Dark' : '深色') }}</span>
  </button>

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
    :route-search="currentSearch"
    :locale="locale"
  />
  <PublicContentView
    v-else-if="route.name === 'public-content'"
    :page="route.page"
    :locale="locale"
  />
  <LegalDocumentView
    v-else-if="route.name === 'legal-document'"
    :document="route.document"
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
          <p class="eyebrow">{{ isEnglish ? 'VerdantFlare · Build on your work' : '青焰 · 让创作持续积累' }}</p>
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

        <div class="storyboard" :aria-label="isEnglish ? 'Project to asset reuse: product direction' : '从项目到资产复用：产品建设方向'">
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
          <p v-if="catalogState.loading" class="catalog-status" role="status">{{ text.catalogLoading }}</p>
          <div v-else-if="catalogState.error" class="catalog-status catalog-feedback">
            <p role="alert">{{ text.catalogError }}</p>
            <button class="button" type="button" @click="loadPublicCatalog">{{ isEnglish ? "Try again" : "重新加载" }}</button>
          </div>
          <p v-else-if="!publicModelPreview.length" class="catalog-status">{{ text.catalogEmpty }}</p>
          <div v-else class="public-model-rows">
            <div v-for="model in publicModelPreview" :key="model.id" class="public-model-row">
              <div class="public-model-identity">
                <ProviderLogo :url="model.providerIconUrl" :name="model.provider" />
                <div><strong>{{ tModelName(model, locale) }}</strong><span>{{ tProvider(model.provider, locale) }}</span></div>
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
                  ? 'Illustration of a creative workspace, not a product screenshot'
                  : '创作工作区示意图，非产品界面截图'
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
          <h3>{{ isEnglish ? 'What reuse could look like' : '下一次创作，可以怎样继续' }}</h3>
          <p>{{ isEnglish ? 'Illustrated use cases, not customer results or proof of completed workflows. Availability depends on the app, permissions, and environment.' : '以下为场景示意，并非客户案例或已完成流程的证明。实际可用范围以应用、权限和环境验证为准。' }}</p>
        </div>
        <div class="section-actions">
          <a class="button primary" href="/solutions/creator">{{ text.solutionCta }}</a>
        </div>

        <div class="gallery" :aria-label="isEnglish ? 'Illustrated asset reuse scenarios' : '资产复用场景示意'">
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
      <span class="footer-legal-links"><a href="/terms">{{ isEnglish ? 'Terms' : '服务条款' }}</a><a href="/privacy">{{ isEnglish ? 'Privacy' : '隐私政策' }}</a></span>
    </div>
  </footer>
</template>
