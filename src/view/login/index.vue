<script setup>
import { computed, ref } from "vue";

const DEFAULT_PHONE = "18888888888";

const phone = ref(DEFAULT_PHONE);
const code = ref(DEFAULT_PHONE);
const submitted = ref(false);
const error = ref("");

const canSubmit = computed(() => phone.value.trim() && code.value.trim());

const submitLogin = () => {
  submitted.value = false;
  error.value = "";

  if (phone.value.trim() !== DEFAULT_PHONE || code.value.trim() !== DEFAULT_PHONE) {
    error.value = "手机号或验证码不正确";
    return;
  }

  localStorage.setItem(
    "verdantflare_user",
    JSON.stringify({ phone: DEFAULT_PHONE, loginAt: new Date().toISOString() })
  );
  submitted.value = true;
};
</script>

<template>
  <main class="login-page">
    <section class="login-shell" aria-labelledby="login-title">
      <div class="login-copy">
        <p class="market-kicker">Qingyan Account</p>
        <h1 id="login-title">手机号登录</h1>
        <p>
          登录后用于模型订单、积分购买和交付记录确认。当前测试账号为
          {{ DEFAULT_PHONE }}，验证码同手机号。
        </p>
      </div>

      <form class="login-card" @submit.prevent="submitLogin">
        <div class="login-card-head">
          <span>账号登录</span>
          <strong>青焰Hub</strong>
        </div>

        <label class="login-field">
          <span>手机号</span>
          <input
            v-model="phone"
            autocomplete="tel"
            inputmode="numeric"
            maxlength="11"
            placeholder="请输入手机号"
            type="tel"
          />
        </label>

        <label class="login-field">
          <span>验证码</span>
          <input
            v-model="code"
            autocomplete="one-time-code"
            inputmode="numeric"
            maxlength="11"
            placeholder="请输入验证码"
            type="text"
          />
        </label>

        <p v-if="error" class="login-message error" role="alert">{{ error }}</p>
        <p v-if="submitted" class="login-message success" role="status">
          登录成功，已记录当前账号。
        </p>

        <button class="button primary login-submit" type="submit" :disabled="!canSubmit">
          登录
        </button>
      </form>
    </section>
  </main>
</template>
