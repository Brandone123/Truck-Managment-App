<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h6">Vehicle Usage and Service Reminders</span>
        <v-btn color="primary" @click="openAddUsageLogDialog">Add Usage Log</v-btn>
      </div>
  
      <v-row class="mt-5 mb-16">
        <v-col cols="12" md="4">
          <v-card class="card-1 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#CE0053">mdi-speedometer</v-icon>
                <span>Total Mileage</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ overviewData.totalMileage }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="card-2 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#1867C0">mdi-clock-outline</v-icon>
                <span>Total Engine Hours</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ overviewData.totalEngineHours }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="card-3 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#424656">mdi-bell-outline</v-icon>
                <span>Upcoming Reminders</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ overviewData.upcomingReminders }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <UsageDetailsDialog :modelValue="usageDetailsDialog" :log="selectedUsageLog" @update:modelValue="usageDetailsDialog = $event" />
      <AddEditUsageDialog :modelValue="addEditUsageDialog" :log="selectedUsageLog" @update:modelValue="addEditUsageDialog = $event" @save="saveUsageLog" />
      <!-- <DeleteConfirmationDialog :modelValue="deleteUsageDialog" @confirm="deleteUsageLog" @update:modelValue="deleteUsageDialog = $event" /> -->
  
      <v-row>
        <v-col cols="12">
        <SharedUiCustomTable :filters="filtersUsage" :showFooterInHead="false" :headers="usageHeaders" :items="usageLogs" :loading="loadingUsageLogs">
          <template v-slot:item.actions="{ item }">
            <v-icon class="ml-2" color="primary" dense @click="viewUsageDetails(item)">mdi-eye</v-icon>
            <v-icon class="ml-2" color="primary" dense @click="editUsageLog(item)">mdi-pencil</v-icon>
            <v-icon class="ml-2" color="red" dense @click="deleteUsageLog(item.id)">mdi-delete</v-icon>
          </template>
        </SharedUiCustomTable>
        </v-col>
      </v-row>
     
  
      <ReminderDetailsDialog :modelValue="reminderDetailsDialog" :reminder="selectedReminder" @update:modelValue="reminderDetailsDialog = $event" />
      <DeleteConfirmationDialog :modelValue="deleteReminderDialog" @confirm="dismissReminder" @update:modelValue="deleteReminderDialog = $event" />
  
      <v-row>
        <v-col cols="12">
          <div>
            <v-card-title class="text-h6 font-weight-bold text-primary px-0">Service Reminders</v-card-title>
          </div>
          <SharedUiCustomTable :filters="filtersReminder" :showFooterInHead="false" :headers="reminderHeaders" :items="serviceReminders" :loading="loadingServiceReminders" class="mt-5">
            <template v-slot:item.actions="{ item }">
              <v-icon class="ml-2" color="primary" dense @click="viewReminderDetails(item)">mdi-eye</v-icon>
              <v-icon class="ml-2" color="red" dense @click="confirmDismissReminder(item.id)">mdi-delete</v-icon>
            </template>
          </SharedUiCustomTable>
        </v-col>
      </v-row>
     
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useVehicleUsageStore } from '@/stores/maintenance/vehicleUsageStore';
  import UsageDetailsDialog from '@/components/maintenance/maintenanceTracking/usage/UsageDetailsDialog.vue';
  import AddEditUsageDialog from '@/components/maintenance/maintenanceTracking/usage/AddEditUsageDialog.vue';
  import ReminderDetailsDialog from '@/components/maintenance/maintenanceTracking/usage/ReminderDetailsDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/maintenanceTracking/usage/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const store = useVehicleUsageStore();
  const { usageLogs, serviceReminders, loadingUsageLogs, loadingServiceReminders, overviewData } = storeToRefs(store);
  
  const search = ref('');
  const filterType = ref('');
  const usagePage = ref(1);
  const reminderPage = ref(1);
  const itemsPerPage = ref(10);
  
  const typeOptions = ['Mileage', 'Engine Hours'];
  const filtersUsage = ref<filterItem[]>([]);
  const filtersReminder = ref<filterItem[]>([]);
  
  const usageDetailsDialog = ref(false);
  const addEditUsageDialog = ref(false);
  const deleteUsageDialog = ref(false);
  const reminderDetailsDialog = ref(false);
  const deleteReminderDialog = ref(false);
  
  const selectedUsageLog = ref( {
    id: null,
    vehicle_id: null,
    vehicle_name: '',
    usage_type: '',
    meter_reading: null,
    date: '',
    cost: null,
    notes: '',
    attachments: [],
  });
  const selectedReminder = ref( {
    id: null,
    vehicle_id: null,
    vehicle_name: '',
    maintenance_type: '',
    due_date: '',
    description: '',
    notes: '',
    attachments: [],
  });
  
  const openAddUsageLogDialog = () => {
    selectedUsageLog.value = {
      id: null,
      vehicle_id: null,
      vehicle_name: '',
      usage_type: '',
      meter_reading: null,
      date: '',
      cost: null,
      notes: '',
      attachments: [],
    };
    addEditUsageDialog.value = true;
  };
  
  const viewUsageDetails = (log: any) => {
    selectedUsageLog.value = log;
    usageDetailsDialog.value = true;
  };
  
  const editUsageLog = (log: any) => {
    selectedUsageLog.value = log;
    addEditUsageDialog.value = true;
  };
  
  const confirmDeleteUsage = (id: any) => {
    selectedUsageLog.value = { ...id };
    deleteUsageDialog.value = true;
  };
  
  const deleteUsageLog = async (id: number) => {
    await store.deleteVehicleUsageLog(id);
  };
  
  const saveUsageLog = async (log: any) => {
    if (log.id) {
      await store.updateVehicleUsageLog(log);
    } else {
      await store.createVehicleUsageLog(log);
    }
    addEditUsageDialog.value = false;
  };
  
  const viewReminderDetails = (reminder: any) => {
    selectedReminder.value = reminder;
    reminderDetailsDialog.value = true;
  };
  
  const confirmDismissReminder = (id: any) => {
    selectedReminder.value = { ...id };
    deleteReminderDialog.value = true;
  };
  
  const dismissReminder = async () => {
    if (selectedReminder.value?.id) {
      await store.dismissReminder(selectedReminder.value.id);
      deleteReminderDialog.value = false;
    }
  };
  
  const usageTotalPages = computed(() => Math.ceil(usageLogs.value.length / itemsPerPage.value));
  const reminderTotalPages = computed(() => Math.ceil(serviceReminders.value.length / itemsPerPage.value));
  
  // const filteredUsageLogs = computed(() => {
  //   return usageLogs.value
  //     .filter(log => log.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || log.id.toString().includes(search.value.toLowerCase()))
  //     .filter(log => !filterType.value || log.usage_type === filterType.value)
  //     .slice((usagePage.value - 1) * itemsPerPage.value, usagePage.value * itemsPerPage.value);
  // });
  
  // const filteredReminders = computed(() => {
  //   return serviceReminders.value
  //     .filter(reminder => reminder.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || reminder.id.toString().includes(search.value.toLowerCase()))
  //     .filter(reminder => !filterType.value || reminder.maintenance_type === filterType.value)
  //     .slice((reminderPage.value - 1) * itemsPerPage.value, reminderPage.value * itemsPerPage.value);
  // });
  
  const usageHeaders = [
    { title: 'Usage ID', key: 'id' },
    // { title: 'Vehicle ID', key: 'vehicle_id' },
    { title: 'Vehicle Name', key: 'vehicle_name' },
    { title: 'Usage Type', key: 'usage_type' },
    { title: 'Meter Reading', key: 'meter_reading' },
    { title: 'Date', key: 'date' },
    { title: 'Cost', key: 'cost' },
    { title: 'Actions', key: 'actions' },
  ];
  
  const reminderHeaders = [
    { title: 'Reminder ID', key: 'id' },
    // { title: 'Vehicle ID', key: 'vehicle_id' },
    { title: 'Vehicle Name', key: 'vehicle_name' },
    { title: 'Maintenance Type', key: 'maintenance_type' },
    { title: 'Due Date', key: 'due_date' },
    { title: 'Actions', key: 'actions' },
  ];

  function initializeFiltersUsage() {
    filtersUsage.value = [
      {
        title: 'Filter by Usage Type',
        key: 'usage_type',
        items: ['Mileage', 'Engine Hours'],
        width: '300px',
      },
    ];
  }

  function initializeFiltersReminder() {
    filtersReminder.value = [
      {
        title: 'Filter by Maintenance Type',
        key: 'maintenance_type',
        items: ['Routine', 'Inspection'],
        width: '300px',
      },
    ];
  }
  
  onMounted(() => {
    store.fetchUsageLogs();
    store.fetchServiceReminders();
  });
  watchEffect(() => {
    if (usageLogs.value) {
      initializeFiltersUsage();
    }
  });

  watchEffect(() => {
    if (serviceReminders.value) {
      initializeFiltersReminder();
    }
  });
  </script>
  
  <style scoped>
  .card-1 {
    border-left: 8px solid #CE0053;
  }
  .card-2 {
    border-left: 8px solid #1867C0;
  }
  .card-3 {
    border-left: 8px solid #424656;
  }
  </style>
  