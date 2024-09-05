<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="inspectionRecordForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select :items="vehicleOptions" v-model="localInspectionRecord.vehicleEquipmentId" label="Vehicle/Equipment" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="inspectionTypeOptions" v-model="localInspectionRecord.inspectionType" label="Inspection Type" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localInspectionRecord.date" label="Date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localInspectionRecord.inspector" label="Inspector" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localInspectionRecord.summary" label="Inspection Summary" required></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select :items="statusOptions" v-model="localInspectionRecord.status" label="Status" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localInspectionRecord.notes" label="Notes"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input v-model="localInspectionRecord.attachments" label="Attachments" multiple></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">Save</v-btn>
          <v-btn @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { InspectionRecord } from '@/types/maintenance/inspectionRecords';
  
  const props = defineProps({
    modelValue: Boolean,
    inspectionRecord: {
      type: Object as () => InspectionRecord | null,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const localInspectionRecord = ref<InspectionRecord>({
    id: null,
    vehicleEquipmentId: '',
    vehicleEquipmentName: '',
    inspectionType: '',
    date: '',
    status: '',
    inspector: '',
    summary: '',
    notes: '',
    attachments: [],
  });
  
  watch(
    () => props.inspectionRecord,
    (newVal) => {
      if (newVal) {
        Object.assign(localInspectionRecord.value, newVal);
      } else {
        localInspectionRecord.value = {
          id: null,
          vehicleEquipmentId: '',
          vehicleEquipmentName: '',
          inspectionType: '',
          date: '',
          status: '',
          inspector: '',
          summary: '',
          notes: '',
          attachments: [],
        };
      }
    },
    { immediate: true }
  );
  
  const vehicleOptions = ['Vehicle 1', 'Vehicle 2', 'Equipment 1'];
  const inspectionTypeOptions = ['Routine', 'Annual'];
  const statusOptions = ['Pending', 'Completed'];
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  const save = () => {
    emit('save', localInspectionRecord.value);
    closeDialog();
  };
  </script>
  