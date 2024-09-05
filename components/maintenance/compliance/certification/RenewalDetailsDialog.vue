<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Renewal Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Renewal ID:</strong> {{ renewal.id }}</td>
                <td class="text-h6"><strong>Vehicle:</strong> {{ renewal.vehicle_id }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th>Renewal Type</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ renewal.type }}</td>
                <td>{{ renewal.due_date }}</td>
                <td><v-chip :color="getStatusClass(renewal.status)">{{ renewal.status }}</v-chip></td>
                <td>{{ renewal.comments}}</td>
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
  import type { Renewal } from '@/types/maintenance/renewalTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    renewal: {
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
  