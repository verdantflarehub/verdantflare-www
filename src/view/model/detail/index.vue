<script setup>
import { computed, ref } from "vue";
import { apiExamples, getModelById } from "../data";

const props = defineProps({
  modelId: {
    type: String,
    default: "deepseek-v4-pro",
  },
});

const model = computed(() => getModelById(props.modelId));
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

const expireOptions = [
  { value: "-1", label: "永不过期" },
  { value: "30", label: "30 天" },
  { value: "90", label: "90 天" },
  { value: "180", label: "180 天" },
  { value: "365", label: "365 天" },
];

const activeExample = computed(() =>
  apiExamples[activeCode.value].replace("deepseek-v4-pro", model.value.id)
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
    throw new Error(payload?.message || `请求失败 (${response.status})`);
  }

  return payload;
};

const padTimeUnit = (value) => String(value).padStart(2, "0");

const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp < 0) {
    return "永久";
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
    keyMessage.value = "请填写 1-20 个字符的 API-KEY 名称。";
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
      throw new Error("API-KEY 已创建，但未能在列表中定位到新密钥");
    }

    const keyPayload = await requestApi(`/api/token/${createdToken.id}/key`, {
      method: "POST",
    });
    const rawKey = keyPayload?.data?.key;

    if (!rawKey) {
      throw new Error("API-KEY 已创建，但获取密钥内容失败");
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
    keyMessage.value = "API-KEY 已创建，请立即复制并妥善保存。";
    keyMessageType.value = "success";
    showCreateKeyModal.value = false;
  } catch (error) {
    keyMessage.value =
      error?.message || "创建 API-KEY 失败，请确认已登录后重试。";
    keyMessageType.value = "error";
  } finally {
    creatingKey.value = false;
  }
};

const copyApiKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key);
    keyMessage.value = "API-KEY 已复制。";
    keyMessageType.value = "success";
  } catch {
    keyMessage.value = "复制失败，请手动选中 API-KEY 复制。";
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
</script>

<template>
  <main class="market-page model-detail-page">
    <section class="market-detail-hero">
      <div class="market-wrap">
        <a class="market-back" href="/view/model/list">返回模型市场</a>
        <div class="model-detail-head">
          <div :class="['model-logo large', model.accent]">
            {{ model.name.slice(0, 1) }}
          </div>
          <div>
            <div class="detail-title-row">
              <h1>{{ model.name }}</h1>
              <span>{{ model.categories[0] }}</span>
              <time>发布于 {{ model.date }}</time>
            </div>
            <p>{{ model.summary }}</p>
            <div class="detail-actions">
              <a class="button primary" href="#api-call">API 调用</a>
              <a class="button" href="/view/model/order">购买积分</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="market-section detail-content">
      <div class="market-wrap">
        <div class="detail-block">
          <h2>模型价格</h2>
          <div class="pricing-table" role="table" aria-label="模型价格">
            <div class="pricing-row heading" role="row">
              <span>计费选项</span>
              <span>积分/百万tokens</span>
              <span>¥/百万tokens</span>
            </div>
            <div class="pricing-row" role="row">
              <span>输入 token</span>
              <strong>{{ model.inputPrice }}</strong>
              <span>{{ Math.round(model.inputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>输出 token</span>
              <strong>{{ model.outputPrice }}</strong>
              <span>{{ Math.round(model.outputPrice / 1000) }}</span>
            </div>
            <div class="pricing-row" role="row">
              <span>缓存命中</span>
              <strong>{{ model.cachePrice }}</strong>
              <span>{{ Math.round(model.cachePrice / 1000) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-tabs" aria-label="模型详情切换">
          <button
            :class="{ active: activePanel === 'intro' }"
            type="button"
            @click="activePanel = 'intro'"
          >
            模型介绍
          </button>
          <button
            :class="{ active: activePanel === 'api' }"
            type="button"
            @click="activePanel = 'api'"
          >
            API 调用
          </button>
        </div>

        <div v-if="activePanel === 'intro'" class="model-intro-grid">
          <section class="detail-panel">
            <h2>模型限制</h2>
            <div class="spec-grid">
              <div>
                <span>上下文长度</span>
                <strong>{{ model.context }}</strong>
              </div>
              <div>
                <span>最大输入 Token 数</span>
                <strong>{{ model.maxInput }}</strong>
              </div>
              <div>
                <span>最大输出 Token 数</span>
                <strong>{{ model.maxOutput }}</strong>
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
            <h2>模型能力</h2>
            <div class="capability-list">
              <span v-for="tag in model.tags" :key="tag">{{ tag }}</span>
              <span>cache 缓存</span>
              <span>结构化输出</span>
            </div>
          </section>

          <section class="detail-panel wide">
            <h2>介绍</h2>
            <p>
              {{ model.name }} 通过青焰统一网关提供接入，适合在内容生产、Agent
              编排、文档理解、视频前期策划和企业自动化场景中使用。实际可用额度、稳定性、有效期和售后边界以下单前确认为准。
            </p>
          </section>
        </div>

        <div v-else id="api-call" class="api-call-panel">
          <div class="api-call-head">
            <div>
              <h2>方式一：通过对话调用模型</h2>
              <p>
                可在多种 Agent 产品中调用，也可以使用兼容 OpenAI 的
                Chat Completions 接口接入。
              </p>
            </div>
            <a href="#api-guide">调用指南</a>
          </div>

          <div class="api-steps">
            <section class="api-step">
              <span class="step-index">1</span>
              <div class="api-step-content">
                <h3>选择 API-KEY</h3>
                <p>
                  API-KEY 是访问青焰 Hub 服务的重要凭证，长期有效。请妥善保管并定期更换密钥，避免公开共享。
                </p>
                <div class="key-table">
                  <div class="key-row heading">
                    <span>我的 API-KEY</span>
                    <span>名称</span>
                    <span>创建时间</span>
                    <span>过期时间</span>
                    <span>开启/禁用</span>
                    <span>操作</span>
                  </div>
                  <div v-if="apiKeys.length === 0" class="key-row empty">
                    <span>暂无 API-KEY</span>
                  </div>
                  <div v-for="item in apiKeys" :key="item.id" class="key-row">
                    <span class="key-value">{{ item.key }}</span>
                    <span>{{ item.name }}</span>
                    <span>{{ item.createdTime }}</span>
                    <span>{{ item.expiredTime }}</span>
                    <span>{{ item.enabled ? "开启" : "禁用" }}</span>
                    <span>
                      <button
                        class="key-copy"
                        type="button"
                        @click="copyApiKey(item.key)"
                      >
                        复制
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
                  {{ creatingKey ? "创建中..." : "新建 API-KEY" }}
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
                <h3>复制以下调用示例，发送给任意 AI 助手</h3>
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
                      {{ copied ? "已复制" : "复制" }}
                    </button>
                  </div>
                  <pre><code><span v-for="(line, index) in codeLines" :key="index"><i>{{ index + 1 }}</i>{{ line }}
</span></code></pre>
                </div>
              </div>
            </section>
          </div>

          <div id="api-guide" class="api-guide">
            <h2>方式二：在开发工具中接入使用</h2>
            <p>按照官方文档完成对接配置，或把上方示例复制到现有服务中调整。</p>
            <a class="button" href="/view/model/order">查看官方文档</a>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showCreateKeyModal" class="modal-backdrop" @click.self="closeCreateKeyModal">
      <section class="create-key-modal" role="dialog" aria-modal="true" aria-labelledby="create-key-title">
        <header class="modal-head">
          <h2 id="create-key-title">创建API-KEY</h2>
          <button class="modal-close" type="button" aria-label="关闭" @click="closeCreateKeyModal">
            ×
          </button>
        </header>

        <div class="create-tip">
          <strong>ⓘ 创建提示</strong>
          <ol>
            <li>请勿泄露API-KEY，服务基于API-KEY计费，计费规则详见资源详情；</li>
            <li>如有特殊需求（临时使用、定期重置等），可创建多个API-KEY分别管理；</li>
            <li>如API-KEY泄露，请重置API-KEY或删除服务。</li>
          </ol>
        </div>

        <label class="modal-field">
          <span>API-KEY名称<i>*</i></span>
          <div class="modal-input-wrap">
            <input
              v-model="apiKeyName"
              maxlength="20"
              type="text"
              placeholder="填写一个简单清晰的名称，如：我的Agent工具"
              @keyup.enter="createApiKey"
            />
            <em>{{ trimmedApiKeyName.length }} / 20</em>
          </div>
        </label>

        <label class="modal-field">
          <span>过期时间</span>
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
            取消
          </button>
          <button class="modal-button primary" type="button" :disabled="creatingKey || !canSubmitApiKey" @click="createApiKey">
            {{ creatingKey ? "创建中..." : "确定" }}
          </button>
        </footer>
      </section>
    </div>
  </main>
</template>
