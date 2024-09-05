<template>
    <v-card :class="`card-${color}`" class="text-center">
      <v-card-text>
        <v-card-title class="justify-space-between">
          <v-icon class="mr-2" :color="color">{{ icon }}</v-icon>
          <span>{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <span class="font-weight-bold text-h6">{{ value }}</span>
        </v-card-text>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: String,
    icon: String,
    value: Number,
    color: String,
  });
  </script>
  
  <style scoped>
  .card-primary {
    border-left: 8px solid #1976d2;
  }
  .card-green {
    border-left: 8px solid #424656;
  }
  .card-red {
    border-left: 8px solid #f44336;
  }
  </style>
  