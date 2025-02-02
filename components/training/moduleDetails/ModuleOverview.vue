<!-- src/components/training/moduleDetails/ModuleOverview.vue -->
<template>
    <v-card flat>
      <v-card-title>Overview</v-card-title>
      <v-card-text>
        <h2>{{ module.title }}</h2>
        <p>{{ module.description }}</p>
  
        <!-- Main Content (e.g., Video or Resource) -->
        <div v-if="module.contentUrl" class="mt-4">
          <video v-if="isVideo(module.contentUrl)" controls style="width: 100%;">
            <source :src="module.contentUrl" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <iframe
            v-else
            :src="module.contentUrl"
            width="100%"
            height="500px"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import type { TrainingModule } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    module: TrainingModule | undefined;
  }>();
  
  // Check if the content URL is a video
  const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/.test(url);
  };
  </script>
  
  <style scoped>
  /* Optional: Add styles for the overview */
  </style>
  