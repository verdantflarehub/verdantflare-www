<script setup>
const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const navItems = [
  { href: "#seedance", label: "Seedance" },
  { href: "#scenes", label: "使用场景" },
  { href: "#flow", label: "交付流程" },
  { href: "#faq", label: "FAQ" },
];

const heroMeta = [
  { title: "首期接入", text: "Seedance 视频生成" },
  { title: "交付方式", text: "下单前人工确认" },
  { title: "服务对象", text: "创作者、团队、开发者" },
  { title: "大额需求", text: "先确认库存和有效期" },
];

const storyLines = [
  {
    label: "Prompt",
    text: "一支 8 秒产品广告片，清晨自然光，玻璃杯中冰块缓慢落下。",
  },
  {
    label: "Frame",
    text: "close-up / slow motion / product reveal / soft morning light",
  },
  {
    label: "Delivery",
    text: "Seedance 套餐咨询，额度和交付方式下单前确认。",
  },
];

const seedanceItems = [
  {
    title: "额度咨询",
    text: "下单前确认套餐内容、额度、有效期和交付方式，避免购买后才发现限制。",
  },
  {
    title: "交付协助",
    text: "按确认后的订单提供账号、凭证、额度说明或对应使用方式，保留交付记录。",
  },
  {
    title: "使用建议",
    text: "提供基础提示词、场景拆解和生成注意事项，帮助用户更快完成第一批视频测试。",
  },
];

const scenes = [
  {
    index: "01 / Script",
    title: "短视频脚本成片",
    text: "把脚本、分镜或镜头描述转成视频素材，用于内容前期验证。",
    image: "usecase-script-video.webp",
    alt: "短视频脚本成片创作者工作室",
  },
  {
    index: "02 / Ad",
    title: "广告创意测试",
    text: "快速生成多版视觉方向，用于投放素材、产品卖点和品牌短片预览。",
    image: "usecase-ad-storyboard.webp",
    alt: "广告创意测试分镜工作台",
  },
  {
    index: "03 / Product",
    title: "电商产品展示",
    text: "围绕商品图、卖点和场景描述生成动态素材，提高内容迭代速度。",
    image: "usecase-ecommerce.webp",
    alt: "电商产品展示视频静帧",
  },
  {
    index: "04 / Previz",
    title: "故事板与分镜预演",
    text: "为导演、设计师和创意团队提供低成本的视频预览。",
    image: "usecase-previz-room.webp",
    alt: "故事板与分镜预演空间",
  },
];

const packages = [
  {
    label: "Starter",
    title: "创作者试用",
    text: "适合个人测试和小批量生成，重点是快速跑通第一批素材。",
    features: ["小额额度咨询", "下单前确认有效期", "基础使用说明"],
    cta: "咨询",
  },
  {
    label: "Team",
    title: "内容团队",
    text: "适合短视频账号、广告素材和批量试错，先确认库存和交付周期。",
    features: ["中等额度需求", "批量需求确认", "交付记录说明"],
    cta: "获取报价",
  },
  {
    label: "Custom",
    title: "定制需求",
    text: "适合长期使用、大额额度或特殊交付方式，单独约定售后规则。",
    features: ["先确认库存", "约定交付方式", "明确售后边界"],
    cta: "联系客服",
  },
];

const flowSteps = [
  {
    step: "01",
    title: "提交需求",
    text: "说明使用量、用途、交付时间和是否批量采购。",
  },
  {
    step: "02",
    title: "人工确认",
    text: "确认额度、有效期、交付方式和售后边界。",
  },
  {
    step: "03",
    title: "完成付款",
    text: "按确认后的套餐付款，并保留订单记录。",
  },
  {
    step: "04",
    title: "交付使用",
    text: "提供调用凭证、账号/额度说明或对应使用方式。",
  },
  {
    step: "05",
    title: "售后协助",
    text: "遇到不可用或交付异常，按订单规则协商处理。",
  },
];

const rules = [
  {
    label: "套餐内容",
    text: "以下单前确认的信息为准，页面文案不替代最终订单约定。",
  },
  {
    label: "有效期",
    text: "不同额度和交付方式可能有不同有效期，需要提前说明。",
  },
  {
    label: "大额采购",
    text: "不建议直接下单，先确认库存、交付周期和稳定性。",
  },
  {
    label: "合规用途",
    text: "不支持违法、侵权或违反平台规则的用途。",
  },
];

const faqs = [
  {
    question: "青焰Hub 现在主要提供什么？",
    answer:
      "第一阶段主要提供 Seedance 视频生成相关的额度咨询、套餐交付和使用协助。",
  },
  {
    question: "下单后多久交付？",
    answer: "以客服下单前确认为准。不同套餐、库存和交付方式会影响交付时间。",
  },
  {
    question: "是否可以直接写价格？",
    answer:
      "如果套餐和库存稳定，可以写固定价格；如果还在早期，建议先用咨询套餐和获取报价。",
  },
  {
    question: "Seedance 额度是否永久有效？",
    answer: "不建议承诺永久有效。有效期、限制和售后规则应以下单前确认为准。",
  },
  {
    question: "是否是官方授权？",
    answer: "没有明确授权证明时，不要写官方授权。可以写第三方额度与交付服务。",
  },
  {
    question: "后续会支持 LTX 和 vLLM 吗？",
    answer:
      "可以作为路线图展示，但第一版首页重点仍然是 Seedance。vLLM 应表述为推理服务能力。",
  },
];
</script>

