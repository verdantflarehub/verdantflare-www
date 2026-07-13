<script setup>
import { computed } from "vue";
import { getAppById, tAppMarket } from "../data";

const props = defineProps({
  appId: {
    type: String,
    default: "ollama",
  },
  locale: {
    type: String,
    default: "zh",
  },
});

const app = computed(() => getAppById(props.appId));
const text = computed(() => (key) => tAppMarket(props.locale, key));

const handleImageError = (event) => {
  event.currentTarget.remove();
};
</script>

<template>
  <main class="market-page app-detail-page">
    <section class="market-detail-hero app-history-hero">
      <div class="market-wrap">
      <a class="app-back" :href="`/#app-market/detail/${app.id}`">{{ text("back") }}</a>
      <div class="app-history-title">
        <span class="app-icon-wrap">
          <i>{{ app.name.slice(0, 2) }}</i>
          <img
            v-if="app.icon"
            :src="app.icon"
            :alt="app.name"
            @error="handleImageError"
          />
        </span>
        <div>
          <h1>{{ app.name }} {{ text("versionHistoryTitle") }}</h1>
          <p>{{ text("chartVersion") }} {{ app.version }}</p>
        </div>
      </div>
      </div>
    </section>

    <section class="market-section app-history-content">
      <div class="market-wrap">
        <div class="app-version-panel">
          <div class="app-version-head">
            <span>{{ text("allVersions") }}</span>
            <span>{{ text("released") }}</span>
            <span>{{ text("changelog") }}</span>
          </div>
          <article
            v-for="(item, index) in app.versions"
            :key="item.version"
            class="app-version-row"
          >
            <span>
              <strong>{{ item.version }}</strong>
              <em v-if="index === 0">{{ text("current") }}</em>
            </span>
            <time>{{ item.date }}</time>
            <p>{{ item.notes }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
