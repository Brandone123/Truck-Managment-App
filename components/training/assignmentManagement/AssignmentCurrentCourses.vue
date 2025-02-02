<!-- src/components/training/assignmentDetail/AssignmentCurrentCourses.vue -->

<template>
    <v-card class="mt-4">
      <v-card-title>Current Courses & Progress</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="currentCourses"
          class="elevation-1"
          :items-per-page="5"
          item-key="id"
        >
          <template #item.course="{ item }">
            {{ item.name }}
          </template>
  
          <template #item.progress="{ item }">
            <v-progress-linear :value="getProgress(item.id)" color="green" height="10"></v-progress-linear>
            <div>{{ getProgress(item.id) }}%</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import type { Assignment, Course } from '@/types/training/trainingAssignment';
  import { useTrainingAssignmentStore } from '@/stores/training/trainingAssignmentStore';
  
  const props = defineProps<{
    assignments: Assignment[];
  }>();
  
  const store = useTrainingAssignmentStore();
  
  // Computed: Get current courses
  const currentCourses = computed<Course[]>(() => {
    return store.courses.filter(c => {
      return props.assignments.some(a => a.type === 'Course' && a.courseId === c.id && a.status === 'Active');
    });
  });
  
  // Dummy progress data (In real application, this should come from user progress tracking)
  function getProgress(courseId: number): number {
    // For demonstration, assign random progress
    return Math.floor(Math.random() * 100);
  }
  
  const headers = [
    { title: 'Course Name', value: 'course' },
    { title: 'Progress', value: 'progress' },
  ];
  </script>
  
  <style scoped>
  /* Add any specific styling here */
  </style>
  