<template>
  <v-card flat>
    <v-card-title>Chapter Navigation</v-card-title>
    <v-card-text>
      <v-progress-linear color="success" height="15" :model-value="progress.percentage" striped>
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}% Completed</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
      <v-list dense>
        <v-list-item v-for="item in progress.details" :key="item.chapter" :value="item.chapter">
          <v-list-item-title>{{ item.chapter }}</v-list-item-title>
          <v-list-item-subtitle
            v-text="'Status: ' + (item.completed ? 'Completed' : 'In progress')"></v-list-item-subtitle>
          <template v-slot:prepend>
            <v-icon :color="item.completed ? 'green' : 'grey'">
              {{ item.completed ? 'mdi-check-circle' : 'mdi-timer-sand' }}
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ProgressDetail {
  chapter: string;
  completed: boolean;
}

interface Progress {
  percentage: number;
  details: ProgressDetail[];
}

const progress = ref<Progress>({
  percentage: 75, // This value would be dynamically calculated based on chapter completion
  details: [
    { chapter: 'Chapter 1: Introduction', completed: true },
    { chapter: 'Chapter 2: Advanced Concepts', completed: true },
    { chapter: 'Chapter 3: Practical Application', completed: false },
    // ... additional chapters
  ],
});
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>