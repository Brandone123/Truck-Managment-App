<template>
    <div>
      <div class="d-flex justify-space-between mb-4">
        <span class="text-primary text-h6">Technician Task Assignment and Performance Tracking</span>
        <v-btn color="primary" @click="openAssignTaskDialog">Assign Task</v-btn>
      </div>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="card-1 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#CE0053">mdi-clipboard-check-outline</v-icon>
                <span>Total Tasks</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ taskSummary.totalTasks }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="card-2 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
                <span>Tasks In Progress</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ taskSummary.tasksInProgress }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="card-3 text-center">
            <v-card-text>
              <v-card-title class="justify-space-between">
                <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
                <span>Completed Tasks</span>
              </v-card-title>
              <v-card-text>
                <span class="font-weight-bold text-h6">{{ taskSummary.completedTasks }}</span>
              </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <TasksTable @view="viewTask" @edit="editTask" @delete="deleteTask" />
        </v-col>
      </v-row>
  
      <TaskDetailsDialog :modelValue="detailsDialog" :task="selectedTask" @update:modelValue="detailsDialog = $event" />
      <TaskEditDialog :modelValue="editDialog" :task="selectedTask" @update:modelValue="editDialog = $event" @save="saveTask" />
      <DeleteTaskDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event" @confirm="confirmDeleteTask" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import TasksTable from '@/components/maintenance/technician/task/TasksTable.vue';
  import TaskDetailsDialog from '@/components/maintenance/technician/task/TaskDetailsDialog.vue';
  import TaskEditDialog from '@/components/maintenance/technician/task/TaskEditDialog.vue';
  import DeleteTaskDialog from '@/components/maintenance/technician/task/DeleteTaskDialog.vue';
  import { useTasksStore } from '@/stores/maintenance/maintenancetasksStore';
  import type { Task } from '@/types/maintenance/maintenancetaskTypes';
  
  const tasksStore = useTasksStore();
  const search = ref('');
  const detailsDialog = ref(false);
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  const selectedTask = ref<Task | null>(null);
  
  const taskSummary = computed(() => tasksStore.taskSummary);
  
  onMounted(() => {
    tasksStore.fetchTasks();
  });
  
  const openAssignTaskDialog = () => {
    selectedTask.value = null;
    editDialog.value = true;
  };
  
  const viewTask = (task: Task) => {
    selectedTask.value = task;
    detailsDialog.value = true;
  };
  
  const editTask = (task: Task) => {
    selectedTask.value = task;
    editDialog.value = true;
  };
  
  const deleteTask = (task: Task) => {
    selectedTask.value = task;
    deleteDialog.value = true;
  };
  
  const saveTask = (task: Task) => {
    if (task.id) {
      tasksStore.updateTask(task);
    } else {
      tasksStore.createTask(task);
    }
    editDialog.value = false;
  };
  
  const confirmDeleteTask = () => {
    if (selectedTask.value) {
      tasksStore.deleteTask(selectedTask.value.id as number);
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
  