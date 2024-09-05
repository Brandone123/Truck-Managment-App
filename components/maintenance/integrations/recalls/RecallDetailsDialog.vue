<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Recall Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <!-- <td><strong>Recall ID:</strong> {{ recall.recallId }}</td> -->
                <td><strong>Vehicle ID:</strong> {{ recall.vehicle_id }}</td>
                <td><strong>Make:</strong> {{ recall.vehicle?.make }}</td>
                <td><strong>Model:</strong> {{ recall.vehicle?.model }}</td>
                <td><strong>Year:</strong> {{ recall.vehicle?.year }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-table>
            <tbody>
              <tr>
                <!-- <td><strong>Recall Date:</strong> {{ recall.recallDate }}</td> -->
                <td><strong>Status:</strong> {{ recall.status }}</td>
              </tr>
              <tr>
                <td colspan="2"><strong>Description:</strong> {{ recall.description }}</td>
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
  import type { Recall } from '@/types/maintenance/recallsTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    recall: {
      type: Object as () => Recall,
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
  