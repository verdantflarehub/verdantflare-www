<script setup>
import { computed } from "vue";
import { getAppById, getCategoryLabel, tAppMarket } from "../data";

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
const statItems = computed(() => [
  { label: text.value("developer"), value: app.value.developer, icon: "group" },
  { label: text.value("languageLabel"), value: app.value.language, unit: app.value.languageName },
  { label: text.value("memory"), value: app.value.stats.memory, unit: app.value.stats.memory === "-" ? "-" : "minimum" },
  { label: text.value("disk"), value: app.value.stats.disk, unit: app.value.stats.disk === "-" ? "-" : "storage" },
  { label: text.value("cpu"), value: app.value.stats.cpu, unit: app.value.stats.cpu === "-" ? "-" : "recommended" },
  { label: text.value("gpu"), value: app.value.stats.gpu, unit: app.value.stats.gpu === "-" ? "-" : "graphics" },
]);

const handleImageError = (event) => {
  event.currentTarget.remove();
};
</script>

<template>
  <main class="market-page app-detail-page">
    <section class="market-detail-hero app-detail-top">
      <div class="market-wrap">
      <a class="app-back" href="/#app-market">{{ text("back") }}</a>
      <div class="app-detail-identity">
        <span class="app-detail-icon">
          <i>{{ app.name.slice(0, 2) }}</i>
          <img
            v-if="app.icon"
            :src="app.icon"
            :alt="app.name"
            decoding="async"
            @error="handleImageError"
          />
        </span>
        <div>
          <h1>{{ app.name }}</h1>
          <p>{{ app.summary }}</p>
          <span>{{ app.developer }}</span>
        </div>
      </div>
      </div>
    </section>

    <section class="market-section app-detail-content">
      <div class="market-wrap">
        <div class="app-stat-row" aria-label="应用安装配置">
          <article v-for="item in statItems" :key="item.label">
            <span>{{ item.label }}</span>
            <b v-if="item.icon" class="material-like">{{ item.icon }}</b>
            <strong v-else>{{ item.value }}</strong>
            <em>{{ item.unit || item.value }}</em>
          </article>
        </div>

        <div class="app-detail-layout">
          <div class="app-detail-primary">
            <article class="app-info-panel">
              <h2>{{ text("about") }}</h2>
              <p>{{ app.description }}</p>
              <div class="app-detail-tags">
                <span>{{ getCategoryLabel(app.category, locale) }}</span>
                <span>{{ text("compatible") }}</span>
                <span>{{ app.source }}</span>
              </div>
            </article>

            <article class="app-info-panel">
              <h2>{{ text("screenshots") }}</h2>
              <div class="app-screenshot-grid">
                <figure v-for="image in app.screenshots" :key="image">
                  <img
                    :src="image"
                    :alt="`${app.name} screenshot`"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </figure>
              </div>
            </article>

            <article class="app-info-panel">
              <h2>{{ text("requiredPermissions") }}</h2>
              <div class="app-permission-list">
                <span v-for="permission in app.permissions" :key="permission">
                  {{ permission }}
                </span>
              </div>
            </article>
          </div>

          <aside class="app-install-panel">
            <button type="button">{{ text("get") }}</button>
            <dl>
              <div>
                <dt>{{ text("chartVersion") }}</dt>
                <dd>{{ app.version }}</dd>
              </div>
              <div>
                <dt>{{ text("versionHistory") }}</dt>
                <dd>
                  <a :href="`/#app-market/history/${app.id}`">{{ text("seeAllVersions") }}</a>
                </dd>
              </div>
              <div>
                <dt>{{ text("sourceCode") }}</dt>
                <dd>{{ text("public") }}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>
