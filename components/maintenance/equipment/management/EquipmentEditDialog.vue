<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ equipment.id ? 'Edit Equipment' : 'Add Equipment' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="equipmentForm">
            <v-row>
              <v-col cols="12" sm="6">
               <v-text-field variant="solo" flat density="compact" v-model="equipment.name" label="Equipment Name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                  <v-select variant="solo" flat density="compact" v-model="equipment.type" :items="equipmentTypes" label="Type" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                  <v-select variant="solo" flat density="compact" v-model="equipment.status" :items="statusOptions" label="Status" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                  <v-text-field variant="solo" flat density="compact" v-model="equipment.location" label="Location" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="equipment.purchase_date" label="Purchase Date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="equipment.last_service_date" label="Last Service Date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-file-input variant="solo" flat density="compact" v-model="attachments" label="Attachments" multiple></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" v-model="equipment.description" label="Description"></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" v-model="equipment.notes" label="Notes"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import type { Equipment } from '@/types/maintenance/equipmentTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    equipment: {
      type: Object as () => Equipment,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const equipment = ref<Equipment>({ ...props.equipment });
  
  const equipmentTypes = ['Type 1', 'Type 2', 'Type 3'];
  const statusOptions = ['Active', 'Inactive'];
  const attachments = ref([]);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const save = () => {
    emit('save', equipment.value);
    closeDialog();
  };
  
  watch(props.equipment, (newVal) => {
    equipment.value = { ...newVal };
  });
  </script>
  