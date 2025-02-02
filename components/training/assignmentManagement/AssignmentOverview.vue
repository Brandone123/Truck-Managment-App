<!-- src/components/training/assignmentDetail/AssignmentOverview.vue -->

<template>
    <v-card>
      <v-card-title>Assignment Overview</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <h3>Employee Details</h3>
            <div><strong>Name:</strong> {{ employee?.name }}</div>
            <div><strong>Department:</strong> {{ employee?.department }}</div>
            <div><strong>Email:</strong> {{ employee?.email }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <h3>Assignment Details</h3>
            <div><strong>Type:</strong> {{ assignmentType }}</div>
            <div v-if="assignmentType === 'Program'"><strong>Program:</strong> {{ program?.name }}</div>
            <div v-else-if="assignmentType === 'TrainingPlan'"><strong>Training Plan:</strong> {{ trainingPlan?.name }}</div>
            <div v-else-if="assignmentType === 'Course'">
              <strong>Course:</strong> {{ course?.name }}
              <span v-if="trainingPlan"><br/><strong>Training Plan:</strong> {{ trainingPlan?.name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import type { Assignment, Program, TrainingPlan, Course, Employee } from '@/types/training/trainingAssignment';
  import { useTrainingAssignmentStore } from '@/stores/training/trainingAssignmentStore';
  
  const props = defineProps<{
    assignment: Assignment;
  }>();
  
  const store = useTrainingAssignmentStore();
  
  // Computed: Get Employee
  const employee = computed<Employee | undefined>(() => {
    return store.employees.find(e => e.id === props.assignment.employeeId);
  });
  
  // Computed: Get Assignment Type
  const assignmentType = computed(() => props.assignment.type);
  
  // Computed: Get Program
  const program = computed<Program | undefined>(() => {
    if (props.assignment.type === 'Program' && props.assignment.programId) {
      return store.programs.find(p => p.id === props.assignment.programId);
    }
    return undefined;
  });
  
  // Computed: Get Training Plan
  const trainingPlan = computed<TrainingPlan | undefined>(() => {
    if (props.assignment.type === 'TrainingPlan' && props.assignment.trainingPlanId) {
      return store.trainingPlans.find(tp => tp.id === props.assignment.trainingPlanId);
    }
    if (props.assignment.type === 'Course' && props.assignment.trainingPlanId) {
      return store.trainingPlans.find(tp => tp.id === props.assignment.trainingPlanId);
    }
    return undefined;
  });
  
  // Computed: Get Course
  const course = computed<Course | undefined>(() => {
    if (props.assignment.type === 'Course' && props.assignment.courseId) {
      return store.courses.find(c => c.id === props.assignment.courseId);
    }
    return undefined;
  });
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 10px;
  }
  </style>
  