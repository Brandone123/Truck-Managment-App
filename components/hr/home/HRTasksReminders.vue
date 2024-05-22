<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">HR Tasks & Reminders</span>
    </div>
    <v-card>
      <v-list density="compact">
        <v-list-item v-for="(task,index) in tasks" :key="index" class="task-item" @click="handleTaskClick(task)">
          <template v-slot:prepend>
            <v-icon :color="getTaskIconColor(task.priority)">{{ getTaskIcon(task.type) }}</v-icon>
          </template>

          <v-list-item-title>{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatDate(task.dueDate) }}</v-list-item-subtitle>

          <template v-slot:append>
            <v-chip :color="getTaskStatusColor(task.status)" density="compact">{{ task.status }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tasks = ref([
  { id: 1, title: 'Review Leave Requests', dueDate: new Date(), priority: 'high', status: 'Pending', type: 'leave' },
  { id: 2, title: 'Complete Payroll Processing', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), priority: 'medium', status: 'In Progress', type: 'payroll' },
  // Add more tasks as needed
]);

// Local method to format dates
const formatDate = (value) => {
  if (value) {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
};

// Method to handle task click (Placeholder for actual implementation)
function handleTaskClick(task) {
  // Placeholder: Implement navigation or action based on task type
  console.log(`Task clicked: ${task.title}`);
}

// Helper methods for icons and colors
const getTaskIcon = (type) => {
  switch (type) {
    case 'leave': return 'mdi-beach';
    case 'payroll': return 'mdi-cash';
    default: return 'mdi-alert-circle';
  }
};

const getTaskIconColor = (priority) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'amber';
    default: return 'grey';
  }
};

const getTaskStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'red';
    case 'In Progress': return 'blue';
    default: return 'green';
  }
};
</script>

<style scoped>
.task-item {
  cursor: pointer;
  margin-bottom: 5px;
}
</style>