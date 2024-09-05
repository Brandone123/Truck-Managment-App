<template>
  <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="renewals" :loading="loading">
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusClass(item)" size="small">
        {{ item.status }}
      </v-chip>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useRenewalsStore } from '@/stores/maintenance/renewalsStore';
import type { Renewal } from '@/types/maintenance/renewalTypes';

const props = defineProps({
  search: String,
});

const emit = defineEmits(['view', 'edit', 'delete']);

const renewalsStore = useRenewalsStore();
const renewals = computed(() => renewalsStore.renewals);
const loading = computed(() => renewalsStore.loading);

const headers = [
  { title: 'Renewal ID', key: 'id' },
  { title: 'Vehicle ID', key: 'vehicle_id' },
  { title: 'Renewal Type', key: 'type' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getStatusClass = (renewal: any) => {
  const renewalData = renewals.value.find((data: any) => data.id === renewal.id);
  if (renewalData?.status) {
    if (renewalData?.status === "pending") {
      return 'green';
    } else if (renewalData?.status === "completed") {
      return 'primary';
    } else if (renewalData?.status === "in progress") {
      return 'error'
    }
  }
  return '';
}
</script>