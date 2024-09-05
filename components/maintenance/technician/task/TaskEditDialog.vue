<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="taskForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Technician" :items="technicians" v-model="localTask.technicianId" item-title="name" item-value="id" required></v-select> 
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" label="Assigned Date" v-model="localTask.assignedDate" type="datetime-local" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" label="Due Date" v-model="localTask.dueDate" type="datetime-local" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Status" :items="['Pending', 'In Progress', 'Completed']" v-model="localTask.status" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Performance Metrics" v-model="localTask.performanceMetrics"></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Task Description" v-model="localTask.description" required></v-textarea>  
              </v-col>
              <v-col cols="12">
                <v-textarea variant="solo" flat density="compact" label="Notes" v-model="localTask.notes"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useTechniciansStore } from '@/stores/maintenance/techniciansStore';
  import type { Task } from '@/types/maintenance/maintenancetaskTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    task: {
      type: Object as any,
      default: () => ({
        id: null,
        technicianId: null,
        description: '',
        assignedDate: '',
        dueDate: '',
        status: 'Pending',
        performanceMetrics: '',
        notes: '',
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const techniciansStore = useTechniciansStore();
  const technicians = computed(() => techniciansStore.technicians);
  
  const localTask = ref<Task>({ ...props.task });
  
  const title = computed(() => (props.task && props.task.id ? 'Edit Task' : 'Assign Task'));
  
  watch(
    () => props.task,
    (newTask) => {
      localTask.value = { ...newTask };
    }
  );
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  const saveTask = () => {
    emit('save', localTask.value);
    emit('update:modelValue', false);
    emit('close');
  };
  </script>
  