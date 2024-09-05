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
          <v-form ref="complianceTaskForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Select Vehicle" :items="vehicles" v-model="localTask.vehicleName" item-title="asset_name" item-value="id" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Compliance Type" :items="['Regulation', 'Standard']" v-model="localTask.complianceType" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" label="Due Date" v-model="localTask.dueDate" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" label="Status" :items="['Pending', 'Completed']" v-model="localTask.status" required></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Description" v-model="localTask.description" required></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" label="Notes" v-model="localTask.notes"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveComplianceTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useVehicleStore } from '@/stores/vehicle';
  import type { ComplianceTask } from '@/types/maintenance/complianceTaskTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    task: {
      type: Object as any,
      default: () => ({
        id: null,
        vehicleName: '',
        complianceType: 'Regulation',
        dueDate: '',
        description: '',
        status: 'Pending',
        notes: '',
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const vehiclesStore = useVehicleStore();
  const vehicles = computed(() => vehiclesStore.getVehicleList);
  
  const localTask = ref<ComplianceTask>({ ...props.task });
  
  const title = computed(() => (props.task && props.task.id ? 'Edit Compliance Task' : 'Add Compliance Task'));
  
  watch(
    () => props.task,
    (newTask) => {
      localTask.value = { ...newTask };
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
  
  const saveComplianceTask = () => {
    emit('save', localTask.value);
    emit('update:modelValue', false);
    emit('close');
  };
  </script>
  