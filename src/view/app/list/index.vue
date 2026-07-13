<script setup>
import { computed, ref, watch } from "vue";
import {
  appCategories,
  getCategoryLabel,
  marketApps,
  tAppMarket,
} from "../data";

const props = defineProps({
  locale: {
    type: String,
    default: "zh",
  },
});

const search = ref("");
const category = ref("all");
const viewMode = ref("grid");
const visibleCount = ref(12);

const text = computed(() => (key) => tAppMarket(props.locale, key));
const filterCategories = computed(() =>
  appCategories.filter((item) => item.id !== "discover")
);

const filteredApps = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return marketApps.filter((app) => {
    const matchesKeyword =
      !keyword ||
      app.name.toLowerCase().includes(keyword) ||
      app.summary.toLowerCase().includes(keyword) ||
      app.developer.toLowerCase().includes(keyword) ||
      getCategoryLabel(app.category, props.locale).toLowerCase().includes(keyword);
    const matchesCategory = category.value === "all" || app.category === category.value;

    return matchesKeyword && matchesCategory;
  });
});

const visibleApps = computed(() => filteredApps.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredApps.value.length);

const loadMore = () => {
  if (hasMore.value) visibleCount.value += 8;
};

const handleImageError = (event) => {
  event.currentTarget.remove();
};

watch([search, category], () => {
  visibleCount.value = 12;
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
            <a class="button primary" href="/#app-market/detail/ollama">
              {{ text("recommended") }}
            </a>
            <a class="button" href="/#app-market/detail/openclaw">OpenClaw</a>
          </div>
        </div>

        <div class="market-orbit" :aria-label="text('orbitLabel')">
          <span>Apps</span>
          <strong>{{ marketApps.length }}</strong>
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
            type="button"
            @click="category = 'all'"
          >
            {{ text("all") }}
          </button>
          <button
            v-for="item in filterCategories"
            :key="item.id"
            :class="{ active: category === item.id }"
            type="button"
            @click="category = item.id"
          >
            {{ item.label[locale] || item.label.zh }}
          </button>
        </div>

        <div :class="['app-results', 'model-results', viewMode]">
          <a
            v-for="app in visibleApps"
            :key="app.id"
            class="model-card app-market-card"
            :href="`/#app-market/detail/${app.id}`"
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
            <p>{{ app.summary }}</p>
            <div class="model-card-meta">
              <span>
                <b>{{ text("versionHistory") }}</b>
                <em>{{ app.version }}</em>
              </span>
              <span>
                <b>{{ text("memory") }}</b>
                <em>{{ app.stats.memory }}</em>
              </span>
              <time>{{ app.language }}</time>
            </div>
          </a>
        </div>

        <div class="market-load">
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
