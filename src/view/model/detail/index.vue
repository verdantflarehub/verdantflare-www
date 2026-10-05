<script setup>
import { computed } from "vue";
import { getModelById } from "../../../catalog/public";
import { hubHref } from "../../../config/external";
import { tCategory, tMarket, tModelName, tModelSummary } from "../i18n";
import { isOriginalChinese, localizeCatalog } from "../../../catalog/localize";

const props = defineProps({ modelId: String, locale: { type: String, default: "zh" } });
const model = computed(() => getModelById(props.modelId));
const text = computed(() => (key) => tMarket(props.locale, key));
const summary = computed(() => model.value ? tModelSummary(model.value, props.locale) : "");
const translated = (field, value) => localizeCatalog(field, value, props.locale);
const hasOriginalChinese = computed(() => model.value && [
  summary.value,
  translated("modelSpec", model.value.context),
  translated("modelSpec", model.value.maxInput),
  translated("modelSpec", model.value.maxOutput),
  translated("modelPrice", model.value.inputPrice),
  translated("modelPrice", model.value.outputPrice),
  translated("modelPrice", model.value.cachePrice),
  translated("modelPriceUnit", model.value.priceUnit),
].some((value) => isOriginalChinese(value, props.locale)));
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
            <p :lang="isOriginalChinese(summary, locale) ? 'zh-CN' : undefined">{{ summary }}</p>
            <div class="detail-actions"><a class="button primary" :href="hubHref('/api/models', { model: model.id, entry: 'model-detail' })">{{ text("detailAccess") }}</a></div>
          </div>
        </div>
        <p v-if="hasOriginalChinese" class="catalog-source-note">{{ text("originalChinese") }}</p>
      </div>
    </section>
    <section class="market-section detail-content">
      <div class="market-wrap">
        <div v-if="model.inputPrice || model.outputPrice || model.cachePrice" class="detail-block">
          <h2>{{ text("publicQuote") }}</h2>
          <p>{{ text("quoteDisclaimer") }}</p>
          <div class="pricing-table" role="table" :aria-label="text('publicQuote')">
            <div v-if="model.inputPrice" class="pricing-row" role="row"><span>{{ text("input") }}</span><strong>{{ translated("modelPrice", model.inputPrice) }}</strong><span>{{ translated("modelPriceUnit", model.priceUnit) }}</span></div>
            <div v-if="model.outputPrice" class="pricing-row" role="row"><span>{{ text("output") }}</span><strong>{{ translated("modelPrice", model.outputPrice) }}</strong><span>{{ translated("modelPriceUnit", model.priceUnit) }}</span></div>
            <div v-if="model.cachePrice" class="pricing-row" role="row"><span>{{ text("cache") }}</span><strong>{{ translated("modelPrice", model.cachePrice) }}</strong><span>{{ translated("modelPriceUnit", model.priceUnit) }}</span></div>
          </div>
        </div>
        <div v-else class="detail-block"><h2>{{ text("pricePending") }}</h2><p>{{ text("pricePendingDetail") }}</p></div>
        <div class="model-intro-grid">
          <section class="detail-panel"><h2>{{ text("modelData") }}</h2><div class="spec-grid">
            <div v-if="model.context"><span>{{ text("context") }}</span><strong>{{ translated("modelSpec", model.context) }}</strong></div>
            <div v-if="model.maxInput"><span>{{ text("maxInputDetail") }}</span><strong>{{ translated("modelSpec", model.maxInput) }}</strong></div>
            <div v-if="model.maxOutput"><span>{{ text("maxOutputDetail") }}</span><strong>{{ translated("modelSpec", model.maxOutput) }}</strong></div>
          </div></section>
          <section class="detail-panel wide"><h2>{{ text("aboutModel") }}</h2><p :lang="isOriginalChinese(summary, locale) ? 'zh-CN' : undefined">{{ summary }}</p><p>{{ text("accessDisclaimer") }}</p></section>
        </div>
      </div>
    </section>
  </main>
</template>
