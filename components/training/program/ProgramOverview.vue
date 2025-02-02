<!-- src/components/training/programs/ProgramOverview.vue -->

<template>
    <v-card>
      <v-card-title>Overview</v-card-title>
      <v-card-text>
        <div><strong>ID:</strong> {{ program.id }}</div>
        <div><strong>Name:</strong> {{ program.name }}</div>
        <div><strong>Description:</strong> {{ program.description }}</div>
        <div><strong>Target Audience:</strong> {{ program.targetAudience || 'N/A' }}</div>
        <div><strong>Estimated Completion Time:</strong> {{ program.completionTime }} hours</div>
        <div><strong>Active:</strong> {{ program.active ? 'Yes' : 'No' }}</div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import type { TrainingProgram } from '@/types/training/program';
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    program: TrainingProgram;
  }>();
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  