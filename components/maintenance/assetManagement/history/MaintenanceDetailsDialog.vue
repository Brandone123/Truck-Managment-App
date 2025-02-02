<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Maintenance Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Asset ID:</strong> {{ maintenance.id }}</td>
                <td class="text-h6"><strong>Asset Name:</strong> {{ maintenance.asset_name }}</td>
                <td class="text-h6"><strong>Technician:</strong> {{ maintenance.technician }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <td><strong>Maintenance Type</strong></td>
                <td><strong>Date</strong></td>
                <td><strong>Status</strong></td>
                <td><strong>Type</strong></td>
                <td><strong>VIN</strong></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {{ maintenance.maintenance_type }}</td>
                <td> {{ maintenance.date }}</td>
                <td><v-chip :color="getStatusClass(maintenance.status)">{{ maintenance.status }}</v-chip></td>
                <td> {{ maintenance.type }}</td>
                <td> {{ maintenance.vin }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Description of Work:</h4>
            <div class="ml-5 mt-3">{{ maintenance.description }}</div>
          </div>
          <!-- <p><strong>Description of Work:</strong> {{ maintenance.description }}</p> -->
          <v-divider></v-divider>
          <h4 class="mt-3 ml-3">Part Used</h4>
          <v-table>
            <thead>
              <tr>
                <th><strong>Name</strong></th>
                <th><strong>Quantity</strong></th>
                <th><strong>Cost</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="part in maintenance.Part_used" :key="part.name">
                <td>{{ part.name }}</td>
                <td>{{ part.quantity }}</td>
                <td>${{ part.cost }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <v-table class="grey-background text-right">
            <tbody>
              <tr>
                <td><strong>Labor Cost</strong></td>
                <td>${{ maintenance.labor_cost }}</td>
              </tr>
              <tr>
                <td><strong>Total Cost</strong></td>
                <td>${{ maintenance.total_cost }}</td>
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
  
  const props = defineProps({
    modelValue: Boolean,
    maintenance: {
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
      if (status === "Pending") {
          return 'green'; 
      } else if (status === "Completed") {
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
  