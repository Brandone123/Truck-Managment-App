<!-- src/components/training/assignmentManagement/AssignmentsTable.vue -->

<template>
    <v-data-table
      :headers="headers"
      :items="filteredAssignments"
      :loading="loading"
      class="elevation-1"
      :items-per-page="10"
      item-key="id"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Search Assignments"
          append-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </template>

        <!-- ID Column with Navigation Link -->
    <template #item.id="{ item }">
      <router-link :to="`/training/TrainingAssignment/${item.id}`" class="text-decoration-none">
        <v-btn text color="primary">
          {{ item.id }}
        </v-btn>
      </router-link>
    </template>
  
      <template #item.employee="{ item }">
        {{ getEmployeeName(item.employeeId) }}
      </template>
  
      <template #item.assignmentType="{ item }">
        <span v-if="item.type === 'Program'">Program</span>
        <span v-else-if="item.type === 'TrainingPlan'">Training Plan</span>
        <span v-else-if="item.type === 'Course'">Course</span>
        <span v-else>Other</span>
      </template>
  
      <template #item.details="{ item }">
        <span v-if="item.type === 'Program'">
          {{ getProgramName(item.programId!) }}
        </span>
        <span v-else-if="item.type === 'TrainingPlan'">
          {{ getTrainingPlanName(item.trainingPlanId!) }}
        </span>
        <span v-else-if="item.type === 'Course'">
          {{ getCourseName(item.courseId!) }}
          <span v-if="item.trainingPlanId"> (Part of Training Plan: {{ getTrainingPlanName(item.trainingPlanId!) }})</span>
        </span>
        <span v-else>—</span>
      </template>
  
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" text-color="white">
          {{ item.status }}
        </v-chip>
      </template>
  
      <template #item.actions="{ item }">
        <v-btn color="info" small @click="$emit('edit-assignment', item)">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="red" small @click="$emit('delete-assignment', item)">
          <v-icon left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { Assignment, Employee, Program, TrainingPlan, Course } from '@/types/training/trainingAssignment';
  import { useTrainingAssignmentStore } from '@/stores/training/trainingAssignmentStore';
  
  interface Props {
    assignments: Assignment[];
    loading: boolean;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['edit-assignment', 'delete-assignment']);
  
  const search = ref('');
  
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Employee', value: 'employee' },
    { title: 'Type', value: 'assignmentType' },
    { title: 'Details', value: 'details' },
    { title: 'Status', value: 'status' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  // Access the store to get names based on IDs
  const store = useTrainingAssignmentStore();
  
  const employees = computed<Employee[]>(() => store.employees);
  const programs = computed<Program[]>(() => store.programs);
  const trainingPlans = computed<TrainingPlan[]>(() => store.trainingPlans);
  const courses = computed<Course[]>(() => store.courses);
  
  // Computed: Filter assignments based on search
  const filteredAssignments = computed(() => {
    if (!search.value.trim()) return props.assignments;
    return props.assignments.filter(a => {
      const employee = store.employees.find(e => e.id === a.employeeId);
      const program = a.programId ? store.programs.find(p => p.id === a.programId) : null;
      const trainingPlan = a.trainingPlanId ? store.trainingPlans.find(tp => tp.id === a.trainingPlanId) : null;
      const course = a.courseId ? store.courses.find(c => c.id === a.courseId) : null;
  
      const employeeName = employee ? employee.name.toLowerCase() : '';
      const type = a.type.toLowerCase();
      const detail = (() => {
        if (a.type === 'Program' && program) return program.name.toLowerCase();
        if (a.type === 'TrainingPlan' && trainingPlan) return trainingPlan.name.toLowerCase();
        if (a.type === 'Course' && course) return course.name.toLowerCase();
        return '';
      })();
  
      return employeeName.includes(search.value.toLowerCase()) ||
             type.includes(search.value.toLowerCase()) ||
             detail.includes(search.value.toLowerCase());
    });
  });
  
  // Helper methods to get names
  function getEmployeeName(employeeId: number): string {
    const employee = store.employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }
  
  function getProgramName(programId: number): string {
    const program = store.programs.find(p => p.id === programId);
    return program ? program.name : 'Unknown Program';
  }
  
  function getTrainingPlanName(trainingPlanId: number): string {
    const trainingPlan = store.trainingPlans.find(tp => tp.id === trainingPlanId);
    return trainingPlan ? trainingPlan.name : 'Unknown Training Plan';
  }
  
  function getCourseName(courseId: number): string {
    const course = store.courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  }
  
  function statusColor(status: 'Active' | 'Completed' | 'Dropped'): string {
    switch (status) {
      case 'Active':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Dropped':
        return 'red';
      default:
        return 'grey';
    }
  }
  </script>
  
  <style scoped>
  /* Add table-specific styling here */
  </style>
  