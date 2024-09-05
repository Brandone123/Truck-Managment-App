<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Report Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-h6"><strong>Report ID: </strong>{{ report.id }}</th>
                <th class="text-h6"><strong>Generated Date: </strong>{{ report.generatedDate }}</th>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Report Name</strong></th>
                <th><strong>Report Type</strong></th>
                <th><strong>Status</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ report.name }}</td>
                <td>{{ report.type }}</td>
                <td><v-chip :color="getStatusClass(report.status)">{{ report.status }}</v-chip></td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Summary:</h4>
            <div class="ml-5 mt-3">{{ report.summary }}</div>
          </div>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Notes:</h4>
            <div class="ml-5 mt-3">{{ report.notes }}</div>
          </div>
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
  import type { Report } from '@/types/maintenance/reportTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    report: {
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
      }
    }
    return '';
  }
  </script>
  