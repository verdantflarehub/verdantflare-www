const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const hubBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_HUB_URL || "https://hub.verdantflarehub.com"
);
const loginUrl = import.meta.env.VITE_LOGIN_URL || "https://login.verdantflarehub.com/sign-in";

export const hubHref = (path, params = {}) => {
  const url = new URL(path, `${hubBaseUrl}/`);
  Object.entries({ source: "www", ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

export const loginHref = (entry) => {
  const url = new URL(loginUrl);
  const returnTo = new URL(hubHref("/", { entry }));
  url.searchParams.set("return_to", `${returnTo.pathname}${returnTo.search}`);
  return url.toString();
};
