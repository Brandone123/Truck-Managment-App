<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable max-width="600px">
      <v-card>
        <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Import Inventory</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
        <v-card-text>
          <v-file-input
            v-model="files"
            variant="outlined"
            label="Select CSV File"
            prepend-icon="mdi-cloud-upload-outline"
            accept=".csv"
          ></v-file-input>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="uploadFile">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { useInventoryStore } from '~/stores/maintenance/inventoryStore';
 // import { useLayoutStore } from '~/stores/layoutStore';
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(['update:modelValue', 'imported']);
  
  const files = ref<File[]>([]);
  
  const inventoryStore = useInventoryStore();
  const layoutStore = useLayoutStore();
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const uploadFile = async () => {
    if (files.value.length > 0) {
      const formData = new FormData();
      formData.append('file', files.value[0]); // Select the first file
  
      try {
        layoutStore.setOverlay(true);
        await inventoryStore.importInventory(formData);
        layoutStore.setStatusMessage('Inventory imported successfully', 'primary');
        emit('imported');
      } catch (error) {
        layoutStore.setStatusMessage('Failed to import inventory', 'error');
        console.error('Upload error:', error);
      } finally {
        layoutStore.setOverlay(false);
        closeDialog();
      }
    } else {
      console.error('No file selected');
    }
  };
  </script>
  