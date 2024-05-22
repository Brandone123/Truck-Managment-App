<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Upcoming Assignments</span>
    </div>
    <v-card>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="(assignment,index) in assignments" :key="index" density="compact">
              <v-list-item-title class="text-primary">{{ assignment.title }}</v-list-item-title>
              <v-list-item-subtitle>Due: {{ assignment.dueDate }}</v-list-item-subtitle>
              <v-divider v-if="index != assignments.length -1" class="my-2"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const assignments = ref([
  { id: 1, title: 'Defensive Driving Course', dueDate: '2024-04-05' },
  { id: 2, title: 'Hazardous Materials Handling', dueDate: '2024-04-12' },
  { id: 3, title: 'Customer Service Improvement Plan', dueDate: '2024-04-20' },
]);
</script>