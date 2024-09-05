<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Expense/Activity Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Expense Type:</strong> {{ expenseActivity.type }}</td>
                <td class="text-h6"><strong>Asset Name:</strong> {{ expenseActivity.asset_name }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th>Expense/Activity Type</th>
                <th>Date</th>
                <th>Technician/Vendor</th>
                <th>VIN</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ expenseActivity.expense_activity_type }}</td>
                <td>{{ expenseActivity.date }}</td>
                <td>{{ expenseActivity.technician_vendor }}</td>
                <td>{{ expenseActivity.vin }}</td>
                <td>${{ expenseActivity.cost }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="d-flex">
            <h4 class="mt-3 mb-3 ml-3">Description:</h4>
            <div class="ml-5 mt-3">{{ expenseActivity.description }}</div>
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
    expenseActivity: {
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
  