<template>
  <div>
    <div class="d-flex justify-space-between ">
      <span class="text-primary text-h6">Service Tasks</span>
      <v-btn color="primary" @click="openAddServiceTaskDialog">Add Service Task</v-btn>
    </div>

    <ServiceTaskDetailsDialog :modelValue="serviceTaskDetailsDialog" :serviceTask="selectedServiceTask"
      @update:modelValue="serviceTaskDetailsDialog = $event" />
    <AddEditServiceDialog :modelValue="addEditServiceTaskDialog" :serviceTask="selectedServiceTask"
      @update:modelValue="addEditServiceTaskDialog = $event" @save="saveServiceTask" />
    <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteServiceTask"
      @update:modelValue="deleteDialog = $event" /> -->

    <v-row class="mt-5 mb-10">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
              <span>Total Pending</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">0</span>
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
              <span class="font-weight-bold text-h6">0</span>
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
              <span class="font-weight-bold text-h6">0</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <SharedUiCustomTable :filters="filteredAssets" :showFooterInHead="false" :headers="serviceTaskHeaders"
      :items="serviceTaskList" :loading="loadingWorkOrders">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="editWorkOrder(item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="deleteServiceTask(item.id)">mdi-delete</v-icon>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useServiceTaskStore } from '~/stores/maintenance/serviceTaskStore';
import ServiceTaskDetailsDialog from '@/components/maintenance/services/tasks/ServiceTaskDetailsDialog.vue';
import AddEditServiceDialog from '@/components/maintenance/services/tasks/AddEditServiceTaskDialog.vue';
import DeleteConfirmationDialog from '@/components/maintenance/services/tasks/DeleteConfirmationDialog.vue';
import type { filterItem } from '~/types/layout/table';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList, loading: loadingWorkOrders } = storeToRefs(serviceTaskStore);

const serviceTaskDetailsDialog = ref(false);
const addEditServiceTaskDialog = ref(false);
const deleteDialog = ref(false);

const selectedServiceTask = ref<Partial<ServiceTask>>({} as Partial<ServiceTask>);

const openAddServiceTaskDialog = () => {
  selectedServiceTask.value = {} as Partial<ServiceTask>;
  addEditServiceTaskDialog.value = true;
};

const viewDetails = (serviceTask: any) => {
  selectedServiceTask.value = serviceTask;
  serviceTaskDetailsDialog.value = true;
};

const editWorkOrder = (serviceTask: any) => {
  selectedServiceTask.value = serviceTask;
  addEditServiceTaskDialog.value = true;
};

const confirmDelete = (id: any) => {
  selectedServiceTask.value = { ...id };
  deleteDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteServiceTask = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this service task ?")

  if (confirm) {
    await serviceTaskStore.deleteServiceTask(id);
  }
};

const saveServiceTask = async (serviceTask: any) => {
  if (serviceTask.id) {
    await serviceTaskStore.updateServiceTask(serviceTask);
  } else {
    await serviceTaskStore.createServiceTask(serviceTask);
  }
  addEditServiceTaskDialog.value = false;
};

const serviceTaskHeaders = [
  { title: 'Service Task ID', key: 'id' },
  { title: 'Name', key: 'name' },
  // { title: 'Description', key: 'description' },
  { title: 'Expected Labor Hours', key: 'expected_labor_hours' },
  { title: 'Categories', key: 'categories' },
  // { title: 'Work Order', key: 'work_order' },
  { title: 'Actions', key: 'actions' },
];

const assetList = computed(() => {
  return serviceTaskList?.value?.map((task: ServiceTask) => {
    return { text: task.name, value: task.id }
  }) || []
})

const filteredAssets = computed(() => {
  return [
    {
      title: 'Select Asset',
      key: 'id',
      items: assetList.value as any,
      width: '300px',
    },
    // {
    //   title: 'Select Categorie',
    //   key: 'categories',
    //   items: ['Open', 'In Progress', 'Closed'],
    //   width: '300px',
    // }
  ] as filterItem[]
})

onMounted(() => {
  serviceTaskStore.fetchServiceTasks();
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