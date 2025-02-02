<!-- src/components/training/moduleDetails/UserProgressViewer.vue -->
<template>
    <v-card flat>
      <v-card-title>User Progress</v-card-title>
      <v-card-text>
        <v-progress-linear
          color="blue"
          height="20"
          :value="progress.percentage"
          striped
        >
          <template #default="{ value }">
            <strong>{{ Math.ceil(value) }}% Completed</strong>
          </template>
        </v-progress-linear>
  
        <v-list dense class="mt-4">
          <v-list-item
            v-for="chapter in chapters"
            :key="chapter.id"
          >
            <v-list-item-action>
              <v-icon :color="chapter.completed ? 'green' : 'grey'">
                {{ chapter.completed ? 'mdi-check-circle' : 'mdi-timer-sand' }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ chapter.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ chapter.completed ? 'Completed' : 'In Progress' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
  import type { ModuleChapter } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    moduleId: number;
  }>();
  
  const store = useTrainingModuleStore();
  
  // Get the module
  const module = computed(() => store.getModuleById(props.moduleId));
  
  // Get user progress
  const progress = computed(() => store.getUserProgress(props.moduleId));
  
  // Get chapters with completion status
  const chapters = computed(() => {
    if (!module.value?.chapters) return [];
    return module.value.chapters.map((chapter) => ({
      ...chapter,
      completed: progress.value.completedChapters.includes(chapter.id),
    }));
  });
  </script>
  
  <style scoped>
  /* Optional: Add styles for progress viewer */
  </style>
  