<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Generate Analytics Report</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="reportName" label="Report Name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="reportType" :items="reportTypes" label="Report Type" required></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="startDate" label="Start Date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="endDate" label="End Date" type="date" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select v-model="selectedAssets" :items="assetList" label="Select Assets" multiple></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="description" label="Description"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="notes" label="Notes"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-file-input v-model="attachments" label="Attachments" multiple></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="generateReport">Generate</v-btn>
          <v-btn text @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useAssetStore } from '@/stores/maintenance/assetStore';
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'generate']);
  
  const reportName = ref('');
  const reportType = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const selectedAssets = ref([]);
  const description = ref('');
  const notes = ref('');
  const attachments = ref([]);
  const assetsStore = useAssetStore();
  const { assetList } = storeToRefs(assetsStore);
  
  const reportTypes = ['Maintenance Cost', 'Asset Performance', 'Downtime', 'Predictive Analytics'];
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  const generateReport = () => {
    const reportParams = {
      reportName: reportName.value,
      reportType: reportType.value,
      dateRange: { start: startDate.value, end: endDate.value },
      selectedAssets: selectedAssets.value,
      description: description.value,
      notes: notes.value,
      attachments: attachments.value,
    };
    emit('generate', reportParams);
    closeDialog();
  };
  </script>
  