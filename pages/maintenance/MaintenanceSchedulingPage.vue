<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h6">Maintenance Scheduling and Task Management</span>
        <v-btn color="primary" @click="openAddTaskDialog">Add Task</v-btn>
      </div>
  
      <TaskDetailsDialog :modelValue="taskDetailsDialog" :task="selectedTask" @update:modelValue="taskDetailsDialog = $event" />
      <AddEditTaskDialog :modelValue="addEditTaskDialog" :task="selectedTask" @update:modelValue="addEditTaskDialog = $event" @save="saveTask" />
      <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteTask" @update:modelValue="deleteDialog = $event" /> -->
  
      <v-row>
        <v-col cols="12">
          <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="taskHeaders" :items="taskList" :loading="loadingTasks">
            <template v-slot:item.actions="{ item }">
              <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
              <v-icon class="ml-2" color="primary" dense @click="editTask(item)">mdi-pencil</v-icon>
              <v-icon class="ml-2" color="red" dense @click="deleteTask(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusClass(item)"  size="small">
                {{ item.status }}
              </v-chip>
            </template>
          </SharedUiCustomTable>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div>
            <v-card-title class="text-h6 font-weight-bold text-primary px-0">Schedule Task</v-card-title>
          </div>
          <v-card>
            <v-card-text>
              <CalendarView :tasks="taskList" @task-click="viewDetails" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useTaskStore } from '@/stores/maintenance/taskStore';
  import CalendarView from '@/components/maintenance/services/scheduling/CalendarView.vue';
  import TaskDetailsDialog from '@/components/maintenance/services/scheduling/TaskDetailsDialog.vue';
  import AddEditTaskDialog from '@/components/maintenance/services/scheduling/AddEditTaskDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/services/scheduling/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const taskStore = useTaskStore();
  const { taskList, loading: loadingTasks } = storeToRefs(taskStore);
  
  const search = ref('');
  const filterType = ref('');
  const page = ref(1);
  const itemsPerPage = ref(10);
  
  const taskTypeOptions = ['Routine', 'Repair', 'Inspection'];
  
  const taskDetailsDialog = ref(false);
  const addEditTaskDialog = ref(false);
  const deleteDialog = ref(false);
  
  const selectedTask = ref({
    id: null,
    asset_id: null,
    asset_name: '',
    type: '',
    vin: '',
    task_type: '',
    scheduled_datetime: '', 
    technician: '',
    description: '',
    status: '',
    notes: '',
  });
  const filtersAssets = ref<filterItem[]>([]);
  
  const openAddTaskDialog = () => {
    selectedTask.value = {
      id: null,
      asset_id: null,
      asset_name: '',
      type: '',
      vin: '',
      task_type: '',
      scheduled_datetime: '', 
      technician: '',
      description: '',
      status: '',
      notes: '',
    };
    addEditTaskDialog.value = true;
  };
  
  const viewDetails = (task: any) => {
    selectedTask.value = task;
    taskDetailsDialog.value = true;
  };
  
  const editTask = (task: any) => {
    selectedTask.value = task;
    addEditTaskDialog.value = true;
  };
  
  const confirmDelete = (id: any) => {
    selectedTask.value = { ...id };
    deleteDialog.value = true;
  };

  const layoutStore = useLayoutStore()
  const deleteTask = async (id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this task ?")

    if (confirm) {
      await taskStore.deleteTask(id);
    }
  };
  
  const saveTask = async (task: any) => {
    if (task.id) {
      await taskStore.updateTask(task);
    } else {
      await taskStore.createTask(task);
    }
    addEditTaskDialog.value = false;
  };
  
  // const filteredTasks = computed(() => {
  //   return taskList.value
  //     .filter(task => task.asset_name.toLowerCase().includes(search.value.toLowerCase()) || task.task_id.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(task => !filterType.value || task.task_type === filterType.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });
  
  const taskHeaders = [
    // { title: 'Task ID', key: 'task_id' },
    { title: 'Asset ID', key: 'asset_id' },
    { title: 'Asset Name', key: 'asset_name' },
    { title: 'Task Type', key: 'task_type' },
    { title: 'Scheduled Date and Time', key: 'scheduled_datetime' },
    { title: 'Technician', key: 'technician' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  const filteredTasks = computed(() => {
    return taskList.value?.map(task => {
      return [task.task_type]
    }) || []
  })

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Filter by Task Type',
        key: 'task_type',
        items: ['Routine', 'Repair', 'Inspection'],
        width: '300px',
      },
    ];
  }

  const getStatusClass = (schedule: any) => {
    const scheduleData = taskList.value.find((data: any) => data.id === schedule.id);
    if (scheduleData?.status) {
      if (scheduleData?.status === "Pending") {
          return 'green'; 
      } else if (scheduleData?.status === "Completed") {
          return 'primary'; 
      } else if (scheduleData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  
  onMounted(() => {
    taskStore.fetchTasks();
  });

  watchEffect(() => {
    if (taskList.value) {
      initializeFilters();
    }
  });
  </script>
  
  <style scoped>
  </style>
  