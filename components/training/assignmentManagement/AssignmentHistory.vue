<!-- src/components/training/assignmentDetail/AssignmentHistory.vue -->

<template>
    <v-card class="mt-4">
      <v-card-title>Assignment History</v-card-title>
      <v-card-text>
        <v-timeline>
          <v-timeline-item
            v-for="assignment in historyAssignments"
            :key="assignment.id"
            :color="assignmentColor(assignment.status)"
            :icon="assignmentIcon(assignment.type)"
          >
            <v-card>
              <v-card-title>
                {{ assignment.type }}: {{ getAssignmentName(assignment) }}
              </v-card-title>
              <v-card-text>
                <div><strong>Status:</strong> {{ assignment.status }}</div>
                <div><strong>Assigned At:</strong> {{ formatDate(assignment.assignedAt) }}</div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import type { Assignment, Program, TrainingPlan, Course } from '@/types/training/trainingAssignment';
  import { useTrainingAssignmentStore } from '@/stores/training/trainingAssignmentStore';
  
  const props = defineProps<{
    assignments: Assignment[];
  }>();
  
  const store = useTrainingAssignmentStore();
  
  // Computed: Get history assignments (Completed and Dropped)
  const historyAssignments = computed<Assignment[]>(() => {
    return props.assignments.filter(a => a.status === 'Completed' || a.status === 'Dropped');
  });
  
  // Helper: Get assignment name based on type
  function getAssignmentName(assignment: Assignment): string {
    if (assignment.type === 'Program' && assignment.programId) {
      const program = store.programs.find(p => p.id === assignment.programId);
      return program ? program.name : 'Unknown Program';
    }
    if (assignment.type === 'TrainingPlan' && assignment.trainingPlanId) {
      const trainingPlan = store.trainingPlans.find(tp => tp.id === assignment.trainingPlanId);
      return trainingPlan ? trainingPlan.name : 'Unknown Training Plan';
    }
    if (assignment.type === 'Course' && assignment.courseId) {
      const course = store.courses.find(c => c.id === assignment.courseId);
      return course ? course.name : 'Unknown Course';
    }
    return 'Unknown Assignment';
  }
  
  // Helper: Get color based on status
  function assignmentColor(status: 'Active' | 'Completed' | 'Dropped'): string {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Dropped':
        return 'red';
      default:
        return 'grey';
    }
  }
  
  // Helper: Get icon based on assignment type
  function assignmentIcon(type: 'Program' | 'TrainingPlan' | 'Course'): string {
    switch (type) {
      case 'Program':
        return 'mdi-flag';
      case 'TrainingPlan':
        return 'mdi-clipboard-text';
      case 'Course':
        return 'mdi-school';
      default:
        return 'mdi-help';
    }
  }
  
  // Helper: Format date
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  </script>
  
  <style scoped>
  /* Add any specific styling here */
  </style>
  