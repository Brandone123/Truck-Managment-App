<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="complianceTasks" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusClass(item)"  size="small">
          {{ item.status }}
        </v-chip>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { useComplianceTasksStore } from '@/stores/maintenance/complianceTasksStore';
  import type { ComplianceTask } from '@/types/maintenance/complianceTaskTypes';
  
  const props = defineProps({
    search: String,
  });
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const complianceTasksStore = useComplianceTasksStore();
  const complianceTasks = computed(() => complianceTasksStore.complianceTasks);
  const loading = computed(() => complianceTasksStore.loading);
  
  const headers = [
    { title: 'Task ID', key: 'id' },
    // { title: 'Vehicle ID', key: 'vehicleId' },
    { title: 'Vehicle Name', key: 'vehicleName' },
    { title: 'Compliance Type', key: 'complianceType' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  const getStatusClass = (compliance: any) => {
    const complianceData = complianceTasks.value.find((data: any) => data.id === compliance.id);
    if (complianceData?.status) {
      if (complianceData?.status === "Pending") {
          return 'green'; 
      } else if (complianceData?.status === "Completed") {
          return 'primary'; 
      } else if (complianceData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  </script>
  