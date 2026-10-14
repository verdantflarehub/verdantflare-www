const DEFAULT_COUNT = 12;
const MAX_COUNT = 1000;
const CARD_PREFIX = "app-card-";

export const readAppListContext = (search = "") => {
  const query = new URLSearchParams(search);
  const count = Number(query.get("count"));
  return {
    search: query.get("q") || "",
    category: query.get("category") || "all",
    view: query.get("view") === "list" ? "list" : "grid",
    count: Number.isSafeInteger(count) ? Math.max(DEFAULT_COUNT, Math.min(MAX_COUNT, count)) : DEFAULT_COUNT,
  };
};

const listQuery = (context) => {
  const query = new URLSearchParams();
  if (context.search) query.set("q", context.search);
  if (context.category && context.category !== "all") query.set("category", context.category);
  if (context.view === "list") query.set("view", "list");
  if (context.count > DEFAULT_COUNT) query.set("count", String(Math.min(MAX_COUNT, context.count)));
  return query;
};

export const appCardId = (appId) => `${CARD_PREFIX}${appId}`;

export const appCardIdFromHash = (hash = "") => {
  try {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    return id.startsWith(CARD_PREFIX) && id.length > CARD_PREFIX.length ? id : "";
  } catch {
    return "";
  }
};

export const appListHref = (context, appId = "") => {
  const query = listQuery(context).toString();
  return `/apps${query ? `?${query}` : ""}${appId ? `#${encodeURIComponent(appCardId(appId))}` : ""}`;
};

export const appDetailHref = (appId, context) => {
  const query = listQuery(context);
  query.set("from", "apps");
  return `/apps/${encodeURIComponent(appId)}?${query}`;
};

export const appListReturnHref = (appId, search = "") => {
  if (new URLSearchParams(search).get("from") !== "apps") return "/apps";
  return appListHref(readAppListContext(search), appId);
};

export const isAppListLocation = (path, hash = "") => {
  const normalized = path.replace(/\/+$/, "") || "/";
  return ["/apps", "/app", "/view/app/list"].includes(normalized) || hash.replace(/^#\/?/, "").replace(/\/+$/, "") === "app-market";
};

export const appListContextForCatalog = (context, categories) => ({
  ...context,
  category: context.category === "all" || categories.includes(context.category) ? context.category : "all",
});
