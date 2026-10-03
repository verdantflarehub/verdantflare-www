import { reactive } from "vue";
import { appCategories as allAppCategories, getCategoryLabel, tAppMarket } from "../view/app/data";

// No bundled catalog fallback: a failed request must not turn sample pricing
// or versions into apparent live business facts.
export const models = reactive([]);
export const marketApps = reactive([]);
export const modelCategories = reactive([]);
export const providers = reactive([]);
export const appCategories = reactive([...allAppCategories]);
export const catalogState = reactive({ loading: true, error: "" });

export const getModelById = (id) => models.find((item) => item.id === id);
export const getAppById = (id) => marketApps.find((item) => item.id === id);

export async function loadPublicCatalog() {
  catalogState.loading = true;
  catalogState.error = "";
  try {
    const response = await fetch("/api/control/public/catalog", { credentials: "omit" });
    if (!response.ok) throw new Error(`目录接口返回 ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.models) || !Array.isArray(catalog.apps)) throw new Error("目录响应格式不正确");
    models.splice(0, models.length, ...catalog.models.map((model) => ({
      ...model, categories: model.categories || [], inputPrice: model.inputPrice || "",
      outputPrice: model.outputPrice || "", cachePrice: model.cachePrice || "", accent: "",
    })));
    marketApps.splice(0, marketApps.length, ...catalog.apps.map((app) => ({
      ...app, developer: app.developer || "", description: app.description || app.summary || "",
      icon: app.iconUrl || "", stats: { memory: app.memory || "", disk: app.disk || "", cpu: app.cpu || "", gpu: app.gpu || "" },
    })));
    modelCategories.splice(0, modelCategories.length, ...new Set(models.flatMap((model) => model.categories)));
    providers.splice(0, providers.length, ...new Set(models.map((model) => model.provider)));
  } catch (error) {
    models.splice(0); marketApps.splice(0); modelCategories.splice(0); providers.splice(0);
    catalogState.error = error instanceof Error ? error.message : "公开目录加载失败";
  } finally {
    catalogState.loading = false;
  }
}

export { getCategoryLabel, tAppMarket };
