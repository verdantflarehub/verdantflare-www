import assert from "node:assert/strict";
import test from "node:test";
import { appCardId, appCardIdFromHash, appDetailHref, appListContextForCatalog, appListHref, appListReturnHref, isAppListLocation, readAppListContext } from "../src/catalog/appNavigation.js";

const context = { search: "图像 & video", category: "creative", view: "list", count: 28 };

test("public app list filters, view and expanded count survive a detail return link", () => {
  const detail = new URL(appDetailHref("comfyui", context), "https://www.example.test");
  assert.deepEqual(readAppListContext(detail.search), context);
  const back = new URL(appListReturnHref("comfyui", detail.search), detail.origin);
  assert.equal(back.pathname, "/apps");
  assert.deepEqual(readAppListContext(back.search), context);
  assert.equal(appCardIdFromHash(back.hash), appCardId("comfyui"));
});

test("direct app deep links return to the default public list", () => {
  assert.equal(appListReturnHref("comfyui"), "/apps");
  assert.equal(appListReturnHref("comfyui", "?q=ignored&returnTo=https://external.example"), "/apps");
  assert.equal(appListHref(readAppListContext()), "/apps");
});

test("return links only accept public list fields and cannot redirect elsewhere", () => {
  const back = appListReturnHref("demo", "?from=apps&q=test&returnTo=https://external.example&token=private");
  assert.equal(back, "/apps?q=test#app-card-demo");
});

test("query parsing works independently for repeated same-path history entries", () => {
  assert.deepEqual(readAppListContext("?q=first&category=creative&view=list&count=20"), { search: "first", category: "creative", view: "list", count: 20 });
  assert.deepEqual(readAppListContext("?q=second"), { search: "second", category: "all", view: "grid", count: 12 });
});

test("invalid view and count values fall back or clamp without affecting text filters", () => {
  for (const count of ["-3", "abc", "Infinity", "20.5"]) {
    assert.equal(readAppListContext(`?count=${count}`).count, 12);
  }
  assert.equal(readAppListContext("?count=100000000").count, 1000);
  assert.equal(readAppListContext("?view=unknown").view, "grid");
});

test("removed categories revert to all while valid public categories remain selected", () => {
  assert.deepEqual(appListContextForCatalog(context, ["creative"]), context);
  assert.deepEqual(appListContextForCatalog(context, ["tools"]), { ...context, category: "all" });
});

test("canonical and legacy list locations are recognized without rewriting app detail deep links", () => {
  for (const path of ["/apps", "/apps/", "/app", "/view/app/list"]) assert.equal(isAppListLocation(path), true);
  assert.equal(isAppListLocation("/", "#app-market"), true);
  assert.equal(isAppListLocation("/apps/comfyui", "#app-card-comfyui"), false);
  assert.equal(isAppListLocation("/", "#apps"), false);
});

test("card anchors and detail links encode identifiers and tolerate malformed fragments", () => {
  const id = "创作/demo #1";
  const list = new URL(appListHref(context, id), "https://www.example.test");
  assert.equal(appCardIdFromHash(list.hash), appCardId(id));
  assert.equal(new URL(appDetailHref(id, context), list.origin).pathname, `/apps/${encodeURIComponent(id)}`);
  assert.equal(appCardIdFromHash("#app-card-%ZZ"), "");
  assert.equal(appCardIdFromHash("#app-card-"), "");
  assert.equal(appCardIdFromHash("#apps"), "");
});
