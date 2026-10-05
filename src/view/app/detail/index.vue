<script setup>
import { computed } from "vue";
import { getAppById, getCategoryLabel, tAppMarket } from "../../../catalog/public";
import { hubHref } from "../../../config/external";
import { isOriginalChinese, localizeCatalog } from "../../../catalog/localize";

const props = defineProps({ appId: String, locale: { type: String, default: "zh" } });
const app = computed(() => getAppById(props.appId));
const text = computed(() => (key) => tAppMarket(props.locale, key));
const summary = computed(() => localizeCatalog("appSummary", app.value?.summary, props.locale));
const description = computed(() => localizeCatalog("appDescription", app.value?.description, props.locale));
const hasOriginalChinese = computed(() => isOriginalChinese(summary.value, props.locale) || isOriginalChinese(description.value, props.locale));
</script>

<template>
  <main v-if="app" class="market-page app-detail-page">
    <section class="market-detail-hero app-detail-top"><div class="market-wrap">
      <a class="app-back" href="/apps">{{ text("back") }}</a>
      <div class="app-detail-identity"><span class="app-detail-icon"><i>{{ app.name.slice(0, 2) }}</i><img v-if="app.icon" :src="app.icon" :alt="app.name" /></span><div><h1>{{ app.name }}</h1><p :lang="isOriginalChinese(summary, locale) ? 'zh-CN' : undefined">{{ summary }}</p><span v-if="app.developer">{{ app.developer }}</span></div></div>
      <p v-if="hasOriginalChinese" class="catalog-source-note">{{ text("originalChinese") }}</p>
    </div></section>
    <section class="market-section app-detail-content"><div class="market-wrap">
      <div class="app-stat-row" :aria-label="text('about')">
        <article v-if="app.version"><span>{{ text("catalogVersion") }}</span><strong>{{ app.version }}</strong></article>
        <article v-if="app.stats.memory"><span>{{ text("referenceMemory") }}</span><strong>{{ app.stats.memory }}</strong></article>
        <article v-if="app.stats.disk"><span>{{ text("referenceDisk") }}</span><strong>{{ app.stats.disk }}</strong></article>
        <article v-if="app.stats.cpu"><span>{{ text("referenceCpu") }}</span><strong>{{ app.stats.cpu }}</strong></article>
        <article v-if="app.stats.gpu"><span>{{ text("referenceGpu") }}</span><strong>{{ app.stats.gpu }}</strong></article>
      </div>
      <div class="app-detail-layout"><div class="app-detail-primary"><article class="app-info-panel"><h2>{{ text("about") }}</h2><p :lang="isOriginalChinese(description, locale) ? 'zh-CN' : undefined">{{ description }}</p><div class="app-detail-tags"><span>{{ getCategoryLabel(app.category, locale) }}</span></div><p>{{ text("publicListingDisclaimer") }}</p></article></div>
        <aside class="app-install-panel"><a class="app-get-link" :href="hubHref(`/market/apps/${app.id}`, { entry: 'app-detail' })">{{ text("accessInHub") }}</a><dl><div v-if="app.version"><dt>{{ text("chartVersion") }}</dt><dd>{{ app.version }}</dd></div></dl></aside>
      </div>
    </div></section>
  </main>
</template>
