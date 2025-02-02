<!-- src/components/training/planManagement/PlanTimeline.vue -->

<template>
    <v-card>
      <v-card-title>Timeline</v-card-title>
      <v-card-text>
        <v-timeline>
          <v-timeline-item
            v-for="course in sortedCourses"
            :key="course.id"
            :color="course.required ? 'primary' : 'secondary'"
            :icon="course.required ? 'mdi-clipboard-check' : 'mdi-clipboard-outline'"
          >
            <v-card>
              <v-card-title>
                {{ course.order }}. {{ course.title }}
                <v-spacer></v-spacer>
                <v-chip :color="course.required ? 'green' : 'orange'" text-color="white">
                  {{ course.required ? 'Required' : 'Optional' }}
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div><strong>Order:</strong> {{ course.order }}</div>
                <div><strong>Required:</strong> {{ course.required ? 'Yes' : 'No' }}</div>
                <!-- Additional course details can be added here -->
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import type { TrainingPlan, PlanCourse } from '@/types/training/trainingPlan';
  
  const props = defineProps<{
    plan: TrainingPlan | undefined;
  }>();
  
  // Sort courses by order
  const sortedCourses = computed<PlanCourse[]>(() => {
    if (!props.plan) return [];
    return [...props.plan.courses].sort((a, b) => a.order - b.order);
  });
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  