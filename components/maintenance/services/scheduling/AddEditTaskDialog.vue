<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable width="800px">
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
                <v-text-field v-model="localTask.asset_name" label="Asset Name" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localTask.task_type" :items="['Routine', 'Repair', 'Inspection']" label="Task Type" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localTask.scheduled_datetime" label="Scheduled Date and Time" type="datetime-local" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localTask.technician" label="Technician" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localTask.status" :items="['Pending', 'In Progress', 'Completed']" label="Status" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localTask.description" label="Description of Task" variant="solo" flat density="compact" required></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    task: {
      type: Object,
      default: () => ({
        asset_name: '',
        task_type: '',
        scheduled_datetime: '',
        technician: '',
        description: '',
        status: 'Pending',
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const localTask = ref({ ...props.task });
  
  watch(
    () => props.task,
    (newTask) => {
      localTask.value = { ...newTask };
    }
  );
  
  const title = computed(() => (props.task && props.task.id ? 'Edit Task' : 'Add Task'));
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveTask = () => {
    emit('save', localTask.value);
    emit('update:modelValue', false);
  };
  </script>
  
  <style scoped>
  </style>
  