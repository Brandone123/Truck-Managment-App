<!-- src/components/training/planManagement/PlanOverview.vue -->

<template>
  <v-card>
    <v-card-title>Overview</v-card-title>
    <v-card-text>
      <div><strong>ID:</strong> {{ plan.id }}</div>
      <div><strong>Name:</strong> {{ plan.name }}</div>
      <div><strong>Description:</strong> {{ plan.description }}</div>
      <div><strong>Program ID:</strong> {{ plan.programId }}</div>
      <div><strong>Active:</strong> {{ plan.active ? 'Yes' : 'No' }}</div>
      <!-- Additional plan metadata as needed -->
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { TrainingPlan } from '@/types/training/trainingPlan';
import { defineProps } from 'vue';

const props = defineProps<{
  plan: TrainingPlan | undefined;
}>();
</script>

<style scoped>
/* Add any necessary styles */
</style>
