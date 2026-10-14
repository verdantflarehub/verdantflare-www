<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  appCategories,
  catalogState,
  getCategoryLabel,
  loadPublicCatalog,
  marketApps,
  tAppMarket,
} from "../../../catalog/public";
import { hubHref } from "../../../config/external";
import { isOriginalChinese, localizeCatalog } from "../../../catalog/localize";
import { appCardId, appCardIdFromHash, appDetailHref, appListContextForCatalog, appListHref, isAppListLocation, readAppListContext } from "../../../catalog/appNavigation";

const props = defineProps({
  locale: {
    type: String,
    default: "zh",
  },
});

const initialContext = readAppListContext(window.location.search);
const search = ref(initialContext.search);
const searchInput = ref(null);
const category = ref(initialContext.category);
const viewMode = ref(initialContext.view);
const visibleCount = ref(initialContext.count);
let applyingContext = false;
let restoreSequence = 0;
let disposed = false;
let cancelAnchorRestore = false;

const text = computed(() => (key) => tAppMarket(props.locale, key));
const filterCategories = computed(() =>
  appCategories.filter((item) => item.id !== "discover" && marketApps.some((app) => app.category === item.id))
);

const filteredApps = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return marketApps.filter((app) => {
    const matchesKeyword =
      !keyword ||
      app.name.toLowerCase().includes(keyword) ||
      app.summary.toLowerCase().includes(keyword) ||
      localizeCatalog("appSummary", app.summary, props.locale).toLowerCase().includes(keyword) ||
      app.developer.toLowerCase().includes(keyword) ||
      getCategoryLabel(app.category, props.locale).toLowerCase().includes(keyword);
    const matchesCategory = category.value === "all" || app.category === category.value;

    return matchesKeyword && matchesCategory;
  });
});

const visibleApps = computed(() => filteredApps.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredApps.value.length);
const listContext = computed(() => ({ search: search.value, category: category.value, view: viewMode.value, count: visibleCount.value }));

const saveContext = (appId = "") => {
  if (!isAppListLocation(window.location.pathname, window.location.hash)) return;
  const href = appListHref(listContext.value, appId);
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === href) return;
  try {
    window.history.replaceState(window.history.state, "", href);
  } catch {
    // Filtering and explicit detail return links remain usable if history writes are restricted.
  }
};

const restoreAnchor = async () => {
  const sequence = ++restoreSequence;
  const targetId = appCardIdFromHash(window.location.hash);
  if (!targetId || catalogState.loading || catalogState.error || cancelAnchorRestore) return;
  await nextTick();
  if (disposed || sequence !== restoreSequence || cancelAnchorRestore) return;
  const target = document.getElementById(targetId);
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 72;
  window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16), behavior: "instant" });
};

const restoreContext = () => {
  if (!isAppListLocation(window.location.pathname, window.location.hash)) return;
  const requested = readAppListContext(window.location.search);
  const context = catalogState.loading || catalogState.error ? requested : appListContextForCatalog(requested, filterCategories.value.map((item) => item.id));
  applyingContext = true;
  search.value = context.search;
  category.value = context.category;
  viewMode.value = context.view;
  visibleCount.value = context.count;
  applyingContext = false;
  cancelAnchorRestore = false;
  if (context.category !== requested.category) saveContext();
  restoreAnchor();
};

