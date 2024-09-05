<template>
     <InspectionDetailsDialog :modelValue="inspectionDetailsDialog" :inspection="selectedInspection"
     @update:modelValue="inspectionDetailsDialog = $event" @close="closeInspectionDetailsDialog"/>

    <SharedUiCustomTable show-select :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders"
      :items="filteredInspections" :loading="loadingInspections">
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status.toLowerCase() == 'passed' ? 'primary' : 'error'">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="viewInspection(item)">mdi-eye</v-icon>
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
  import { ref, computed } from 'vue';
  import type { Inspection } from '@/types/maintenance/inspection';
  import type { filterItem } from '~/types/layout/table';
  import { useInspectionStore } from '@/stores/maintenance/inspection';
  import InspectionDetailsDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionDetailsDialog.vue';

  const inspectionStore = useInspectionStore();
  
  const { inspections, loading: loadingInspections } = storeToRefs(inspectionStore);
  
  const search = ref('');
  
  const tableHeaders = [
    { title: 'Inspection ID', key: 'id' },
    { title: 'Date and Time', key: 'date' },
    { title: 'Driver Name', key: 'driver' },
    { title: 'Vehicle ID', key: 'vehicle' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  
  const filteredInspections = computed(() => {
    return inspections.value.filter((inspection) => {
      const idMatch = String(inspection.id).includes(search.value);
      const driverMatch = inspection.driver.toLowerCase().includes(search.value.toLowerCase());
      const vehicleMatch = inspection.vehicle.toLowerCase().includes(search.value.toLowerCase());
      const typeMatch = inspection.type.toLowerCase().includes(search.value.toLowerCase());
      const statusMatch = inspection.status.toLowerCase().includes(search.value.toLowerCase());
      return idMatch || driverMatch || vehicleMatch || typeMatch || statusMatch;
    });
  });
  
  const filterAssets = computed(() => {
    return [
      {
        title: 'Status',
        key: 'status',
        items: ['Passed', 'Failed', 'Pending'],
        width: '300px',
      },
      {
        title: 'Inspection Type',
        key: 'type',
        items: ['Daily', 'Pre-Trip', 'Post-Trip'],
        width: '300px',
      },
    ] as filterItem[]
  })

  const inspectionDetailsDialog = ref(false);
const selectedInspection = ref({
    id: null,
    driver: '',
    vehicle: '',
    type: '',
    date: '',
    status: '',
    results: []
});

const viewInspection = (inspection: any) => {
    selectedInspection.value = inspection;
    inspectionDetailsDialog.value = true;
};

const closeInspectionDetailsDialog = () => {
    inspectionDetailsDialog.value = false;
  };

  onMounted(() => {
    inspectionStore.fetchInspections()
  })
  </script>