<template>
  <header class="site-header">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="#top" aria-label="青焰Hub 首页">
        <i class="brand-mark" aria-hidden="true"></i>
        <span>青焰Hub</span>
      </a>
      <div class="nav-links" aria-label="页面导航">
        <a v-for="item in navItems" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </div>
      <a class="nav-cta" href="#contact">联系购买</a>
    </nav>
  </header>

  <main id="top">
    <section
      class="hero"
      aria-labelledby="hero-title"
      :style="{ '--hero-image': `url('${assetPath('hero-glass-ad.webp')}')` }"
    >
      <div class="hero-inner">
        <div>
          <p class="eyebrow">www.verdantflarehub.com</p>
          <h1 id="hero-title">青焰Hub <span>Seedance 视频生成</span></h1>
          <p class="hero-copy">
            面向短视频创作者、内容团队和开发者，提供 Seedance
            额度咨询、套餐交付与使用协助。大额需求可先确认库存、有效期与交付方式。
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#contact">咨询 Seedance 套餐</a>
            <a class="button" href="#flow">了解交付流程</a>
          </div>
          <div class="hero-meta" aria-label="服务摘要">
            <div v-for="item in heroMeta" :key="item.title">
              <strong>{{ item.title }}</strong>
              {{ item.text }}
            </div>
          </div>
        </div>

        <div class="storyboard" aria-label="视频创作流程示例">
          <div v-for="line in storyLines" :key="line.label" class="story-line">
            <b>{{ line.label }}</b>
            <span>{{ line.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="seedance" class="section dark">
      <div class="wrap">
        <p class="section-kicker">Seedance Service</p>
        <h2 class="section-title">先把 Seedance 视频生成交付做好。</h2>
        <p class="section-lead">
          第一阶段不做复杂平台包装，只聚焦 Seedance
          视频生成相关服务：额度咨询、套餐确认、交付说明和基础使用协助。
        </p>

        <div class="intro-grid">
          <figure class="feature-image">
            <img
              :src="assetPath('usecase-ad-storyboard.webp')"
              alt="广告分镜和创意测试的工作台画面"
              loading="lazy"
            />
          </figure>
          <div class="plain-list">
            <article
              v-for="item in seedanceItems"
              :key="item.title"
              class="plain-item"
            >
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="scenes" class="section light">
      <div class="wrap">
        <p class="section-kicker">Use Cases</p>
        <h2 class="section-title">让首页展示视频结果，而不是堆概念词。</h2>
        <p class="section-lead">
          Seedance
          的转化重点在“我可以拿它做什么”。样片区优先展示短视频、广告、电商和分镜预演四类高频场景。
        </p>

        <div class="gallery" aria-label="使用场景样片">
          <article v-for="scene in scenes" :key="scene.title" class="scene">
            <img
              :src="assetPath(scene.image)"
              :alt="scene.alt"
              loading="lazy"
            />
            <div class="scene-copy">
              <span>{{ scene.index }}</span>
              <h3>{{ scene.title }}</h3>
              <p>{{ scene.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section light" aria-labelledby="packages-title">
      <div class="wrap">
        <p class="section-kicker">Packages</p>
        <h2 id="packages-title" class="section-title">
          先用咨询型套餐上线，等交付稳定后再公开价格。
        </h2>
        <p class="section-lead">
          第一版不需要复杂价格表。把适用人群、额度范围和交付规则讲清楚，比展示一堆数字更可信。
        </p>

        <div class="packages">
          <article v-for="item in packages" :key="item.label" class="package">
            <small>{{ item.label }}</small>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
            <ul>
              <li v-for="feature in item.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
            <a href="#contact">{{ item.cta }}</a>
          </article>
        </div>
      </div>
    </section>

    <section id="flow" class="section dark">
      <div class="wrap">
        <p class="section-kicker">Workflow</p>
        <h2 class="section-title">交付流程要比视觉更清楚。</h2>
        <p class="section-lead">
          早期项目最重要的是降低沟通成本。用户下单前就应该知道额度、有效期、交付方式和售后边界。
        </p>

        <div class="flow">
          <article v-for="step in flowSteps" :key="step.step" class="flow-step">
            <span>{{ step.step }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section light" aria-labelledby="trust-title">
      <div class="wrap">
        <p class="section-kicker">Rules</p>
        <h2 id="trust-title" class="section-title">
          下单前说清楚，比上线后讲故事更重要。
        </h2>
        <div class="trust">
          <p class="section-lead">
            所有套餐以下单前确认的信息为准，包括额度、有效期、交付方式、可用范围和售后规则。大额采购、长期使用或企业需求，请先联系客服确认库存与稳定性。
          </p>
          <div class="rules">
            <div v-for="rule in rules" :key="rule.label" class="rule">
              <b>{{ rule.label }}</b>
              <span>{{ rule.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="section dark">
      <div class="wrap">
        <p class="section-kicker">FAQ</p>
        <h2 class="section-title">常见问题</h2>
        <div class="faq">
          <article v-for="item in faqs" :key="item.question" class="faq-item">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-band">
      <div class="contact-inner">
        <div>
          <p class="section-kicker">Contact</p>
          <h2>先确认 Seedance 额度，再决定套餐。</h2>
          <p>
            上线第一版时，这里可以放微信、Telegram、邮箱或在线客服入口。大额需求建议先沟通用途、预计用量、交付时间和售后规则。
          </p>
        </div>
        <a class="button primary" href="mailto:hello@verdantflarehub.com">
          hello@verdantflarehub.com
        </a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>青焰Hub · www.verdantflarehub.com</span>
      <span>服务规则 / 隐私政策 / 售后说明 / 备案信息占位</span>
    </div>
  </footer>
</template>
