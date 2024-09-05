<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Inspection Record Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-h6"><strong>Record ID: </strong>{{ inspectionRecord.id }}</th>
                <th class="text-h6"><strong>Date: </strong>{{ inspectionRecord.date }}</th>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Vehicle/Equipment Name</strong></th>
                <th><strong>Inspection Type</strong></th>
                <th><strong>Status</strong></th>
                <th><strong>Inspector</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ inspectionRecord.vehicleEquipmentName }}</td>
                <td>{{ inspectionRecord.inspectionType }}</td>
                <td>{{ inspectionRecord.status }}</td>
                <td>{{ inspectionRecord.inspector }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-card-subtitle>Inspection Summary</v-card-subtitle>
          <v-card-text>{{ inspectionRecord.summary }}</v-card-text>
          <v-card-subtitle>Notes</v-card-subtitle>
          <v-card-text>{{ inspectionRecord.notes }}</v-card-text>
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
  import type { InspectionRecord } from '@/types/maintenance/inspectionRecords';
  
  const props = defineProps({
    modelValue: Boolean,
    inspectionRecord: {
      type: Object as () => InspectionRecord,
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
  