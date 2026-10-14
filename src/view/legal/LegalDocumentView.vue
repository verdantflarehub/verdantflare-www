<script setup>
import { computed, watch } from "vue";
import { legalDocuments } from "./legalDocuments";

const props = defineProps({
  document: { type: String, required: true },
  locale: { type: String, default: "zh" },
});

const content = computed(() => legalDocuments[props.document] || legalDocuments.terms);
const otherDocument = computed(() => props.document === "privacy"
  ? { href: "/terms", label: "服务条款" }
  : { href: "/privacy", label: "隐私政策" });

watch([content, () => props.locale], ([legalContent]) => {
  document.title = `${legalContent.title} | VerdantFlare`;
  document.documentElement.lang = "zh-CN";
}, { immediate: true });
</script>

<template>
  <main class="legal-document-page">
    <div class="legal-document-shell">
      <div class="legal-document-topline">
        <a href="/" class="legal-back">← 返回首页</a>
        <span>VF · Legal</span>
      </div>
      <header class="legal-document-header">
        <p class="legal-eyebrow">公开协议</p>
        <h1>{{ content.title }}</h1>
        <p>{{ content.introduction }}</p>
        <div class="legal-meta">
          <span>版本 {{ content.version }}</span>
          <span>生效日期 {{ content.effectiveDate }}</span>
          <span v-if="locale === 'en'">当前仅提供中文版本</span>
        </div>
      </header>
      <nav class="legal-document-index" aria-label="章节导航">
        <a v-for="(section, index) in content.sections" :key="section.title" :href="`#legal-section-${index + 1}`">{{ section.title }}</a>
      </nav>
      <article class="legal-document-body">
        <section v-for="(section, index) in content.sections" :id="`legal-section-${index + 1}`" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
        </section>
      </article>
      <div class="legal-document-end">
        <a :href="otherDocument.href">阅读{{ otherDocument.label }} →</a>
        <a href="mailto:hello@verdantflarehub.com">联系我们 →</a>
      </div>
    </div>
  </main>
</template>
