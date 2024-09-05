<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Issue Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Issue ID:</strong> {{ issue.id }}</td>
                <td class="text-h6"><strong>Vehicle:</strong> {{ issue.vehicle_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th>Issue Description</th>
                <th>Reported Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ issue.description }}</td>
                <td>{{ issue.reported_date }}</td>
                <td><v-chip :color="getStatusClass(issue.status)">{{ issue.status }}</v-chip></td>
                <td>{{ issue.priority }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-table>
            <tbody>
              <tr v-for="(attachment, index) in issue.attachments" :key="index">
                <td><strong>Attachment: </strong> {{ attachment.name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Notes:</h4>
            <div class="ml-5 mt-3">{{ issue.notes }}</div>
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
  import type { Issue } from '~/types/maintenance/issueTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    issue: {
      type: Object as any,
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
      if (status === "Resolved") {
          return 'green'; 
      } else if (status === "Open") {
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
  