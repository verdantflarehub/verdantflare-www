<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { modelCategories, models, providers } from "../data";
import {
  tCategory,
  tMarket,
  tModelName,
  tModelSummary,
  tProvider,
} from "../i18n";

const props = defineProps({
  locale: {
    type: String,
    default: "zh",
  },
});

const search = ref("");
const category = ref("全部能力");
const provider = ref("全部供应商");
const viewMode = ref("grid");
const visibleCount = ref(9);
const sentinel = ref(null);
let observer;

const filteredModels = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return models.filter((model) => {
    const matchesKeyword =
      !keyword ||
      model.name.toLowerCase().includes(keyword) ||
      model.provider.toLowerCase().includes(keyword) ||
      model.summary.toLowerCase().includes(keyword);
    const matchesCategory =
      category.value === "全部能力" || model.categories.includes(category.value);
    const matchesProvider =
      provider.value === "全部供应商" || model.provider === provider.value;

    return matchesKeyword && matchesCategory && matchesProvider;
  });
});

const visibleModels = computed(() =>
  filteredModels.value.slice(0, visibleCount.value)
);

const hasMore = computed(() => visibleCount.value < filteredModels.value.length);
const text = computed(() => (key) => tMarket(props.locale, key));
const allCapabilities = computed(() => text.value("allCapabilities"));
const allProviders = computed(() => text.value("allProviders"));

const loadMore = () => {
  if (hasMore.value) visibleCount.value += 6;
};

watch([search, category, provider], () => {
  visibleCount.value = 9;
});

onMounted(() => {
  if (!("IntersectionObserver" in window) || !sentinel.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) loadMore();
    },
    { rootMargin: "360px" }
  );
  observer.observe(sentinel.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <main class="market-page market-list-page">
    <section class="market-hero" aria-labelledby="market-title">
      <div class="market-wrap market-hero-grid">
        <div>
          <p class="market-kicker">verdantflare Model Market</p>
          <h1 id="market-title">{{ text("marketTitle") }}</h1>
          <p>
            {{ text("marketLead") }}
          </p>
          <div class="market-hero-actions">
            <a class="button primary" href="/#market/detail/deepseek-v4-pro">
              {{ text("recommended") }}
            </a>
            <a class="button" href="/#market/order">{{ text("order") }}</a>
          </div>
        </div>

        <div class="market-orbit" :aria-label="text('orbitLabel')">
          <span>Models</span>
          <strong>{{ models.length }}</strong>
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
              <span>{{ text("capability") }}</span>
              <select v-model="category">
                <option value="全部能力">{{ allCapabilities }}</option>
                <option v-for="item in modelCategories" :key="item" :value="item">
                  {{ tCategory(item, locale) }}
                </option>
              </select>
            </label>
            <label>
              <span>{{ text("provider") }}</span>
              <select v-model="provider">
                <option value="全部供应商">{{ allProviders }}</option>
                <option v-for="item in providers" :key="item" :value="item">
                  {{ tProvider(item, locale) }}
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
            :class="{ active: category === '全部能力' }"
            type="button"
            @click="category = '全部能力'"
          >
            {{ text("all") }}
          </button>
          <button
            v-for="item in modelCategories"
            :key="item"
            :class="{ active: category === item }"
            type="button"
            @click="category = item"
          >
            {{ tCategory(item, locale) }}
          </button>
        </div>

        <div :class="['model-results', viewMode]">
          <a
            v-for="model in visibleModels"
            :key="model.id"
            class="model-card"
            :href="`/#market/detail/${model.id}`"
          >
            <div class="model-card-top">
              <div :class="['model-logo', model.accent]">
                {{ tModelName(model, locale).slice(0, 1) }}
              </div>
              <div>
                <h2>{{ tModelName(model, locale) }}</h2>
                <div class="model-tags">
                  <span v-for="tag in model.categories.slice(0, 2)" :key="tag">
                    {{ tCategory(tag, locale) }}
                  </span>
                </div>
              </div>
            </div>
            <p>{{ tModelSummary(model, locale) }}</p>
            <div class="model-card-meta">
              <span>
                <b>{{ text("input") }}</b>
                <em>{{ model.inputPrice }} {{ text("pointsPerMillion") }}</em>
              </span>
              <span>
                <b>{{ text("output") }}</b>
                <em>{{ model.outputPrice }} {{ text("pointsPerMillion") }}</em>
              </span>
              <time>{{ model.date }}</time>
            </div>
          </a>
        </div>

        <div ref="sentinel" class="market-load">
          <button v-if="hasMore" class="button" type="button" @click="loadMore">
            {{ text("loadMore") }}
          </button>
          <span v-else>
            {{ text("allShown") }} {{ filteredModels.length }} {{ text("modelsUnit") }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>
