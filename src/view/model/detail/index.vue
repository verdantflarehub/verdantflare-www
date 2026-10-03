<script setup>
import { computed } from "vue";
import { getModelById } from "../../../catalog/public";
import { hubHref } from "../../../config/external";
import { tCategory, tMarket, tModelName, tModelSummary } from "../i18n";

const props = defineProps({ modelId: String, locale: { type: String, default: "zh" } });
const model = computed(() => getModelById(props.modelId));
const text = computed(() => (key) => tMarket(props.locale, key));
</script>

<template>
  <main v-if="model" class="market-page model-detail-page">
    <section class="market-detail-hero">
      <div class="market-wrap">
        <a class="market-back" href="/models">{{ text("backToMarket") }}</a>
        <div class="model-detail-head">
          <div class="model-logo large">{{ tModelName(model, locale).slice(0, 1) }}</div>
          <div>
            <div class="detail-title-row"><h1>{{ tModelName(model, locale) }}</h1><span v-if="model.categories[0]">{{ tCategory(model.categories[0], locale) }}</span></div>
            <p>{{ tModelSummary(model, locale) }}</p>
            <div class="detail-actions"><a class="button primary" :href="hubHref('/api/models', { model: model.id, entry: 'model-detail' })">前往 Hub 查看接入状态</a></div>
          </div>
        </div>
      </div>
    </section>
    <section class="market-section detail-content">
      <div class="market-wrap">
        <div v-if="model.inputPrice || model.outputPrice || model.cachePrice" class="detail-block">
          <h2>公开报价</h2>
          <p>以下是 Hub 管理的公开目录报价；实际可调用性和结算以模型网关及合同为准。</p>
          <div class="pricing-table" role="table" aria-label="公开报价">
            <div v-if="model.inputPrice" class="pricing-row" role="row"><span>输入</span><strong>{{ model.inputPrice }}</strong><span>{{ model.priceUnit }}</span></div>
            <div v-if="model.outputPrice" class="pricing-row" role="row"><span>输出</span><strong>{{ model.outputPrice }}</strong><span>{{ model.priceUnit }}</span></div>
            <div v-if="model.cachePrice" class="pricing-row" role="row"><span>缓存</span><strong>{{ model.cachePrice }}</strong><span>{{ model.priceUnit }}</span></div>
          </div>
        </div>
        <div v-else class="detail-block"><h2>价格待公布</h2><p>当前公开目录没有经过审核的报价。</p></div>
        <div class="model-intro-grid">
          <section class="detail-panel"><h2>模型资料</h2><div class="spec-grid">
            <div v-if="model.context"><span>上下文</span><strong>{{ model.context }}</strong></div>
            <div v-if="model.maxInput"><span>最大输入</span><strong>{{ model.maxInput }}</strong></div>
            <div v-if="model.maxOutput"><span>最大输出</span><strong>{{ model.maxOutput }}</strong></div>
          </div></section>
          <section class="detail-panel wide"><h2>关于模型</h2><p>{{ tModelSummary(model, locale) }}</p><p>此页是公开资料，不表示你的组织已经获得调用权限。</p></section>
        </div>
      </div>
    </section>
  </main>
</template>