const cancelRestoreOnInteraction = (event) => {
  if (event.type === "keydown" && !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
  cancelAnchorRestore = true;
  restoreSequence += 1;
};

const loadMore = () => {
  if (hasMore.value) visibleCount.value += 8;
};

const clearFilters = async () => {
  search.value = "";
  category.value = "all";
  await nextTick();
  searchInput.value?.focus();
};

const handleImageError = (event) => {
  event.currentTarget.remove();
};

watch([search, category], () => {
  if (applyingContext) return;
  visibleCount.value = 12;
  cancelAnchorRestore = true;
  restoreSequence += 1;
  saveContext();
}, { flush: "sync" });

watch([viewMode, visibleCount], () => {
  if (!applyingContext) saveContext();
}, { flush: "sync" });

watch(() => catalogState.loading, (loading) => {
  if (loading || catalogState.error || !isAppListLocation(window.location.pathname, window.location.hash)) return;
  const valid = appListContextForCatalog(listContext.value, filterCategories.value.map((item) => item.id));
  if (valid.category !== category.value) category.value = valid.category;
  restoreAnchor();
});

onMounted(() => {
  restoreContext();
  window.addEventListener("popstate", restoreContext);
  window.addEventListener("hashchange", restoreContext);
  for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(event, cancelRestoreOnInteraction, { passive: true });
});

onUnmounted(() => {
  disposed = true;
  restoreSequence += 1;
  window.removeEventListener("popstate", restoreContext);
  window.removeEventListener("hashchange", restoreContext);
  for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.removeEventListener(event, cancelRestoreOnInteraction);
});
</script>

<template>
  <main class="market-page app-list-market-page">
    <section class="market-hero" aria-labelledby="app-market-title">
      <div class="market-wrap market-hero-grid">
        <div>
          <p class="market-kicker">{{ text("marketKicker") }}</p>
          <h1 id="app-market-title">{{ text("marketTitle") }}</h1>
          <p>
            {{ text("marketLead") }}
          </p>
          <div class="market-hero-actions">
            <a v-if="marketApps.length" class="button primary" :href="appDetailHref(marketApps[0].id, listContext)" @click="saveContext(marketApps[0].id)">
              {{ text("recommended") }}
            </a>
            <a class="button" :href="hubHref('/market', { entry: 'apps-hero' })">Hub Market</a>
          </div>
        </div>

        <div class="market-orbit" :aria-label="text('orbitLabel')">
          <span>Apps</span>
          <strong>{{ catalogState.loading || catalogState.error ? "—" : marketApps.length }}</strong>
          <small>{{ text("orbitMeta") }}</small>
        </div>
      </div>
    </section>

    <section class="market-section">
      <div class="market-wrap">
        <div class="market-toolbar">
          <label class="market-search">
            <span>{{ text("search") }}</span>
            <input
              ref="searchInput"
              v-model="search"
              type="search"
              :placeholder="text('searchPlaceholder')"
            />
          </label>

          <div class="market-selects">
            <label>
              <span>{{ text("category") }}</span>
              <select v-model="category">
                <option value="all">{{ text("allCategories") }}</option>
                <option
                  v-for="item in filterCategories"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.label[locale] || item.label.zh }}
                </option>
              </select>
            </label>
            <label>
              <span>{{ text("view") }}</span>
              <select v-model="viewMode" :aria-label="text('viewAria')">
                <option value="grid">{{ text("grid") }}</option>
                <option value="list">{{ text("list") }}</option>
              </select>
            </label>
          </div>
        </div>

        <div class="market-filter-row" :aria-label="text('quickFilter')">
          <button
            :class="{ active: category === 'all' }"
            :aria-pressed="category === 'all'"
            type="button"
            @click="category = 'all'"
          >
            {{ text("all") }}
          </button>
          <button
            v-for="item in filterCategories"
            :key="item.id"
            :class="{ active: category === item.id }"
            :aria-pressed="category === item.id"
            type="button"
            @click="category = item.id"
          >
            {{ item.label[locale] || item.label.zh }}
          </button>
        </div>

        <p v-if="catalogState.loading" class="catalog-status" role="status">{{ text("catalogLoading") }}</p>
        <div v-else-if="catalogState.error" class="catalog-status catalog-feedback">
          <p role="alert">{{ text("catalogError") }}</p>
          <button class="button" type="button" @click="loadPublicCatalog">{{ text("retryCatalog") }}</button>
        </div>
        <p v-else-if="!marketApps.length" class="catalog-status" role="status">{{ text("catalogEmpty") }}</p>
        <div v-else-if="!filteredApps.length" class="catalog-status catalog-feedback">
          <p role="status">{{ text("noMatches") }}</p>
          <button class="button" type="button" @click="clearFilters">{{ text("clearFilters") }}</button>
        </div>
        <div v-else :class="['app-results', 'model-results', viewMode]">
          <a
            v-for="app in visibleApps"
            :key="app.id"
            class="model-card app-market-card"
            :id="appCardId(app.id)"
            :href="appDetailHref(app.id, listContext)"
            @click="saveContext(app.id)"
          >
            <div class="model-card-top">
              <div class="app-card-logo">
                <i>{{ app.name.slice(0, 2) }}</i>
                <img
                  v-if="app.icon"
                  :src="app.icon"
                  :alt="app.name"
                  decoding="async"
                  @error="handleImageError"
                />
              </div>
              <div>
                <h2>{{ app.name }}</h2>
                <div class="model-tags">
                  <span>{{ getCategoryLabel(app.category, locale) }}</span>
                  <span>{{ app.developer }}</span>
                </div>
              </div>
            </div>
            <p :lang="isOriginalChinese(localizeCatalog('appSummary', app.summary, locale), locale) ? 'zh-CN' : undefined"><small v-if="isOriginalChinese(localizeCatalog('appSummary', app.summary, locale), locale)" class="catalog-source-note">{{ text("originalChinese") }}</small>{{ localizeCatalog("appSummary", app.summary, locale) }}</p>
            <div class="model-card-meta">
              <span v-if="app.version">
                <b>{{ text("versionHistory") }}</b>
                <em>{{ app.version }}</em>
              </span>
              <span v-if="app.stats.memory">
                <b>{{ text("memory") }}</b>
                <em>{{ app.stats.memory }}</em>
              </span>
            </div>
          </a>
        </div>

        <div v-if="!catalogState.loading && !catalogState.error && filteredApps.length" class="market-load">
          <button v-if="hasMore" class="button" type="button" @click="loadMore">
            {{ text("loadMore") }}
          </button>
          <span v-else>
            {{ text("allShown") }} {{ filteredApps.length }} {{ text("appsUnit") }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>
