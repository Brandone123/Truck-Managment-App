<!-- src/components/training/courseManagement/previews/PdfPreview.vue -->

<template>
    <embed :src="file.url" type="application/pdf" width="100%" height="600px" />
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
  