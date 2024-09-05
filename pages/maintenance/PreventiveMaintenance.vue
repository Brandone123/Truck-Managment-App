<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h6">Preventive Maintenance Schedule and Alerts</span>
      </div>
  
      <ScheduleDetailsDialog :modelValue="detailsDialog" :schedule="selectedSchedule" @update:modelValue="detailsDialog = $event" @mark-completed="markAsCompleted" />
      <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="dismissAlert" @update:modelValue="deleteDialog = $event" />
  
      <v-row class="mt-5 mb-10">
        <v-col cols="12" md="4">
          <v-card class="card-1 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
                <span>Total Scheduled</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ getScheduleN }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="card-2 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
                <span>Total Overdue</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ getOverdueN  }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="card-3 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
                <span>Total Completed</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ getCompleteN }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12">
          <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="scheduleHeaders" :items="scheduleList" :loading="loadingSchedules">
            <template v-slot:item.actions="{ item }">
              <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
              <!-- <v-icon class="ml-2" color="green" dense @click="markAsCompleted(item)">mdi-check</v-icon> -->
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusClass(item)"  size="small">
                {{ item.status }}
              </v-chip>
            </template>
          </SharedUiCustomTable>
        </v-col>
  
        <v-col cols="12" md="6">
          <div>
            <v-card-title class="text-h6 font-weight-bold text-primary px-0">Notifications and Alerts</v-card-title>
          </div>
          <v-row>
            <v-col cols="12">
              <v-card class="px-0">
                <v-card-text>
                  <v-alert density="compact" class="mb-2" dense type="info" v-for="alert in alertList">
                    {{ alert.vehicle_name }} - {{ alert.program_name }} (Due: {{ alert.due_date }}) - {{ alert.status }}
                    <!-- <v-icon small class="ml-2" color="white" dense @click="snoozeAlert(alert)">mdi-close</v-icon> -->
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <!-- <v-card class="px-0">
            <v-card-text>
              <v-alert dense type="info" v-for="alert in alertList" :key="alert.id" @click:close="confirmDismiss(alert.id)">
                {{ alert.vehicle_name }} - {{ alert.program_name }} (Due: {{ alert.due_date }}) - {{ alert.status }}
                
              </v-alert>
            </v-card-text>
          </v-card> -->
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { usePreventiveMaintenanceStore } from '@/stores/maintenance/preventiveMaintenanceStore';
  import ScheduleDetailsDialog from '@/components/maintenance/preventiveManagement/maintenanceSchedule/ScheduleDetailsDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/preventiveManagement/maintenanceSchedule/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const store = usePreventiveMaintenanceStore();
  const { scheduleList, alertList, loadingSchedules, loadingAlerts } = storeToRefs(store);
  
  const search = ref('');
  const filterType = ref('');
  const schedulePage = ref(1);
  const alertPage = ref(1);
  const itemsPerPage = ref(10);
  
  const typeOptions = ['Routine', 'Inspection'];
  const filtersAssets = ref<filterItem[]>([]);
  
  const detailsDialog = ref(false);
  const deleteDialog = ref(false);
  
  const selectedSchedule = ref( {
    id: null,
    vehicle_id: null,
    vehicle_name: '',
    program_name: '',
    maintenance_type: '',
    scheduled_date: '',
    status: '',
    description: '',
    attachments: [],
  });
  
  const viewDetails = (schedule: any) => {
    selectedSchedule.value = schedule;
    detailsDialog.value = true;
  };
  
  const markAsCompleted = async (schedule: any) => {
    await store.markAsCompleted(schedule.id);
  };
  
  const confirmDismiss = (id: any) => {
    selectedSchedule.value = { ...id };
    deleteDialog.value = true;
  };
  
  const dismissAlert = async () => {
    if (selectedSchedule.value?.id) {
      await store.dismissAlert(selectedSchedule.value.id);
      deleteDialog.value = false;
    }
  };
  
  const snoozeAlert = async (alert: any) => {
    await store.snoozeAlert(alert.id);
  };

  const getCompleteN = computed(()=> {
    const completeNomber = scheduleList.value.filter((maintenance) => maintenance.status === 'Completed')
    return completeNomber.length;
  })

  const getOverdueN = computed(()=> {
    const progressNomber = scheduleList.value.filter((maintenance) => maintenance.status === 'Overdue')
    return progressNomber.length;
  })

  const getScheduleN = computed(()=> {
    const pendingNomber = scheduleList.value.filter((maintenance) => maintenance.status === 'Schedule')
    return pendingNomber.length;
  })
  
  // const filteredSchedules = computed(() => {
  //   return scheduleList.value
  //     .filter(schedule => schedule.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || schedule.program_name.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(schedule => !filterType.value || schedule.maintenance_type === filterType.value)
  //     .slice((schedulePage.value - 1) * itemsPerPage.value, schedulePage.value * itemsPerPage.value);
  // });
  
  // const filteredAlerts = computed(() => {
  //   return alertList.value
  //     .filter(alert => alert.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || alert.program_name.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(alert => !filterType.value || alert.maintenance_type === filterType.value)
  //     .slice((alertPage.value - 1) * itemsPerPage.value, alertPage.value * itemsPerPage.value);
  // });
  
  const scheduleHeaders = [
    { title: 'Schedule ID', key: 'id' },
    { title: 'Vehicle ID', key: 'vehicle_id' },
    { title: 'Vehicle Name', key: 'vehicle_name' },
    { title: 'Program Name', key: 'program_name' },
    { title: 'Maintenance Type', key: 'maintenance_type' },
    { title: 'Scheduled Date', key: 'scheduled_date' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Filter by Maintenance Type',
        key: 'maintenance_type',
        items: ['Routine', 'Inspection'],
        width: '300px',
      },
    ];
  }

  const getStatusClass = (preventive: any) => {
    const preventiveData = scheduleList.value.find((data: any) => data.id === preventive.id);
    if (preventiveData?.status) {
      if (preventiveData?.status === "Scheduled") {
          return 'green'; 
      } else if (preventiveData?.status === "Completed") {
          return 'primary'; 
      } else if (preventiveData?.status === "Overdue") {
          return 'error'
      }
    }
    return '';
  }
  
  onMounted(() => {
    store.fetchSchedules();
    store.fetchAlerts();
  });

  watchEffect(() => {
    if (scheduleList.value) {
      initializeFilters();
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
  