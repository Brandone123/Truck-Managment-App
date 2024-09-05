<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Inventory Item Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td class="text-h6"><strong>Inventory ID:</strong> {{ inventoryItem.id }}</td>
                <td class="text-h6"><strong>Part Number:</strong> {{ getPartName(inventoryItem.part_id) }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table>
            <thead>
              <tr>
                <th>Current Quantity</th>
                <th>Reorder Point</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ inventoryItem.current_quantity }}</td>
                <td>{{ inventoryItem.reorder_point }}</td>
                <td>{{ inventoryItem.location }}</td>
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
  import type { InventoryItem } from '@/types/maintenance/inventoryTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    inventoryItem: {
      type: Object as PropType<InventoryItem>,
      required: true,
    },
  });

  const partsAndSuppliesStore = usePartsAndSuppliesStore();
  const {partSupplies} = storeToRefs(partsAndSuppliesStore)
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  const getPartName = (partId: any) => {
    const partName = partSupplies.value.find((part) => part.id === partId)
    return partName ? partName.part_number : ''
  }
  </script>
  