<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Program Assignments</span>
    </div>

    <v-card>
      <v-list dense>
        <v-list-item v-for="assignment in assignments" :key="assignment.id" class="my-2" >
          <v-list-item-title>{{ assignment.title }}</v-list-item-title>
          <v-list-item-subtitle>
            Due by: {{ formatDate(assignment.dueDate) }}
            <v-chip density="compact" :color="assignment.completed ? 'green' : 'red'" class="ml-2">
              {{ assignment.completed ? 'Completed' : 'Pending' }}
            </v-chip>
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-btn color="primary" @click="viewAssignment(assignment.id)" variant="text" density="comfortable"
              class="text-none">View</v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const assignments = ref<Assignment[]>([
  {
    id: 1,
    title: 'Assignment 1: Safety Protocols',
    dueDate: '2024-04-15',
    completed: false,
  },
  {
    id: 2,
    title: 'Assignment 2: Operational Checklist',
    dueDate: '2024-05-20',
    completed: true,
  }
  // ... more assignments
])

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function viewAssignment(assignmentId: number) {
  // Logic to view the details of the assignment
  // In a real app, this could involve navigating to a different page or opening a dialog
  alert(`View details for assignment ${assignmentId}`);
}
</script>

<style scoped>
.my-2 {
  margin-bottom: 8px;
}
</style>