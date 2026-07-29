const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const hubBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_HUB_URL || "https://hub.verdantflarehub.com"
);

const appIdAliases = {
  comfyui: "comfyui-studio",
  openwebui: "open-webui",
};

const modelIdAliases = {
  "verdantflare-dance-2": "verdantflare-sd2",
};

export const toHubAppId = (appId) => appIdAliases[appId] || appId;
export const toHubModelId = (modelId) => modelIdAliases[modelId] || modelId;

export const hubHref = (path, params = {}) => {
  const url = new URL(path, `${hubBaseUrl}/`);
  Object.entries({ source: "www", ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};
