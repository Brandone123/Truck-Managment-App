<template>
    <div>
      <div class="d-flex justify-space-between mb-4">
        <span class="text-primary text-h6">Maintenance Compliance Management</span>
        <v-btn color="primary" @click="openAddComplianceTaskDialog">Add Compliance Task</v-btn>
      </div>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="card-1 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#CE0053">mdi-clipboard-check-outline</v-icon>
                <span>Total Compliance Tasks</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ complianceSummary.totalTasks }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="card-2 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
                <span>Tasks Pending</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ complianceSummary.tasksPending }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="card-3 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
                <span>Tasks Completed</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ complianceSummary.tasksCompleted }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <ComplianceTasksTable @view="viewComplianceTask" @edit="editComplianceTask"
            @delete="deleteComplianceTask" />
        </v-col>
      </v-row>
  
      <ComplianceTaskDetailsDialog :modelValue="detailsDialog" :task="selectedComplianceTask" @update:modelValue="detailsDialog = $event" />
      <ComplianceTaskEditDialog :modelValue="editDialog" :task="selectedComplianceTask" @update:modelValue="editDialog = $event" @save="saveComplianceTask" />
      <DeleteComplianceTaskDialog :modelValue="deleteDialog" @confirm="confirmDeleteComplianceTask" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import ComplianceTasksTable from '@/components/maintenance/compliance/maintenance/ComplianceTasksTable.vue';
  import ComplianceTaskDetailsDialog from '@/components/maintenance/compliance/maintenance/ComplianceTaskDetailsDialog.vue';
  import ComplianceTaskEditDialog from '@/components/maintenance/compliance/maintenance/ComplianceTaskEditDialog.vue';
  import DeleteComplianceTaskDialog from '@/components/maintenance/compliance/maintenance/DeleteComplianceTaskDialog.vue';
  import { useComplianceTasksStore } from '@/stores/maintenance/complianceTasksStore';
  import type { ComplianceTask } from '@/types/maintenance/complianceTaskTypes';
  
  const complianceTasksStore = useComplianceTasksStore();
  const search = ref('');
  const detailsDialog = ref(false);
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  const selectedComplianceTask = ref<ComplianceTask | null>(null);
  
  const complianceSummary = computed(() => complianceTasksStore.complianceSummary);
  
  onMounted(() => {
    complianceTasksStore.fetchComplianceTasks();
  });
  
  const openAddComplianceTaskDialog = () => {
    selectedComplianceTask.value = null;
    editDialog.value = true;
  };
  
  const viewComplianceTask = (task: ComplianceTask) => {
    selectedComplianceTask.value = task;
    detailsDialog.value = true;
  };
  
  const editComplianceTask = (task: ComplianceTask) => {
    selectedComplianceTask.value = task;
    editDialog.value = true;
  };
  
  const deleteComplianceTask = (task: ComplianceTask) => {
    selectedComplianceTask.value = task;
    deleteDialog.value = true;
  };
  
  const saveComplianceTask = (task: ComplianceTask) => {
    if (task.id) {
      complianceTasksStore.updateComplianceTask(task);
    } else {
      complianceTasksStore.createComplianceTask(task);
    }
    editDialog.value = false;
  };
  
  const confirmDeleteComplianceTask = () => {
    if (selectedComplianceTask.value) {
      complianceTasksStore.deleteComplianceTask(selectedComplianceTask.value.id as number);
    }
    deleteDialog.value = false;
  };
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
  