<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h6">Repairs and Maintenance Tracking</span>
        <v-btn color="primary" @click="openAddMaintenanceDialog">Add Repair Request</v-btn>
      </div>
  
      <v-row class="mt-5 mb-16">
        <v-col cols="12" md="4">
          <v-card class="card-1 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
                <span>Total Pending</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ overviewData.totalPending }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="card-2 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
                <span>Total In Progress</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ overviewData.totalInProgress }}</span>
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
                <span class="font-weight-bold text-h6">{{ overviewData.totalCompleted }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <MaintenanceDetailsDialog :modelValue="detailsDialog" :log="selectedLog" @update:modelValue="detailsDialog = $event" />
      <AddEditMaintenanceDialog :modelValue="addEditDialog" :log="selectedLog" @update:modelValue="addEditDialog = $event" @save="saveLog" />
      <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteLog" @update:modelValue="deleteDialog = $event" /> -->
  
      <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="maintenanceHeaders" :items="maintenanceLogs" :loading="loadingLogs">
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
          <v-icon class="ml-2" color="primary" dense @click="editLog(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="deleteLog(item.id)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusClass(item)"  size="small">
            {{ item.status }}
          </v-chip>
        </template>
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useMaintenanceTrackingStore } from '@/stores/maintenance/maintenanceTrackingStore';
  import MaintenanceDetailsDialog from '@/components/maintenance/maintenanceTracking/tracking/MaintenanceDetailsDialog.vue';
  import AddEditMaintenanceDialog from '@/components/maintenance/maintenanceTracking/tracking/AddEditMaintenanceDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/maintenanceTracking/tracking/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const store = useMaintenanceTrackingStore();
  const { maintenanceLogs, loadingLogs, overviewData } = storeToRefs(store);
  
  const search = ref('');
  const filterType = ref('');
  const page = ref(1);
  const itemsPerPage = ref(10);
  
  const typeOptions = ['Repair', 'Routine', 'Inspection'];
  const filtersAssets = ref<filterItem[]>([]);
  
  const detailsDialog = ref(false);
  const addEditDialog = ref(false);
  const deleteDialog = ref(false);
  
  const selectedLog = ref( {
    id: null,
    vehicle_id: null,
    vehicle_name: '',
    maintenance_type: '',
    date: '',
    technician_vendor: '',
    cost: null,
    status: '',
    description: '',
    attachments: [],
  });
  
  const openAddMaintenanceDialog = () => {
    selectedLog.value = {
      id: null,
      vehicle_id: null,
      vehicle_name: '',
      maintenance_type: '',
      date: '',
      technician_vendor: '',
      cost: null,
      status: '',
      description: '',
      attachments: [],
    };
    addEditDialog.value = true;
  };
  
  const viewDetails = (log: any) => {
    selectedLog.value = log;
    detailsDialog.value = true;
  };
  
  const editLog = (log: any) => {
    selectedLog.value = log;
    addEditDialog.value = true;
  };
  
  const confirmDelete = (id: any) => {
    selectedLog.value = { ...id };
    deleteDialog.value = true;
  };

  const layoutStore = useLayoutStore()
  const deleteLog = async (id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this log ?")

    if (confirm) {
      await store.deleteMaintenanceLog(id);
    }
  };
  
  const saveLog = async (log: any) => {
    if (log.id) {
      await store.updateMaintenanceLog(log);
    } else {
      await store.createMaintenanceLog(log);
    }
    addEditDialog.value = false;
  };
  
  const getCompleteN = computed(()=> {
    const completeNomber = maintenanceLogs.value.filter((maintenance) => maintenance.status === 'Completed')
    return completeNomber.length;
  })

  const getOverdueN = computed(()=> {
    const progressNomber = maintenanceLogs.value.filter((maintenance) => maintenance.status === 'Overdue')
    return progressNomber.length;
  })

  const getScheduleN = computed(()=> {
    const pendingNomber = maintenanceLogs.value.filter((maintenance) => maintenance.status === 'Schedule')
    return pendingNomber.length;
  })
  
  // const filteredLogs = computed(() => {
  //   return maintenanceLogs.value
  //     .filter(log => log.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || log.program_name.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(log => !filterType.value || log.maintenance_type === filterType.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });
  
  const maintenanceHeaders = [
    { title: 'Request/Log ID', key: 'id' },
    // { title: 'Vehicle ID', key: 'vehicle_id' },
    { title: 'Vehicle Name', key: 'vehicle_name' },
    { title: 'Maintenance Type', key: 'maintenance_type' },
    { title: 'Date', key: 'date' },
    { title: 'Technician/Vendor', key: 'technician_vendor' },
    { title: 'Cost', key: 'cost' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  const getStatusClass = (preventive: any) => {
    const preventiveData = maintenanceLogs.value.find((data: any) => data.id === preventive.id);
    if (preventiveData?.status) {
      if (preventiveData?.status === "Pending") {
          return 'green'; 
      } else if (preventiveData?.status === "Completed") {
          return 'primary'; 
      } else if (preventiveData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Filter by Maintenance Type',
        key: 'maintenance_type',
        items: ['Routine', 'Inspection', 'Repair'],
        width: '300px',
      },
    ];
  }
  
  onMounted(() => {
    store.fetchMaintenanceLogs();
  });

  watchEffect(() => {
    if (maintenanceLogs.value) {
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
  