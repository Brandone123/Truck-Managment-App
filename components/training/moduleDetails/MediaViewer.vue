<!-- src/components/training/moduleDetails/MediaViewer.vue -->
<template>
    <div>
      <div v-if="media.type === 'image'">
        <v-img :src="media.url" alt="Image" contain></v-img>
      </div>
      <div v-else-if="media.type === 'video'">
        <video controls style="width: 100%;">
          <source :src="media.url" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div v-else-if="media.type === 'audio'">
        <audio controls style="width: 100%;">
          <source :src="media.url" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
      <div v-else-if="media.type === 'pdf'">
        <iframe :src="media.url" width="100%" height="500px"></iframe>
      </div>
      <div v-else>
        <v-icon color="red">mdi-alert-circle</v-icon>
        <span>Preview not available for this file type.</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { MultimediaAsset } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    media: MultimediaAsset;
  }>();
  </script>
  
  <style scoped>
  /* Optional: Add styles for media viewer */
  </style>
  