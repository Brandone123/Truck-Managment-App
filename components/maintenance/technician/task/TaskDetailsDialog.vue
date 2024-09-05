<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Task Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Task ID:</strong> {{ task.id }}</td>
                <td class="text-h6"><strong>Technician Name:</strong> {{ task.technicianName }} ({{ task.technicianId }})</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th>Task Description</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Performance Metrics</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ task.description }}</td>
                <td>{{ task.assignedDate }}</td>
                <td>{{ task.dueDate }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.performanceMetrics }}</td>
                <td>{{ task.notes }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import type { Task } from '@/types/maintenance/maintenancetaskTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    task: {
      type: Object as any,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  </script>
  