<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Reminder Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Reminder ID:</strong> {{ reminder.id }}</td>
                <td class="text-h6"><strong>Vehicle Name:</strong> {{ reminder.vehicle_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Maintenance Type</strong></th>
                <th><strong>Due Date</strong></th>
                <th><strong>Description</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ reminder.maintenance_type }}</td>
                <td>{{ reminder.due_date }}</td>
                <td>{{ reminder.description }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <tbody>
              <tr v-for="(attachment, index) in reminder.attachments" :key="index">
                <td><strong>Attachment: </strong> {{ attachment.name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Notes:</h4>
            <div class="ml-5 mt-3">{{ reminder.notes }}</div>
          </div>
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
    reminder: {
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
  </script>
  
  <style scoped>
  </style>
  