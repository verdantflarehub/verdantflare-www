<script setup>
import { computed, ref } from "vue";
import { hubHref, toHubModelId } from "../../../config/external";
import { getApiExamples, getModelById } from "../data";
import {
  tCategory,
  tMarket,
  tMaxValue,
  tModelName,
  tModelSummary,
  tTag,
} from "../i18n";

const props = defineProps({
  modelId: { type: String, default: "deepseek-v4-pro" },
  locale: { type: String, default: "zh" },
});

const model = computed(() => getModelById(props.modelId));
const text = computed(() => (key) => tMarket(props.locale, key));
const activePanel = ref("intro");
const activeCode = ref("curl");
const copied = ref(false);
const isVideoModel = computed(() => model.value.apiType === "video");
const hubModelId = computed(() => toHubModelId(model.value.id));
const hubPlaygroundLabel = computed(() =>
  props.locale === "en" ? "Debug in Hub" : "前往 Hub 调试"
);
const hubKeyLabel = computed(() =>
  props.locale === "en" ? "Create API Key" : "创建 API Key"
);

const hubModelsHref = computed(() =>
  hubHref("/api/models", {
    entry: "model-detail",
    model: hubModelId.value,
    public_model_id: model.value.id,
  })
);
const hubPlaygroundHref = computed(() =>
  hubHref("/api/playground", {
    entry: "model-detail-playground",
    model: hubModelId.value,
    public_model_id: model.value.id,
  })
);
const hubKeysHref = computed(() =>
  hubHref("/api/keys", { entry: "model-detail-key", model: hubModelId.value })
);

const codeTabs = computed(() => [
  { id: "curl", label: "curl" },
  { id: "python", label: "python" },
  { id: "openai", label: isVideoModel.value ? "node.js" : "openai" },
]);
const localizedApiExamples = computed(() => {
  const examples = getApiExamples(model.value);
  if (props.locale !== "en") return examples;
  return {
    curl: examples.curl.replace("# 从环境变量获取 API 密钥", "# Read API key from environment"),
    python: examples.python,
    openai: examples.openai,
  };
});
const activeExample = computed(() => {
  const example = localizedApiExamples.value[activeCode.value];
  return isVideoModel.value ? example : example.replace("deepseek-v4-pro", model.value.id);
});
const codeLines = computed(() => activeExample.value.split("\n"));
const introText = computed(() =>
  text.value("introText").replace("{{name}}", tModelName(model.value, props.locale))
);

const copyExample = async () => {
  try {
    await navigator.clipboard.writeText(activeExample.value);
    copied.value = true;
    window.setTimeout(() => (copied.value = false), 1600);
  } catch {
    copied.value = false;
  }
};
</script>

<template>
  <main class="market-page model-detail-page">
    <section class="market-detail-hero">
      <div class="market-wrap">
        <a class="market-back" href="/models">{{ text("backToMarket") }}</a>
        <div class="model-detail-head">
          <div :class="['model-logo large', model.accent]">
            {{ tModelName(model, locale).slice(0, 1) }}
          </div>
          <div>
            <div class="detail-title-row">
              <h1>{{ tModelName(model, locale) }}</h1>
              <span>{{ tCategory(model.categories[0], locale) }}</span>
              <time>{{ text("publishedAt") }} {{ model.date }}</time>
            </div>
            <p>{{ tModelSummary(model, locale) }}</p>
            <div class="detail-actions">
              <a class="button primary" :href="hubPlaygroundHref">{{ hubPlaygroundLabel }}</a>
              <a class="button" :href="hubKeysHref">{{ hubKeyLabel }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="market-section detail-content">
      <div class="market-wrap">
        <div class="detail-block">
          <h2>{{ text("modelPrice") }}</h2>
          <div class="pricing-table" role="table" :aria-label="text('modelPrice')">
            <div class="pricing-row heading" role="row">
              <span>{{ text("billingOption") }}</span>
              <span>{{ text("pointsPerMillion") }}</span>
              <span>{{ text("yuanPerMillion") }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>{{ text("inputToken") }}</span><strong>{{ model.inputPrice }}</strong><span>{{ Math.round(model.inputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>{{ text("outputToken") }}</span><strong>{{ model.outputPrice }}</strong><span>{{ Math.round(model.outputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>{{ text("cacheHit") }}</span><strong>{{ model.cachePrice }}</strong><span>{{ Math.round(model.cachePrice / 1000) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-tabs" :aria-label="text('detailsTabs')">
          <button :class="{ active: activePanel === 'intro' }" type="button" @click="activePanel = 'intro'">{{ text("introTab") }}</button>
          <button :class="{ active: activePanel === 'api' }" type="button" @click="activePanel = 'api'">{{ text("apiCall") }}</button>
        </div>

        <div v-if="activePanel === 'intro'" class="model-intro-grid">
          <section class="detail-panel">
            <h2>{{ text("limits") }}</h2>
            <div class="spec-grid">
              <div><span>{{ text("contextLength") }}</span><strong>{{ model.context }}</strong></div>
              <div><span>{{ text("maxInput") }}</span><strong>{{ tMaxValue(model.maxInput, locale) }}</strong></div>
              <div><span>{{ text("maxOutput") }}</span><strong>{{ tMaxValue(model.maxOutput, locale) }}</strong></div>
              <div><span>TPM</span><strong>1,000k</strong></div>
              <div><span>RPM</span><strong>1k</strong></div>
            </div>
          </section>
          <section class="detail-panel">
            <h2>{{ text("capabilities") }}</h2>
            <div class="capability-list">
              <span v-for="tag in model.tags" :key="tag">{{ tTag(tag, locale) }}</span>
              <span>{{ text("cache") }}</span><span>{{ text("structuredOutput") }}</span>
            </div>
          </section>
          <section class="detail-panel wide"><h2>{{ text("intro") }}</h2><p>{{ introText }}</p></section>
        </div>

        <div v-else id="api-call" class="api-call-panel">
          <div class="api-call-head">
            <div><h2>{{ text(isVideoModel ? "videoCallTitle" : "chatCallTitle") }}</h2><p>{{ text(isVideoModel ? "videoCallLead" : "chatCallLead") }}</p></div>
            <a class="button primary" :href="hubModelsHref">Hub API Center</a>
          </div>
          <section class="api-step">
            <span class="step-index">1</span>
            <div class="api-step-content">
              <h3>{{ text(isVideoModel ? "videoCopyExampleTitle" : "copyExampleTitle") }}</h3>
              <div class="code-card">
                <div class="code-tabs">
                  <button v-for="tab in codeTabs" :key="tab.id" :class="{ active: activeCode === tab.id }" type="button" @click="activeCode = tab.id">{{ tab.label }}</button>
                  <button class="copy-code" type="button" @click="copyExample">{{ copied ? text("copied") : text("copy") }}</button>
                </div>
                <pre><code><span v-for="(line, index) in codeLines" :key="index"><i>{{ index + 1 }}</i>{{ line }}
</span></code></pre>
              </div>
            </div>
          </section>
          <div class="api-guide">
            <h2>{{ text("devGuideTitle") }}</h2><p>{{ text("devGuideLead") }}</p>
            <a class="button primary" :href="hubPlaygroundHref">{{ hubPlaygroundLabel }}</a>
            <a class="button" :href="hubKeysHref">{{ hubKeyLabel }}</a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
