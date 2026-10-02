import {
  getApiExamples,
  modelCategories as allModelCategories,
  models as allModels,
  providers as allProviders,
} from "../view/model/data";
import {
  appCategories as allAppCategories,
  getCategoryLabel,
  marketApps as allMarketApps,
  tAppMarket,
} from "../view/app/data";

// WWW is a public surface. Only entries explicitly approved here may be rendered,
// even when internal or preview records are added to the source datasets later.
const publishedModelIds = new Set([
  "deepseek-v4-pro",
  "deepseek-v4-flash",
  "glm-5-1",
  "joyai-llm-flash",
  "verdantflare-dance-2",
  "glm-5-2",
  "kimi-k2-6",
  "kimi-k2-5",
  "minimax-m2-7",
  "glm-5",
  "deepseek-v3-2",
  "qwen3-6-27b",
  "qwen3-6-35b-a3b",
  "minimax-m2-5",
  "kling-video-o1",
  "kling-v2-master",
]);

const publishedAppIds = new Set([
  "ollama",
  "openwebui",
  "openclaw",
  "affine",
  "comfyui",
  "steamheadless",
  "n8n",
  "nocodb",
  "bytebase",
  "jellyfin",
  "vaultwarden",
  "coder",
  "langbot",
]);

export const models = Object.freeze(
  allModels.filter((model) => publishedModelIds.has(model.id)),
);

export const marketApps = Object.freeze(
  allMarketApps.filter((app) => publishedAppIds.has(app.id)),
);

export const modelCategories = Object.freeze(
  allModelCategories.filter((category) =>
    models.some((model) => model.categories.includes(category)),
  ),
);

export const providers = Object.freeze(
  allProviders.filter((provider) => models.some((model) => model.provider === provider)),
);

export const appCategories = Object.freeze(
  allAppCategories.filter(
    (category) =>
      category.id === "discover" || marketApps.some((app) => app.category === category.id),
  ),
);

export const getModelById = (id) =>
  models.find((model) => model.id === id) ?? models[0];

export const getAppById = (id) =>
  marketApps.find((app) => app.id === id) ?? marketApps[0];

export { getApiExamples, getCategoryLabel, tAppMarket };
