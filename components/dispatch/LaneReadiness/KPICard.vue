<script setup lang="ts">
import { VCard, VCardTitle, VCardText } from 'vuetify/components';

// Props for the KPI card
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});
</script>

<template>
  <v-card class="d-flex align-center" :color="color" dark>
    <v-card-title class="d-flex align-center">
      <v-icon large class="mr-3">{{ icon }}</v-icon>
      <div>
        <div class="text-h6">{{ title }}</div>
        <div class="text-h4">{{ value }}</div>
      </div>
    </v-card-title>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
