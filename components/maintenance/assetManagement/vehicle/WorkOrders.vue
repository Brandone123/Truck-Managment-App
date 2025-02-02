<template>
     <WorkOrderDetailsDialog :modelValue="workOrderDetailsDialog" :workOrder="selectedWorkOrder"
        @update:modelValue="workOrderDetailsDialog = $event" @close="closeWorkOrderDetailsDialog" />

    <SharedUiCustomTable :show-footer-in-head="false" show-select :filters="filterAssets" :headers="tableHeaders" :items="workOrders"
      :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="viewWorkOrder(item)">mdi-eye</v-icon>
      </template>
  
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)">
          {{ item.status }}
        </v-chip>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { filterItem } from '~/types/layout/table';
  import WorkOrderDetailsDialog from '@/components/maintenance/management/workOrder/WorkOrderDetailsDialog.vue';
  
  const workOrderStore = useWorkOrderStore();
  const { workOrders, loading } = storeToRefs(workOrderStore);
  
  const tableHeaders = [
    { title: 'Work Order ID', key: 'id' },
    { title: 'Date Created', key: 'date_created' },
    { title: 'Vehicle ID', key: 'vehicleId' },
    { title: 'Issue/PM Service', key: 'issueOrPmService' },
    { title: 'Assigned Technician', key: 'assignedTechnician' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'primary';
      case 'in progress':
        return 'secondary';
      case 'open':
        return 'grey'
    }
  }
  
  const filterAssets = computed(() => {
    return [
      {
        title: 'Status',
        key: 'status',
        items: ['Open', 'In Progress', 'Completed'],
        width: '300px',
      },
    ] as filterItem[]
  })

  const workOrderDetailsDialog = ref(false);

const selectedWorkOrder = ref({
    id: null,
    date_created: '',
    vehicleId: '',
    issueOrPmService: '',
    assignedTechnician: '',
    status: '',
    line_items: [],
    comments: [],
    activityLog: [],
});

const viewWorkOrder = (workOrder: any) => {
    selectedWorkOrder.value = workOrder;
    workOrderDetailsDialog.value = true;
};

const closeWorkOrderDetailsDialog = () => {
  workOrderDetailsDialog.value = false;
};

  </script>