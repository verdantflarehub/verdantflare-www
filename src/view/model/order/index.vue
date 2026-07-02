<script setup>
const orderPlans = [
  {
    name: "Starter",
    title: "个人试用",
    credits: "100 万积分",
    price: "¥ 99",
    text: "适合测试模型调用、验证 API 接入和小批量内容生成。",
    items: ["下单前确认有效期", "基础 API 接入说明", "适合个人和轻量项目"],
  },
  {
    name: "Team",
    title: "团队调用",
    credits: "800 万积分",
    price: "¥ 699",
    text: "适合内容团队、Agent 产品和周期性批量调用。",
    items: ["额度和并发预确认", "可协助配置模型路由", "保留订单与交付记录"],
  },
  {
    name: "Custom",
    title: "企业需求",
    credits: "定制额度",
    price: "联系报价",
    text: "适合大额采购、长期额度、专属模型或稳定性要求更高的场景。",
    items: ["先确认库存和交付周期", "约定售后边界", "支持企业采购沟通"],
  },
];
</script>

<template>
  <main class="market-page model-order-page">
    <section class="market-hero order-hero" aria-labelledby="order-title">
      <div class="market-wrap">
        <a class="market-back" href="/#market">返回模型市场</a>
        <p class="market-kicker">Model Order</p>
        <h1 id="order-title">模型订单</h1>
        <p>
          选择积分套餐前请先确认模型范围、额度有效期、调用方式和售后边界。大额需求建议先联系客服确认库存和交付周期。
        </p>
      </div>
    </section>

    <section class="market-section">
      <div class="market-wrap">
        <div class="order-grid">
          <article v-for="plan in orderPlans" :key="plan.name" class="order-card">
            <small>{{ plan.name }}</small>
            <h2>{{ plan.title }}</h2>
            <strong>{{ plan.credits }}</strong>
            <p>{{ plan.text }}</p>
            <ul>
              <li v-for="item in plan.items" :key="item">{{ item }}</li>
            </ul>
            <a class="button primary" href="mailto:hello@verdantflarehub.com">
              {{ plan.price }}
            </a>
          </article>
        </div>

        <div class="order-note">
          <div>
            <h2>订单确认信息</h2>
            <p>
              请在下单前说明预计调用模型、月用量、是否需要视频生成、是否接入生产环境，以及期望交付时间。
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
