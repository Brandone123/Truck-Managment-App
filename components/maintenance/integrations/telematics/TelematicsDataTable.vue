<template>
  <SharedUiCustomTable :loading="loading" :showFooterInHead="false" :headers="headers" :items="telematicsDataList">
    <template v-slot:item.actions="{ item }">
      <v-icon color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
      <v-icon color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useTelematicsStore } from '@/stores/maintenance/telematicsStore';
import type { TelematicsData } from '~/types/maintenance/telematicsTypes';
const telematicsStore = useTelematicsStore();
const { telematicsDataList, loading } = storeToRefs(telematicsStore);

const headers = [
  { title: 'Data ID', key: 'id' },
  { title: 'Vehicle ID', key: 'vehicle_id' },
  // { title: 'Vehicle Name', key: 'vehicleName' },
  { title: 'Equipment ID', key: ' telematics_equipment_id' },
  { title: 'Data Type', key: 'data_type' },
  // { title: 'Date', key: 'date' },
  // { title: 'Location', key: 'location' },
  // { title: 'Engine Status', key: 'engineStatus' },
  // { title: 'Engine Oil Level', key: 'engineOilLevel' },
  // { title: 'Mileage', key: 'mileage' },
  { title: 'Actions', key: 'actions' },
];
</script>