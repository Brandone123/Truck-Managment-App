<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="tasks" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.technicianName="{ item }">
        <span>{{ getTechnicianName(item.technicianId) }}</span>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { useTasksStore } from '@/stores/maintenance/maintenancetasksStore';
  import type { Task } from '@/types/maintenance/maintenancetaskTypes';
  
  const props = defineProps({
    search: String,
  });
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const tasksStore = useTasksStore();
  const tasks = computed(() => tasksStore.tasks);
  const loading = computed(() => tasksStore.loading);
  
  const headers = [
    { title: 'Task ID', key: 'id' },
    { title: 'Technician ID', key: 'technicianId' },
    { title: 'Technician Name', key: 'technicianName' },
    { title: 'Task Description', key: 'description' },
    { title: 'Assigned Date', key: 'assignedDate' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  const getTechnicianName = (id: number) => {
    const Technician = tasks.value.find((task) => task.technicianId === id)
    return Technician ? Technician.technicianName : '';
  }
  </script>
  