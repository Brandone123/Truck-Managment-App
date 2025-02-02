<!-- src/components/training/courseManagement/CourseOverview.vue -->

<template>
  <v-card>
    <v-card-title>Overview</v-card-title>
    <v-card-text>
      <div><strong>ID:</strong> {{ course.id }}</div>
      <div><strong>Name:</strong> {{ course.name }}</div>
      <div><strong>Description:</strong> {{ course.description }}</div>
      <div><strong>Active:</strong> {{ course.active ? 'Yes' : 'No' }}</div>
      <!-- Additional course metadata as needed -->
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Course } from '@/types/training/course';
import { defineProps } from 'vue';

const props = defineProps<{
  course: Course | undefined;
}>();
</script>

<style scoped>
/* Add any necessary styles */
</style>
