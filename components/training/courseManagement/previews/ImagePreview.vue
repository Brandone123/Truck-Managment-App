<!-- src/components/training/courseManagement/previews/ImagePreview.vue -->

<template>
    <v-img :src="file.url" max-width="800" max-height="600" contain></v-img>
  </template>
  
  <script setup lang="ts">
  import type { ModuleFile } from '@/types/training/trainingModule';
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    file: ModuleFile;
  }>();
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  