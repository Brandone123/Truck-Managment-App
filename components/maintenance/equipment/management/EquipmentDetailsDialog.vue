<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Equipment Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-h6"><strong>Equipment ID: </strong>{{ equipment.id }}</th>
                <th class="text-h6"><strong>Equipment Name: </strong>{{ equipment.name }}</th>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Type</strong></th>
                <th><strong>Status</strong></th>
                <th><strong>Location</strong></th>
                <th><strong>Purchase Date</strong></th>
                <th><strong>Last Service Date</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ equipment.type }}</td>
                <td>{{ equipment.status }}</td>
                <td>{{ equipment.location }}</td>
                <td>{{ equipment.purchase_date }}</td>
                <td>{{ equipment.last_service_date }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider class="mt-4"></v-divider>
          <v-card-title>Description</v-card-title>
          <v-card-text>{{ equipment.description }}</v-card-text>
          <v-divider class="mt-4"></v-divider>
          <v-card-title>Notes</v-card-title>
          <v-card-text>{{ equipment.notes }}</v-card-text>
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
  import type { Equipment } from '@/types/maintenance/equipmentTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    equipment: {
      type: Object as () => Equipment,
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
  