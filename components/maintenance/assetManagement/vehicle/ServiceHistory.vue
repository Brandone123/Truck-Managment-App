<template>
  <ServiceEntryDetailsDialog :model-value="serviceEntryDetailsDialog" :serviceEntry="selectedServiceEntry"
  @update:model-value="serviceEntryDetailsDialog = $event" @close="closeServiceEntryDetailsDialog" />

  <SharedUiCustomTable :showFooterInHead="false" show-select :headers="tableHeaders" :items="serviceEntries" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="viewServiceEntry(item)">mdi-eye</v-icon>
    </template>
      <!-- Slot to capture bulk actions -->
      <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
      <v-btn color="primary" class="text-none mr-2" @click="">
        <v-icon>mdi-printer</v-icon>
          Print
      </v-btn>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { ServiceHistory } from '~/types/maintenance/serviceHistory';
import { useServiceHistoryStore } from '@/stores/maintenance/useServiceHistoryStore';
import ServiceEntryDetailsDialog from '~/components/maintenance/management/history/ServiceEntryDetailsDialog.vue';

const serviceHistoryStore = useServiceHistoryStore();
  
const { serviceEntries, loading} = storeToRefs(serviceHistoryStore);

const emit = defineEmits(['view', 'edit', 'delete']);

const tableHeaders = [
  { title: 'Service Entry ID', key: 'id' },
  { title: 'Date', key: 'date' },
  { title: 'Vehicle ID', key: 'vehicleId' },
  { title: 'Vendor', key: 'vendor' },
  { title: 'Service Task', key: 'serviceTasks[0].taskName' },
  { title: 'Description', key: 'description' },
  { title: 'Total Cost', key: 'totalCost' },
  { title: 'Actions', key: 'actions' },
];

onMounted(() => {
    serviceHistoryStore.fetchServiceEntries();
  });

  const serviceEntryDetailsDialog = ref(false);
  const serviceEntryEditDialog = ref(false);

  const selectedServiceEntry = ref({
    id: null,
    date: '',
    vehicleId: '',
    vendor: '',
    description: '',
    totalCost: 0,
    status: 'Pending',
    serviceTasks: [],
    comments: [],
    activityLog: [],
  });

  const viewServiceEntry = (entry: any) => {
    selectedServiceEntry.value = entry;
    serviceEntryDetailsDialog.value = true;
  };

  const closeServiceEntryDetailsDialog = () => {
    serviceEntryDetailsDialog.value = false;
  };
</script>

<style scoped>
</style>