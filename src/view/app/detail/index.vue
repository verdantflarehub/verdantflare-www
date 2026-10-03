<script setup>
import { computed } from "vue";
import { getAppById, getCategoryLabel, tAppMarket } from "../../../catalog/public";
import { hubHref } from "../../../config/external";

const props = defineProps({ appId: String, locale: { type: String, default: "zh" } });
const app = computed(() => getAppById(props.appId));
const text = computed(() => (key) => tAppMarket(props.locale, key));
</script>

<template>
  <main v-if="app" class="market-page app-detail-page">
    <section class="market-detail-hero app-detail-top"><div class="market-wrap">
      <a class="app-back" href="/apps">{{ text("back") }}</a>
      <div class="app-detail-identity"><span class="app-detail-icon"><i>{{ app.name.slice(0, 2) }}</i><img v-if="app.icon" :src="app.icon" :alt="app.name" /></span><div><h1>{{ app.name }}</h1><p>{{ app.summary }}</p><span v-if="app.developer">{{ app.developer }}</span></div></div>
    </div></section>
    <section class="market-section app-detail-content"><div class="market-wrap">
      <div class="app-stat-row" aria-label="应用资料">
        <article v-if="app.version"><span>当前目录版本</span><strong>{{ app.version }}</strong></article>
        <article v-if="app.stats.memory"><span>参考内存</span><strong>{{ app.stats.memory }}</strong></article>
        <article v-if="app.stats.disk"><span>参考磁盘</span><strong>{{ app.stats.disk }}</strong></article>
        <article v-if="app.stats.cpu"><span>参考 CPU</span><strong>{{ app.stats.cpu }}</strong></article>
        <article v-if="app.stats.gpu"><span>参考 GPU</span><strong>{{ app.stats.gpu }}</strong></article>
      </div>
      <div class="app-detail-layout"><div class="app-detail-primary"><article class="app-info-panel"><h2>{{ text("about") }}</h2><p>{{ app.description }}</p><div class="app-detail-tags"><span>{{ getCategoryLabel(app.category, locale) }}</span></div><p>此页仅为公开目录资料，不代表应用已在 Station 安装或可运行。</p></article></div>
        <aside class="app-install-panel"><a class="app-get-link" :href="hubHref(`/market/apps/${app.id}`, { entry: 'app-detail' })">前往 Hub 查看组织权益</a><dl><div v-if="app.version"><dt>{{ text("chartVersion") }}</dt><dd>{{ app.version }}</dd></div></dl></aside>
      </div>
    </div></section>
  </main>
</template>
