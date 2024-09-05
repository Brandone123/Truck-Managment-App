<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Program Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Program Name:</strong> {{ program.name }}</td>
                <td class="text-h6"><strong>Vehicle Name:</strong> {{ program.vehicle_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Maintenance Type</strong></th>
                <th><strong>recurrence</strong></th>
                <th><strong>Next Scheduled Date</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ program.maintenance_type }}</td>
                <td>{{ program.recurrence }}</td>
                <td>{{ program.next_scheduled_date }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-table>
            <tbody>
              <tr v-for="(attachment, index) in program.attachments" :key="index">
                <td><strong>Attachment: </strong> {{ attachment.name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Description:</h4>
            <div class="ml-5 mt-3">{{ program.description }}</div>
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
    program: {
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
  