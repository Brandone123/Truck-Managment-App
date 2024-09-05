<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Schedule Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Program Name:</strong> {{ schedule.program_name }}</td>
                <td class="text-h6"><strong>Vehicle Name:</strong> {{ schedule.vehicle_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Scheduled Date</strong></th>
                <th><strong>Status</strong></th>
                <th><strong>Maintenance Type</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ schedule.scheduled_date }}</td>
                <td><v-chip :color="getStatusClass(schedule.status)">{{ schedule.status }}</v-chip></td>
                <td>{{ schedule.maintenance_type }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Description:</h4>
            <div class="ml-5 mt-3">{{ schedule.description }}</div>
          </div>
          <v-divider></v-divider>
          <v-table>
            <tbody>
              <tr v-for="(attachment, index) in schedule.attachments" :key="index">
                <td>{{ attachment.name }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="schedule.status != 'Completed'" color="primary" @click="markCompleted">Mark as Completed</v-btn>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    schedule: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'mark-completed']);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const markCompleted = () => {
    emit('mark-completed', props.schedule);
    emit('update:modelValue', false);
  };

  const getStatusClass = (status: any) => {
    if (status) {
      if (status === "Scheduled") {
          return 'green'; 
      } else if (status === "Completed") {
          return 'primary'; 
      } else if (status === "Overdue") {
          return 'error'
      }
    }
    return '';
  }
  </script>
  
  <style scoped>
  </style>
  