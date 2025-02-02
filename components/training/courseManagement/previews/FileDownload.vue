<!-- src/components/training/courseManagement/previews/FileDownload.vue -->

<template>
    <div class="text-center">
      <v-icon size="64" color="grey">mdi-file</v-icon>
      <p>No preview available for this file type.</p>
      <v-btn :href="file.url" target="_blank" color="primary">
        Download
      </v-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ModuleFile } from '@/types/training/trainingModule';
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    file: ModuleFile;
  }>();
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  