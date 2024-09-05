<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="inspections" :loading="loading">
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
  import { useInspectionsStore } from '@/stores/maintenance/inspectionsStore';
  import type { Inspection } from '@/types/maintenance/inspectionTypes';
  
  const props = defineProps({
    search: String,
  });
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const inspectionsStore = useInspectionsStore();
  const inspections = computed(() => inspectionsStore.inspections);
  const loading = computed(() => inspectionsStore.loading);
  
  const headers = [
    { title: 'Inspection ID', key: 'id' },
    // { title: 'Vehicle ID', key: 'vehicleId' },
    { title: 'Vehicle Name', key: 'vehicleName' },
    { title: 'Inspection Type', key: 'inspectionType' },
    { title: 'Date', key: 'date' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  const getStatusClass = (inspection: any) => {
    const inspectionData = inspections.value.find((data: any) => data.id === inspection.id);
    if (inspectionData?.status) {
      if (inspectionData?.status === "Pending") {
          return 'green'; 
      } else if (inspectionData?.status === "Completed") {
          return 'primary'; 
      } else if (inspectionData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  </script>
  