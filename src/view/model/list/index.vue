<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { modelCategories, models, providers } from "../data";

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
          <p class="market-kicker">Qingyan Model Market</p>
          <h1 id="market-title">模型市场</h1>
          <p>
            统一浏览青焰可调用模型、价格、能力和 API 接入方式。支持文本、推理、图片理解、视频生成和多模态工作流。
          </p>
          <div class="market-hero-actions">
            <a class="button primary" href="/view/model/detail/deepseek-v4-pro">
              查看推荐模型
            </a>
            <a class="button" href="/view/model/order">模型订单</a>
          </div>
        </div>

        <div class="market-orbit" aria-label="模型能力摘要">
          <span>Models</span>
          <strong>{{ models.length }}</strong>
          <small>按积分计价 · API 统一接入 · 下单前确认额度</small>
        </div>
      </div>
    </section>

    <section class="market-section">
      <div class="market-wrap">
        <div class="market-toolbar">
          <label class="market-search">
            <span>搜索</span>
            <input v-model="search" type="search" placeholder="搜索模型、供应商或能力" />
          </label>

          <div class="market-selects">
            <label>
              <span>能力</span>
              <select v-model="category">
                <option>全部能力</option>
                <option v-for="item in modelCategories" :key="item">{{ item }}</option>
              </select>
            </label>
            <label>
              <span>供应商</span>
              <select v-model="provider">
                <option>全部供应商</option>
                <option v-for="item in providers" :key="item">{{ item }}</option>
              </select>
            </label>
            <label>
              <span>展示</span>
              <select v-model="viewMode" aria-label="切换展示方式">
                <option value="grid">图块</option>
                <option value="list">列表</option>
              </select>
            </label>
          </div>
        </div>

        <div class="market-filter-row" aria-label="能力快捷筛选">
          <button
            :class="{ active: category === '全部能力' }"
            type="button"
            @click="category = '全部能力'"
          >
            全部
          </button>
          <button
            v-for="item in modelCategories"
            :key="item"
            :class="{ active: category === item }"
            type="button"
            @click="category = item"
          >
            {{ item }}
          </button>
        </div>

        <div :class="['model-results', viewMode]">
          <a
            v-for="model in visibleModels"
            :key="model.id"
            class="model-card"
            :href="`/view/model/detail/${model.id}`"
          >
            <div class="model-card-top">
              <div :class="['model-logo', model.accent]">
                {{ model.name.slice(0, 1) }}
              </div>
              <div>
                <h2>{{ model.name }}</h2>
                <div class="model-tags">
                  <span v-for="tag in model.categories.slice(0, 2)" :key="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <p>{{ model.summary }}</p>
            <div class="model-card-meta">
              <span>输入 · {{ model.inputPrice }} 积分/百万tokens</span>
              <span>输出 · {{ model.outputPrice }} 积分/百万tokens</span>
              <time>{{ model.date }}</time>
            </div>
          </a>
        </div>

        <div ref="sentinel" class="market-load">
          <button v-if="hasMore" class="button" type="button" @click="loadMore">
            加载更多模型
          </button>
          <span v-else>已展示全部 {{ filteredModels.length }} 个模型</span>
        </div>
      </div>
    </section>
  </main>
</template>
