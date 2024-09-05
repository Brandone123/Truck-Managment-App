<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Asset Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Asset ID:</strong> {{ asset.id }}</td>
                <td class="text-h6"><strong>Name:</strong> {{ asset.name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th><strong>Type</strong></th>
                <th><strong>VIN</strong></th>
                <th><strong>Make/Model</strong></th>
                <th><strong>Year</strong></th>
                <th><strong>Status</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {{ asset.type }}</td>
                <td> {{ asset.vin }}</td>
                <td> {{ asset.make_model }}</td>
                <td> {{ asset.year }}</td>
                <td><v-chip :color="getStatusClass(asset.status)">{{ asset.status }}</v-chip> </td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <LifecycleStageTimeline :asset="asset" />
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
  import LifecycleStageTimeline from '@/components/maintenance/assetManagement/lifeCycle/LifecycleStageTimeline.vue';
  
  const props = defineProps({
    modelValue: Boolean,
    asset: {
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

  const getStatusClass = (status: any) => {
    if (status) {
      if (status === "Maintenance") {
          return 'green'; 
      } else if (status === "Active") {
          return 'primary'; 
      } else if (status === "Inactive") {
          return 'error'
      }
    }
    return '';
  }
  </script>
  
  <style scoped>
  </style>
  