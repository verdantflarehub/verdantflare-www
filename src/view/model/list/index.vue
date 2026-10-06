<script setup>
import { computed } from "vue";
import { catalogState, models } from "../../../catalog/public";
import { tCategory, tModelName, tModelSummary, tProvider } from "../i18n";
import { hubHref } from "../../../config/external";
import { isOriginalChinese } from "../../../catalog/localize";

const props = defineProps({ locale: { type: String, default: "zh" } });
const isEnglish = computed(() => props.locale === "en");
</script>

<template>
  <main class="market-page public-directory-page">
    <section class="market-hero" aria-labelledby="public-directory-title">
      <div class="market-wrap">
        <p class="market-kicker">VerdantFlare Models</p>
        <h1 id="public-directory-title">{{ isEnglish ? "A guide to published models." : "公开模型，一目了然。" }}</h1>
        <p>{{ isEnglish ? "Browse published capabilities and input types. This read-only directory does not show your organization's access, live availability, or actual billing." : "这里仅展示已公开的能力与输入资料。组织授权、实时可用性和实际计费，请登录 Hub 查看。" }}</p>
        <div class="market-hero-actions">
          <a class="button primary" :href="hubHref('/api/models', { entry: 'public-models' })">{{ isEnglish ? "Open the model catalog in Hub" : "进入 Hub 模型目录" }}</a>
          <a class="button" href="/#model">{{ isEnglish ? "Back to model overview" : "返回模型概览" }}</a>
        </div>
      </div>
    </section>

    <section class="market-section">
      <div class="market-wrap">
        <div class="public-directory-heading">
          <h2>{{ isEnglish ? "Published reference" : "已公开资料" }}</h2>
          <span>{{ isEnglish ? "Read-only · source: Control public catalog" : "只读 · 来源：Control 公开目录" }}</span>
        </div>
        <p v-if="catalogState.loading" class="catalog-status">{{ isEnglish ? "Loading public models…" : "正在读取公开模型…" }}</p>
        <p v-else-if="catalogState.error" class="catalog-status" role="status">{{ isEnglish ? "The public catalog is temporarily unavailable." : "公开目录暂时无法读取，请稍后再试。" }}</p>
        <p v-else-if="!models.length" class="catalog-status">{{ isEnglish ? "No models have been published yet." : "暂无已公开模型。" }}</p>
        <div v-else class="public-directory-list">
          <article v-for="model in models" :key="model.id" class="public-directory-item">
            <div class="public-directory-name">
              <h3>{{ tModelName(model, locale) }}</h3>
              <span>{{ tProvider(model.provider, locale) }}</span>
            </div>
            <div>
              <div class="public-directory-categories">
                <span v-for="category in model.categories" :key="category">{{ tCategory(category, locale) }}</span>
              </div>
              <p :lang="isOriginalChinese(tModelSummary(model, locale), locale) ? 'zh-CN' : undefined">{{ tModelSummary(model, locale) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
