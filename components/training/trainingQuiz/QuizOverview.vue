<!-- src/components/training/trainingQuiz/QuizOverview.vue -->
<template>
    <v-card>
      <v-card-title>Overview</v-card-title>
      <v-card-text>
        <div><strong>Title:</strong> {{ quiz.title }}</div>
        <div><strong>Description:</strong> {{ quiz.description }}</div>
        <div><strong>Associated With:</strong> {{ association }}</div>
        <div><strong>Created At:</strong> {{ formatDate(quiz.createdAt) }}</div>
        <div><strong>Last Updated:</strong> {{ formatDate(quiz.updatedAt) }}</div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import type { Quiz } from '@/types/training/trainingQuiz';
  import { computed } from 'vue';
  import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
  
  const props = defineProps<{
    quiz: Quiz | undefined;
  }>();
  
  const moduleStore = useTrainingModuleStore();
  
  // Compute the association string
  const association = computed(() => {
    if (!props.quiz) return '';
    if (props.quiz.courseId) {
      const course = moduleStore.courses.find((c) => c.id === props.quiz?.courseId);
      return course ? `Course: ${course.name}` : `Course #${props.quiz?.courseId}`;
    } else if (props.quiz.moduleId) {
      const module = moduleStore.modules.find((m) => m.id === props.quiz?.moduleId);
      return module ? `Module: ${module.title}` : `Module #${props.quiz?.moduleId}`;
    } else if (props.quiz.chapterId) {
      // Find the module and chapter
      for (const module of moduleStore.modules) {
        const chapter = module.chapters?.find((ch) => ch.id === props.quiz?.chapterId);
        if (chapter) {
          return `Chapter: ${chapter.title} (Module: ${module.title})`;
        }
      }
      return `Chapter #${props.quiz.chapterId}`;
    } else {
      return 'General';
    }
  });
  
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  