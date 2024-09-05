<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="inspectionForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Select Vehicle" :items="vehicles" v-model="localInspection.vehicleName" item-title="asset_name" item-value="id" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Inspection Type" :items="['Routine', 'Annual']" v-model="localInspection.inspectionType" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" label="Date" v-model="localInspection.date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Status" :items="['Pending', 'Completed']" v-model="localInspection.status" required></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Description" v-model="localInspection.description" required></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Notes" v-model="localInspection.notes"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveInspection">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useVehicleStore } from '@/stores/vehicle';
  import type { Inspection } from '@/types/maintenance/inspectionTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    inspection: {
      type: Object as any,
      default: () => ({
        id: null,
        vehicleId: null,
        inspectionType: 'Routine',
        date: '',
        description: '',
        status: 'Pending',
        notes: '',
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const vehiclesStore = useVehicleStore();
  const vehicles = computed(() => vehiclesStore.getVehicleList);
  
  const localInspection = ref<Inspection>({ ...props.inspection });
  
  const title = computed(() => (props.inspection && props.inspection.id ? 'Edit Inspection' : 'Add Inspection'));
  
  watch(
    () => props.inspection,
    (newInspection) => {
      localInspection.value = { ...newInspection };
    }
  );

  onMounted(() => {
    vehiclesStore.fetchVehicleList();
  })
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  const saveInspection = () => {
    emit('save', localInspection.value);
    emit('update:modelValue', false);
    emit('close');
  };
  </script>
  