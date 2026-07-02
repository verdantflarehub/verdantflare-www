<script setup>
import { computed } from "vue";
import { tMarket } from "../i18n";

const props = defineProps({
  locale: {
    type: String,
    default: "zh",
  },
});

const orderPlans = [
  {
    name: "Starter",
    title: { zh: "个人试用", en: "Personal Trial" },
    credits: { zh: "100 万积分", en: "1M credits" },
    price: "¥ 99",
    text: {
      zh: "适合测试模型调用、验证 API 接入和小批量内容生成。",
      en: "For testing model calls, validating API integration, and small-batch content generation.",
    },
    items: [
      { zh: "下单前确认有效期", en: "Confirm validity before ordering" },
      { zh: "基础 API 接入说明", en: "Basic API integration notes" },
      { zh: "适合个人和轻量项目", en: "For individuals and lightweight projects" },
    ],
  },
  {
    name: "Team",
    title: { zh: "团队调用", en: "Team Calls" },
    credits: { zh: "800 万积分", en: "8M credits" },
    price: "¥ 699",
    text: {
      zh: "适合内容团队、Agent 产品和周期性批量调用。",
      en: "For content teams, Agent products, and recurring batch calls.",
    },
    items: [
      { zh: "额度和并发预确认", en: "Pre-confirm credits and concurrency" },
      { zh: "可协助配置模型路由", en: "Model routing setup support" },
      { zh: "保留订单与交付记录", en: "Order and delivery records retained" },
    ],
  },
  {
    name: "Custom",
    title: { zh: "企业需求", en: "Enterprise Needs" },
    credits: { zh: "定制额度", en: "Custom credits" },
    price: { zh: "联系报价", en: "Contact for Quote" },
    text: {
      zh: "适合大额采购、长期额度、专属模型或稳定性要求更高的场景。",
      en: "For large purchases, long-term credits, dedicated models, or higher stability requirements.",
    },
    items: [
      { zh: "先确认库存和交付周期", en: "Confirm availability and delivery timing first" },
      { zh: "约定售后边界", en: "Agree on support boundaries" },
      { zh: "支持企业采购沟通", en: "Enterprise purchasing support" },
    ],
  },
];

const text = computed(() => (key) => tMarket(props.locale, key));
const getLabel = (label) => label?.[props.locale] || label?.zh || label;
</script>

<template>
  <main class="market-page model-order-page">
    <section class="market-hero order-hero" aria-labelledby="order-title">
      <div class="market-wrap">
        <a class="market-back" href="/#market">{{ text("backToMarket") }}</a>
        <p class="market-kicker">{{ text("orderKicker") }}</p>
        <h1 id="order-title">{{ text("orderTitle") }}</h1>
        <p>
          {{ text("orderLead") }}
        </p>
      </div>
    </section>

    <section class="market-section">
      <div class="market-wrap">
        <div class="order-grid">
          <article v-for="plan in orderPlans" :key="plan.name" class="order-card">
            <small>{{ plan.name }}</small>
            <h2>{{ getLabel(plan.title) }}</h2>
            <strong>{{ getLabel(plan.credits) }}</strong>
            <p>{{ getLabel(plan.text) }}</p>
            <ul>
              <li v-for="item in plan.items" :key="getLabel(item)">
                {{ getLabel(item) }}
              </li>
            </ul>
            <a class="button primary" href="mailto:hello@verdantflarehub.com">
              {{ getLabel(plan.price) }}
            </a>
          </article>
        </div>

        <div class="order-note">
          <div>
            <h2>{{ text("orderConfirmTitle") }}</h2>
            <p>
              {{ text("orderConfirmLead") }}
            </p>
          </div>
          <a class="button" href="mailto:hello@verdantflarehub.com">
            hello@verdantflarehub.com
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
