<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  url: { type: String, default: "" },
  name: { type: String, default: "" },
  large: { type: Boolean, default: false },
});
const failed = ref(false);
watch(() => props.url, () => { failed.value = false; });
</script>

<template>
  <span class="model-logo" :class="{ large }">
    <img v-if="url && !failed" :src="url" :alt="`${name} logo`" @error="failed = true" />
    <span v-else :aria-label="name">{{ name.slice(0, 1) }}</span>
  </span>
</template>
