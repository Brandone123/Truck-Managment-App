<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Telematics Data Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-h6"><strong>Data ID: </strong>{{ data.id }}</th>
                <th class="text-h6"><strong>Date: </strong>{{ data.data_value.date }}</th>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Vehicle Name</strong></th>
                <th><strong>Device ID</strong></th>
                <th><strong>Data Type</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ data.vehicle_id }}</td>
                <td>{{ data.telematics_equipment_id }}</td>
                <td>{{ data.data_type }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-card-text>
            <p><strong>Location:</strong> {{ data.data_value.location }}</p>
            <p><strong>Engine Status:</strong> {{ data.data_value.engine_status }}</p>
            <p><strong>Engine Oil Level:</strong> {{ data.data_value.engine_oil_level }}</p>
            <p><strong>Mileage:</strong> {{ data.data_value.mileage }}</p>
          </v-card-text>
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
  import type { TelematicsData } from '@/types/maintenance/telematicsTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    data: {
      type: Object as () => TelematicsData,
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
  