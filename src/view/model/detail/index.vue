<script setup>
import { computed, ref } from "vue";
import { apiExamples, getModelById } from "../data";
import {
  tCategory,
  tMarket,
  tMaxValue,
  tModelName,
  tModelSummary,
  tTag,
} from "../i18n";

const props = defineProps({
  modelId: {
    type: String,
    default: "deepseek-v4-pro",
  },
  locale: {
    type: String,
    default: "zh",
  },
});

const model = computed(() => getModelById(props.modelId));
const text = computed(() => (key) => tMarket(props.locale, key));
const activePanel = ref("intro");
const activeCode = ref("curl");
const copied = ref(false);
const apiKeys = ref([]);
const creatingKey = ref(false);
const keyMessage = ref("");
const keyMessageType = ref("info");
const showCreateKeyModal = ref(false);
const apiKeyName = ref("");
const expirePreset = ref("-1");

const codeTabs = [
  { id: "curl", label: "curl" },
  { id: "python", label: "python" },
  { id: "openai", label: "openai" },
];

const expireOptions = computed(() => [
  { value: "-1", label: text.value("neverExpires") },
  { value: "30", label: `30 ${props.locale === "en" ? "days" : "天"}` },
  { value: "90", label: `90 ${props.locale === "en" ? "days" : "天"}` },
  { value: "180", label: `180 ${props.locale === "en" ? "days" : "天"}` },
  { value: "365", label: `365 ${props.locale === "en" ? "days" : "天"}` },
]);

const localizedApiExamples = computed(() => {
  if (props.locale !== "en") return apiExamples;

  return {
    curl: apiExamples.curl
      .replace("# 从环境变量获取 API 密钥", "# Read API key from environment")
      .replace(
        "请用三句话解释青焰模型市场的优势。",
        "Explain the advantages of the verdantflare model market in three sentences."
      ),
    python: apiExamples.python.replace(
      "请生成一个视频广告脚本。",
      "Generate a video ad script."
    ),
    openai: apiExamples.openai.replace(
      "写一个适合电商短片的提示词。",
      "Write a prompt for an ecommerce short video."
    ),
  };
});

const activeExample = computed(() =>
  localizedApiExamples.value[activeCode.value].replace(
    "deepseek-v4-pro",
    model.value.id
  )
);
const introText = computed(() =>
  text.value("introText").replace("{{name}}", tModelName(model.value, props.locale))
);

const codeLines = computed(() => activeExample.value.split("\n"));
const trimmedApiKeyName = computed(() => apiKeyName.value.trim());
const canSubmitApiKey = computed(
  () => trimmedApiKeyName.value.length > 0 && trimmedApiKeyName.value.length <= 20
);

const apiBase = import.meta.env.VITE_API_BASE_URL || "";

const requestApi = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message || `${text.value("requestFailed")} (${response.status})`
    );
  }

  return payload;
};

const padTimeUnit = (value) => String(value).padStart(2, "0");

