<template>
  <v-overlay :model-value="modelValue" @update:model-value="updateModelValue" fullscreen persistent opacity="0.8">
    <v-btn variant="text" icon color="white" @click="close" style="position: absolute; top: 0; right: 30px;">
      <v-icon class="close">mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center justify-center" style="height: 100vh; width: 100vw">
      <video :src="url" controls autoplay style="max-width: 80%; max-height: 80%;"></video>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:url']);

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
/* Styles specific to this component */
</style>
