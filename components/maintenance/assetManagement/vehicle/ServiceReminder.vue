<template>
   <ServiceReminderDetailsDialog :modelValue="detailsDialog" :serviceReminder="selectedReminder"
   @update:modelValue="detailsDialog = $event" @close="closeDetailsDialog" />
  
    <SharedUiCustomTable :showFooterInHead="false" show-select v-model="selectedItems" :headers="tableHeaders" :items="serviceReminderList" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="viewReminder(item)">mdi-eye</v-icon>
      </template>
      <template v-slot:item.vehicleId="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="viewReminder(item)">
          {{ item.vehicleId }}
        </span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusClass(item)" size="small">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:bulkActions="{ selectedItems }">
        <v-btn color="primary" class="text-none mr-2" @click="print()">
          <v-icon>mdi-printer</v-icon> Print
        </v-btn>
        <v-btn color="primary" class="text-none mr-2">
          <v-icon>mdi-send</v-icon> Send
        </v-btn>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, computed } from 'vue';
  import { useServiceReminderStore } from '@/stores/maintenance/serviceReminders';
  import ServiceReminderDetailsDialog from '~/components/maintenance/serviceReminders/ServiceReminderDetailsDialog.vue';
  
  const serviceReminderStore = useServiceReminderStore();
  const { serviceReminderList, loading } = storeToRefs(serviceReminderStore);
  
  const search = ref('');
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const tableHeaders = [
    { title: 'Reminder ID', key: 'id' },
    { title: 'Vehicle ID', key: 'vehicleId' },
    { title: 'Vehicle Make & Model', key: 'vehicleMakeModel' },
    { title: 'Service Task', key: 'serviceTask' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];
  
  const getStatusClass = (item: any) => {
    if (item.status === 'Due Soon') {
      return 'secondary';
    } else if (item.status === 'Overdue') {
      return 'red';
    } else if (item.status === 'Completed') {
      return 'primary';
    }
    return '';
  }
  
  const selectedItems = ref([])
  
  const print = () => {
    if (selectedItems.value) {
      console.log('Print service reminders for:', selectedItems.value);
    }
  }
  
  const detailsDialog = ref(false);
  const selectedReminder = ref({
    id: null,
    vehicleId: '',
    vehicleMake: '',
    vehicleModel: '',
    serviceTask: '',
    dueDate: '',
    status: '',
    comments: [],
  });
  
  const closeDetailsDialog = () => {
    detailsDialog.value = false;
  };

  const viewReminder = (reminder: any) => {
    selectedReminder.value = reminder;
    detailsDialog.value = true;
  };

  </script>
  
  <style scoped>
  </style>
  