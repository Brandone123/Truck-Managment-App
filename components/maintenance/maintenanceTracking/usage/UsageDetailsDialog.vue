<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Usage Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Usage ID:</strong> {{ log.id }}</td>
                <td class="text-h6"><strong>Vehicle Name:</strong> {{ log.vehicle_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <tbody>
              <tr>
                <td><strong>Usage Type</strong></td>
                <td><strong>Date</strong></td>
                <td><strong>Meter Reading</strong></td>
                <td><strong>Cost</strong> </td>
              </tr>
              <tr>
                <td>{{ log.usage_type }}</td>
                <td>{{ log.date }}</td>
                <td>{{ log.meter_reading }}</td>
                <td>{{ log.cost }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-table>
            <tbody>
              <tr v-for="(attachment, index) in log.attachments" :key="index">
                <td><strong>Attachment: </strong> {{ attachment.name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Notes:</h4>
            <div class="ml-5 mt-3">{{ log.notes }}</div>
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
    log: {
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
  