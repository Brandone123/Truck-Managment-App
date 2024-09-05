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
                <td class="text-h6"><strong>Task Type:</strong> {{ task.task_type }}</td>
                <td class="text-h6"><strong>Asset Name:</strong> {{ task.asset_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <tbody>
              <tr>
                <td><strong>Scheduled Date and Time</strong></td>
                <td><strong>Technician</strong></td>
                <td><strong>Status</strong> </td>
                <td><strong>Type</strong></td>
                <td><strong>VIN</strong></td>
              </tr>
              <tr>
                <td>{{ task.scheduled_datetime }}</td>
                <td>{{ task.technician }}</td>
                <td><v-chip :color="getStatusClass(task.status)">{{ task.status }}</v-chip></td>
                <td>{{ task.task_type }}</td>
                <td>{{ task.vin }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Description of Task:</h4>
            <div class="ml-5 mt-3">{{ task.description }}</div>
          </div>
          <v-divider></v-divider>
          <v-table >
            <tbody>
              <tr>
                <td><strong>Notes: </strong> {{ task.notes }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    task: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };

  const getStatusClass = (status: any) => {
    if (status) {
      if (status === "Pending") {
          return 'green'; 
      } else if (status === "Completed") {
          return 'primary'; 
      } else if (status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  </script>
  
  <style scoped>
  </style>
  