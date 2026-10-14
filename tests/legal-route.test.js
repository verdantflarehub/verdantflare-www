import assert from "node:assert/strict";
import { test } from "node:test";
import { legalDocuments } from "../src/view/legal/legalDocuments.js";
import { resolveLegalRoute } from "../src/view/legal/legalRoute.js";

test("terms and privacy deep links resolve to distinct legal pages", () => {
  assert.deepEqual(resolveLegalRoute("/terms"), { name: "legal-document", document: "terms" });
  assert.deepEqual(resolveLegalRoute("/privacy"), { name: "legal-document", document: "privacy" });
  assert.equal(resolveLegalRoute("/"), null);
  assert.equal(resolveLegalRoute("/pricing"), null);
});

test("both published documents include usable content and contact", () => {
  for (const document of Object.values(legalDocuments)) {
    assert.equal(document.version, "1.0.0");
    assert.equal(document.effectiveDate, "2026-10-14");
    assert.ok(document.sections.length >= 5);
    assert.match(document.introduction, /hello@verdantflarehub\.com/);
  }
});
