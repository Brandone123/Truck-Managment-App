<!-- src/components/training/courseManagement/previews/VideoPreview.vue -->

<template>
    <video controls :src="file.url" width="100%" height="600px">
      Your browser does not support the video tag.
    </video>
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
  