<template>
    <SharedUiCustomTable :showFooterInHead="false" :headers="inspectionRecordHeaders" :items="inspectionRecords" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import type { InspectionRecord } from '@/types/maintenance/inspectionRecords';
  
  const props = defineProps({
    search: String,
    loading: Boolean,
    inspectionRecords: Array as () => InspectionRecord[],
  });
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const inspectionRecordHeaders = [
    { title: 'Record ID', key: 'id' },
    { title: 'Vehicle/Equipment ID', key: 'vehicleEquipmentId' },
    { title: 'Vehicle/Equipment Name', key: 'vehicleEquipmentName' },
    { title: 'Inspection Type', key: 'inspectionType' },
    { title: 'Date', key: 'date' },
    { title: 'Status', key: 'status' },
    { title: 'Inspector', key: 'inspector' },
    { title: 'Actions', key: 'actions' },
  ];
  </script>
  