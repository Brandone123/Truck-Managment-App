<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h6">Maintenance History</span>
        <v-btn color="primary" @click="openAddMaintenanceDialog">Add Maintenance Record</v-btn>
      </div>
  
      <!-- <div class="d-flex justify-space-between mb-4">
        <v-text-field v-model="search" label="Search Maintenance Records" variant="solo" flat density="compact" placeholder="Search" prepend-inner-icon="mdi-magnify"></v-text-field>
        <v-select v-model="filterType" :items="maintenanceTypeOptions" label="Filter by Maintenance Type" variant="solo" flat density="compact"></v-select>
      </div> -->
  
      <MaintenanceDetailsDialog :modelValue="maintenanceDetailsDialog" :maintenance="selectedMaintenance" @update:modelValue="maintenanceDetailsDialog = $event" />
      <AddEditMaintenanceDialog :modelValue="addEditMaintenanceDialog" :maintenance="selectedMaintenance" @update:modelValue="addEditMaintenanceDialog = $event" @save="saveMaintenance" />
      <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteMaintenance" @update:modelValue="deleteDialog = $event" /> -->
  
      <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="maintenanceHeaders" 
      :items="maintenanceList" :loading="loadingMaintenance">
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
          <v-icon class="ml-2" color="primary" dense @click="editMaintenance(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="deleteMaintenance(item.id)">mdi-delete</v-icon>
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
  import { useMaintenanceStore } from '@/stores/maintenance/maintenanceStore';
  import MaintenanceDetailsDialog from '@/components/maintenance/assetManagement/history/MaintenanceDetailsDialog.vue';
  import AddEditMaintenanceDialog from '@/components/maintenance/assetManagement/history/AddEditMaintenanceDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/assetManagement/history/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const maintenanceStore = useMaintenanceStore();
  const { maintenanceList, loading: loadingMaintenance } = storeToRefs(maintenanceStore);
  
  const search = ref('');
  const filterType = ref('');
  const page = ref(1);
  const itemsPerPage = ref(10);
  
  const maintenanceTypeOptions = ['Routine', 'Repair', 'Inspection'];

  const filtersAssets = ref<filterItem[]>([])
  
  const maintenanceDetailsDialog = ref(false);
  const addEditMaintenanceDialog = ref(false);
  const deleteDialog = ref(false);
  
  const selectedMaintenance = ref( {
    id: null,
    asset_id: null,
    asset_name: '',
    type: '',
    vin: '',
    maintenance_type: '',
    date: '',
    technician: '',
    description: '',
    parts_used: [],
    labor_cost: null,
    total_cost: null,
    status: '',
  });
  
  const openAddMaintenanceDialog = () => {
    selectedMaintenance.value = {
      id: null,
      asset_id: null,
      asset_name: '',
      type: '',
      vin: '',
      maintenance_type: '',
      date: '',
      technician: '',
      description: '',
      parts_used: [],
      labor_cost: null,
      total_cost: null,
      status: '',
    };
    addEditMaintenanceDialog.value = true;
  };
  
  const viewDetails = (maintenance: any) => {
    selectedMaintenance.value = maintenance;
    maintenanceDetailsDialog.value = true;
  };
  
  const editMaintenance = (maintenance: any) => {
    selectedMaintenance.value = maintenance;
    addEditMaintenanceDialog.value = true;
  };
  
  const confirmDelete = (id: number) => {
    selectedMaintenance.value = { 
      id: null,
      asset_id: null,
      asset_name: '',
      type: '',
      vin: '',
      maintenance_type: '',
      date: '',
      technician: '',
      description: '',
      parts_used: [],
      labor_cost: null,
      total_cost: null,
      status: '',
     };
    deleteDialog.value = true;
  };

  const layoutStore = useLayoutStore()
  const deleteMaintenance = async (id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this maintenance ?")

    if (confirm) {
      await maintenanceStore.deleteMaintenance(id);
    }
  };
  
  const saveMaintenance = async (maintenance: any) => {
    if (maintenance.id) {
      await maintenanceStore.updateMaintenance(maintenance);
    } else {
      await maintenanceStore.createMaintenance(maintenance);
    }
    addEditMaintenanceDialog.value = false;
  };
  
  const totalPages = computed(() => Math.ceil(maintenanceList.value.length / itemsPerPage.value));
  
  // const filteredMaintenance = computed(() => {
  //   return maintenanceList.value
  //     .filter(record => record.asset_name.toLowerCase().includes(search.value.toLowerCase()) || record.vin.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(record => !filterType.value || record.maintenance_type === filterType.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });

  const filteredMaintenance = computed(() => {
    return maintenanceList.value?.map(maintenance => {
      return { text: maintenance.asset_name, value: maintenance.id }
    }) || []
  })

  const filteredMaintenanceType = computed(() => {
    return maintenanceList.value?.map(maintenance => {
      return [maintenance.maintenance_type]
    }) || []
  })
  
  const maintenanceHeaders = [
    { title: 'Maintenance ID', key: 'id' },
    // { title: 'Asset ID', key: 'asset_id' },
    { title: 'Asset Name', key: 'asset_name' },
    { title: 'Type', key: 'type' },
    { title: 'VIN', key: 'vin' },
    { title: 'Maintenance Type', key: 'maintenance_type' },
    { title: 'Date', key: 'date' },
    { title: 'Technician', key: 'technician' },
    { title: 'Cost', key: 'total_cost' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Select Asset',
        key: 'id',
        items: filteredMaintenance.value as any,
        width: '300px',
      },
      {
        title: 'Maintenance Type',
        key: 'maintenance_type',
        items: filteredMaintenanceType,
        width: '300px',
      }
    ];
  }

  const getStatusClass = (maintenance: any) => {
    const maintenanceData = maintenanceList.value.find((data: any) => data.id === maintenance.id);
    if (maintenanceData?.status) {
      if (maintenanceData?.status === "Pending") {
          return 'green'; 
      } else if (maintenanceData?.status === "Completed") {
          return 'primary'; 
      } else if (maintenanceData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  
  onMounted(() => {
    maintenanceStore.fetchMaintenanceRecords();
  });

  watchEffect(() => {
    if (maintenanceList.value) {
      initializeFilters();
    }
  });
  </script>
  
  <style scoped>
  </style>
  