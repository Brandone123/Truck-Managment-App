<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable max-width="600px">
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Import Service Program</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-select v-model="selectedType" :items="importTypes" label="Select Import Type" variant="outlined"
          prepend-icon="mdi-file-edit-outline"></v-select>
        <v-file-input v-model="files" label="Select CSV File" prepend-icon="mdi-cloud-upload-outline" variant="outlined"
          accept=".csv"></v-file-input>
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

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'imported']);

const files = ref<File[]>([]);

const serviceProgramStore = useServiceProgramStore();
const layoutStore = useLayoutStore();
const selectedType = ref<string>('tms'); // Default value
const importTypes = [
  { title: 'Fleetio', value: 'fleetio' },
  { title: 'TMS', value: 'tms' }
];

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
    formData.append('importType', selectedType.value);

    try {
      layoutStore.setOverlay(true);
      await serviceProgramStore.importProgram(formData);
      layoutStore.setStatusMessage('Service Program imported successfully', 'primary');
      emit('imported');
    } catch (error) {
      layoutStore.setStatusMessage('Failed to import service program', 'error');
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