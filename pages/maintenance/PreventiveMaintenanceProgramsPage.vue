<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h6">Preventive Maintenance Programs</span>
        <v-btn color="primary" @click="openAddDialog">Add Program</v-btn>
      </div>
  
      <ProgramDetailsDialog :modelValue="detailsDialog" :program="selectedProgram" @update:modelValue="detailsDialog = $event" />
      <AddEditProgramDialog :modelValue="addEditDialog" :program="selectedProgram" @update:modelValue="addEditDialog = $event" @save="saveProgram" />
      <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteProgram" @update:modelValue="deleteDialog = $event" /> -->
  
      <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="tableHeaders" :items="programList" :loading="loading">
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
          <v-icon class="ml-2" color="primary" dense @click="editProgram(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="deleteProgram(item.id)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useProgramStore } from '@/stores/maintenance/programStore';
  import ProgramDetailsDialog from '@/components/maintenance/preventiveManagement/maintenanceProgram/ProgramDetailsDialog.vue';
  import AddEditProgramDialog from '@/components/maintenance/preventiveManagement/maintenanceProgram/AddEditProgramDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/preventiveManagement/maintenanceProgram/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const store = useProgramStore();
  const { programList, loading } = storeToRefs(store);
  
  const search = ref('');
  const filterType = ref('');
  
  const typeOptions = ['Routine', 'Inspection'];
  const filtersAssets = ref<filterItem[]>([]);
  
  const detailsDialog = ref(false);
  const addEditDialog = ref(false);
  const deleteDialog = ref(false);
  
  const selectedProgram = ref( {
    id: null,
    name: '',
    vehicle_id: null,
    vehicle_name: '',
    maintenance_type: '',
    recurrence: '',
    next_scheduled_date: '',
    description: '',
    attachments: [],
  });
  
  const openAddDialog = () => {
    selectedProgram.value = {
      id: null,
      name: '',
      vehicle_id: null,
      vehicle_name: '',
      maintenance_type: '',
      recurrence: '',
      next_scheduled_date: '',
      description: '',
      attachments: [],
    };
    addEditDialog.value = true;
  };
  
  const viewDetails = (program: any) => {
    selectedProgram.value = program;
    detailsDialog.value = true;
  };
  
  const editProgram = (program: any) => {
    selectedProgram.value = program;
    addEditDialog.value = true;
  };
  
  const confirmDelete = (id: any) => {
    selectedProgram.value = { ...id };
    deleteDialog.value = true;
  };
  

const layoutStore = useLayoutStore()
const deleteProgram = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this program ?")

  if (confirm) {
    await store.deleteProgram(id);
  }
};
  
  const saveProgram = async (program: any) => {
    if (program.id) {
      await store.updateProgram(program);
    } else {
      await store.createProgram(program);
    }
    addEditDialog.value = false;
  };
  
  // const filteredPrograms = computed(() => {
  //   return programList.value
  //     .filter(program => program.name.toLowerCase().includes(search.value.toLowerCase()) || program.id.toString().includes(search.value.toLowerCase()))
  //     .filter(program => !filterType.value || program.maintenance_type === filterType.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });
  
  const tableHeaders = [
    { title: 'Program ID', key: 'id' },
    { title: 'Program Name', key: 'name' },
    { title: 'Vehicle ID', key: 'vehicle_id' },
    { title: 'Vehicle Name', key: 'vehicle_name' },
    { title: 'Maintenance Type', key: 'maintenance_type' },
    { title: 'Recurrence', key: 'recurrence' },
    { title: 'Next Scheduled Date', key: 'next_scheduled_date' },
    { title: 'Actions', key: 'actions' },
  ];

  const filteredPrograms = computed(() => {
    return programList.value?.map(task => {
      return [task.maintenance_type]
    }) || []
  })

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

  onMounted(() => {
    store.fetchPrograms();
  });

  watchEffect(() => {
    if (programList.value) {
      initializeFilters();
    }
  });
  </script>
  
  <style scoped>
  </style>
  