const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp < 0) {
    return text.value("permanent");
  }

  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${padTimeUnit(date.getMonth() + 1)}-${padTimeUnit(
    date.getDate()
  )} ${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}`;
};

const getExpiredTimestamp = () => {
  if (expirePreset.value === "-1") {
    return -1;
  }

  const days = Number(expirePreset.value);
  if (!Number.isFinite(days) || days <= 0) {
    return -1;
  }

  return Math.ceil(Date.now() / 1000 + days * 24 * 60 * 60);
};

const openCreateKeyModal = () => {
  apiKeyName.value = "";
  expirePreset.value = "-1";
  keyMessage.value = "";
  keyMessageType.value = "info";
  showCreateKeyModal.value = true;
};

const closeCreateKeyModal = () => {
  if (creatingKey.value) {
    return;
  }
  showCreateKeyModal.value = false;
};

const createApiKey = async () => {
  if (creatingKey.value) {
    return;
  }

  if (!canSubmitApiKey.value) {
    keyMessage.value = text.value("keyNameError");
    keyMessageType.value = "error";
    return;
  }

  creatingKey.value = true;
  keyMessage.value = "";
  keyMessageType.value = "info";

  const tokenName = trimmedApiKeyName.value;

  try {
    await requestApi("/api/token/", {
      method: "POST",
      body: JSON.stringify({
        name: tokenName,
        remain_quota: 0,
        expired_time: getExpiredTimestamp(),
        unlimited_quota: true,
        model_limits_enabled: false,
        model_limits: "",
        allow_ips: "",
        group: "",
        cross_group_retry: false,
      }),
    });

    const listPayload = await requestApi("/api/token/?p=1&page_size=20");
    const createdToken = (listPayload?.data?.items || []).find(
      (item) => item.name === tokenName
    );

    if (!createdToken?.id) {
      throw new Error(text.value("keyCreatedMissing"));
    }

    const keyPayload = await requestApi(`/api/token/${createdToken.id}/key`, {
      method: "POST",
    });
    const rawKey = keyPayload?.data?.key;

    if (!rawKey) {
      throw new Error(text.value("keyFetchFailed"));
    }

    apiKeys.value = [
      {
        id: createdToken.id,
        key: rawKey.startsWith("sk-") ? rawKey : `sk-${rawKey}`,
        name: createdToken.name,
        createdTime: formatTimestamp(createdToken.created_time),
        expiredTime: formatTimestamp(createdToken.expired_time),
        enabled: createdToken.status === 1,
      },
      ...apiKeys.value,
    ];
    keyMessage.value = text.value("keyCreated");
    keyMessageType.value = "success";
    showCreateKeyModal.value = false;
  } catch (error) {
    keyMessage.value = error?.message || text.value("keyCreateFailed");
    keyMessageType.value = "error";
  } finally {
    creatingKey.value = false;
  }
};

const copyApiKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key);
    keyMessage.value = text.value("keyCopied");
    keyMessageType.value = "success";
  } catch {
    keyMessage.value = text.value("keyCopyFailed");
    keyMessageType.value = "error";
  }
};

const copyExample = async () => {
  try {
    await navigator.clipboard.writeText(activeExample.value);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
};

const showApiPanel = () => {
  activePanel.value = "api";
  requestAnimationFrame(() => {
    document
      .getElementById("api-call")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

const scrollToGuide = () => {
  document
    .getElementById("api-guide")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<template>
  <main class="market-page model-detail-page">
    <section class="market-detail-hero">
      <div class="market-wrap">
        <a class="market-back" href="/#market">{{ text("backToMarket") }}</a>
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
              <button class="button primary" type="button" @click="showApiPanel">
                {{ text("apiCall") }}
              </button>
              <a class="button" href="/#market/order">{{ text("buyCredits") }}</a>
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
              <span>{{ text("inputToken") }}</span>
              <strong>{{ model.inputPrice }}</strong>
              <span>{{ Math.round(model.inputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>{{ text("outputToken") }}</span>
              <strong>{{ model.outputPrice }}</strong>
              <span>{{ Math.round(model.outputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>{{ text("cacheHit") }}</span>
              <strong>{{ model.cachePrice }}</strong>
              <span>{{ Math.round(model.cachePrice / 1000) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-tabs" :aria-label="text('detailsTabs')">
          <button
            :class="{ active: activePanel === 'intro' }"
            type="button"
            @click="activePanel = 'intro'"
          >
            {{ text("introTab") }}
          </button>
          <button
            :class="{ active: activePanel === 'api' }"
            type="button"
            @click="activePanel = 'api'"
          >
            {{ text("apiCall") }}
          </button>
        </div>

        <div v-if="activePanel === 'intro'" class="model-intro-grid">
          <section class="detail-panel">
            <h2>{{ text("limits") }}</h2>
            <div class="spec-grid">
              <div>
                <span>{{ text("contextLength") }}</span>
                <strong>{{ model.context }}</strong>
              </div>
              <div>
                <span>{{ text("maxInput") }}</span>
                <strong>{{ tMaxValue(model.maxInput, locale) }}</strong>
              </div>
              <div>
                <span>{{ text("maxOutput") }}</span>
                <strong>{{ tMaxValue(model.maxOutput, locale) }}</strong>
              </div>
              <div>
                <span>TPM</span>
                <strong>1,000k</strong>
              </div>
              <div>
                <span>RPM</span>
                <strong>1k</strong>
              </div>
            </div>
          </section>

          <section class="detail-panel">
            <h2>{{ text("capabilities") }}</h2>
            <div class="capability-list">
              <span v-for="tag in model.tags" :key="tag">{{ tTag(tag, locale) }}</span>
              <span>{{ text("cache") }}</span>
              <span>{{ text("structuredOutput") }}</span>
            </div>
          </section>

          <section class="detail-panel wide">
            <h2>{{ text("intro") }}</h2>
            <p>{{ introText }}</p>
          </section>
        </div>

        <div v-else id="api-call" class="api-call-panel">
          <div class="api-call-head">
            <div>
              <h2>{{ text("chatCallTitle") }}</h2>
              <p>{{ text("chatCallLead") }}</p>
            </div>
            <button type="button" @click="scrollToGuide">{{ text("guide") }}</button>
          </div>

          <div class="api-steps">
            <section class="api-step">
              <span class="step-index">1</span>
              <div class="api-step-content">
                <h3>{{ text("chooseKey") }}</h3>
                <p>{{ text("keyLead") }}</p>
                <div class="key-table">
                  <div class="key-row heading">
                    <span>{{ text("myKey") }}</span>
                    <span>{{ text("name") }}</span>
                    <span>{{ text("createdAt") }}</span>
                    <span>{{ text("expiresAt") }}</span>
                    <span>{{ text("status") }}</span>
                    <span>{{ text("action") }}</span>
                  </div>
                  <div v-if="apiKeys.length === 0" class="key-row empty">
                    <span>{{ text("noKey") }}</span>
                  </div>
                  <div v-for="item in apiKeys" :key="item.id" class="key-row">
                    <span class="key-value">{{ item.key }}</span>
                    <span>{{ item.name }}</span>
                    <span>{{ item.createdTime }}</span>
                    <span>{{ item.expiredTime }}</span>
                    <span>{{ item.enabled ? text("enabled") : text("disabled") }}</span>
                    <span>
                      <button
                        class="key-copy"
                        type="button"
                        @click="copyApiKey(item.key)"
                      >
                        {{ text("copy") }}
                      </button>
                    </span>
                  </div>
                </div>
                <button
                  class="inline-action"
                  type="button"
                  :disabled="creatingKey"
                  @click="openCreateKeyModal"
                >
                  {{ creatingKey ? text("creating") : text("newKey") }}
                </button>
                <p
                  v-if="keyMessage"
                  :class="['key-message', keyMessageType]"
                  role="status"
                >
                  {{ keyMessage }}
                </p>
              </div>
            </section>

            <section class="api-step">
              <span class="step-index">2</span>
              <div class="api-step-content">
                <h3>{{ text("copyExampleTitle") }}</h3>
                <div class="code-card">
                  <div class="code-tabs">
                    <button
                      v-for="tab in codeTabs"
                      :key="tab.id"
                      :class="{ active: activeCode === tab.id }"
                      type="button"
                      @click="activeCode = tab.id"
                    >
                      {{ tab.label }}
                    </button>
                    <button class="copy-code" type="button" @click="copyExample">
                      {{ copied ? text("copied") : text("copy") }}
                    </button>
                  </div>
                  <pre><code><span v-for="(line, index) in codeLines" :key="index"><i>{{ index + 1 }}</i>{{ line }}
</span></code></pre>
                </div>
              </div>
            </section>
          </div>

          <div id="api-guide" class="api-guide">
            <h2>{{ text("devGuideTitle") }}</h2>
            <p>{{ text("devGuideLead") }}</p>
            <a class="button" href="/#market/order">{{ text("docs") }}</a>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showCreateKeyModal" class="modal-backdrop" @click.self="closeCreateKeyModal">
      <section class="create-key-modal" role="dialog" aria-modal="true" aria-labelledby="create-key-title">
        <header class="modal-head">
          <h2 id="create-key-title">{{ text("createKeyTitle") }}</h2>
          <button
            class="modal-close"
            type="button"
            :aria-label="text('close')"
            @click="closeCreateKeyModal"
          >
            ×
          </button>
        </header>

        <div class="create-tip">
          <strong>{{ text("createTip") }}</strong>
          <ol>
            <li v-for="item in text('createTipItems')" :key="item">{{ item }}</li>
          </ol>
        </div>

        <label class="modal-field">
          <span>{{ text("keyName") }}<i>*</i></span>
          <div class="modal-input-wrap">
            <input
              v-model="apiKeyName"
              maxlength="20"
              type="text"
              :placeholder="text('keyNamePlaceholder')"
              @keyup.enter="createApiKey"
            />
            <em>{{ trimmedApiKeyName.length }} / 20</em>
          </div>
        </label>

        <label class="modal-field">
          <span>{{ text("expireTime") }}</span>
          <select v-model="expirePreset">
            <option v-for="item in expireOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </label>

        <p v-if="keyMessage && keyMessageType === 'error'" class="modal-error" role="alert">
          {{ keyMessage }}
        </p>

        <footer class="modal-actions">
          <button class="modal-button secondary" type="button" :disabled="creatingKey" @click="closeCreateKeyModal">
            {{ text("cancel") }}
          </button>
          <button class="modal-button primary" type="button" :disabled="creatingKey || !canSubmitApiKey" @click="createApiKey">
            {{ creatingKey ? text("creating") : text("confirm") }}
          </button>
        </footer>
      </section>
    </div>
  </main>
</template>
