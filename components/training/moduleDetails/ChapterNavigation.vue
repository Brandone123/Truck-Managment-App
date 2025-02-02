<!-- src/components/training/moduleDetails/ChapterNavigation.vue -->
<template>
  <v-card flat>
    <v-card-title>Chapter Navigation</v-card-title>
    <v-card-text>
      <v-progress-linear
        color="success"
        height="15"
        :value="progress.percentage"
        striped
      >
        <template #default="{ value }">
          <strong>{{ Math.ceil(value) }}% Completed</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
    <v-list dense>
      <v-list-item
        v-for="chapter in chapters"
        :key="chapter.id"
        @click="selectChapter(chapter)"
        :class="{ 'bg-light-blue-1': isSelected(chapter) }"
      >
        <v-list-item-action>
          <v-icon :color="chapter.completed ? 'green' : 'grey'">
            {{ chapter.completed ? 'mdi-check-circle' : 'mdi-timer-sand' }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ chapter.title }}</v-list-item-title>
          <v-list-item-subtitle>
            Status: {{ chapter.completed ? 'Completed' : 'In Progress' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
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

// Select a chapter
function selectChapter(chapter: ModuleChapter) {
  store.setCurrentChapter(props.moduleId, chapter.id);
}

// Check if the chapter is selected
function isSelected(chapter: ModuleChapter): boolean {
  return progress.value.currentChapterId === chapter.id;
}
</script>

<style scoped>
.bg-light-blue-1 {
  background-color: rgba(0, 0, 255, 0.1) !important;
}
</style>
