<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Analytic Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-h6"><strong>Analytic ID: </strong>{{ analytic.id }}</th>
                <th class="text-h6"><strong>Generated Date: </strong>{{ analytic.generatedDate }}</th>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Analytic Name</strong></th>
                <th><strong>Analytic Type</strong></th>
                <th><strong>Status</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ analytic.name }}</td>
                <td>{{ analytic.type }}</td>
                <td>{{ analytic.status }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-card-text>
            <p><strong>Summary:</strong></p>
            <p>{{ analytic.summary }}</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <p><strong>Notes:</strong></p>
            <p>{{ analytic.notes }}</p>
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
  import type { Analytic } from '@/types/maintenance/analyticsTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    analytic: {
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
  </script>
  