<script setup type="ts">
const props = defineProps({
  item: { type: Function, required: true },
  level: { type: Number, required: true },
});
</script>

<template>
  <template v-if="level > 0">
    <component :is="item" size="15" fill="currentColor" stroke-width="1.5" class="iconClass"></component>
  </template>
  <template v-else>
    <component :is="item" size="20" stroke-width="1.5" class="iconClass"></component>
  </template>
</template>
