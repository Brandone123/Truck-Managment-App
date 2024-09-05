<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ log.id ? 'Edit Maintenance Log' : 'Add Maintenance Log' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="logForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="localLog.vehicle_name" label="Vehicle Name" variant="solo" flat density="compact" :items="vehicles" item-title="asset_name" item-value="id" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localLog.maintenance_type" :items="maintenanceTypeOptions" label="Maintenance Type" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localLog.date" label="Date" variant="solo" flat density="compact" required type="date"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localLog.technician_vendor" label="Technician/Vendor" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localLog.cost" label="Cost" variant="solo" flat density="compact" required type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localLog.status" :items="statusOptions" label="Status" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-file-input v-model="localLog.attachments" label="Attachments" variant="solo" flat density="compact" multiple></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localLog.description" label="Description of Work" variant="solo" flat density="compact" required></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dense @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveLog">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    log: {
      type: Object,
      default: () => ({
        vehicle_name: '',
        maintenance_type: '',
        date: '',
        technician_vendor: '',
        cost: 0,
        status: '',
        description: '',
        attachments: [],
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);

  const vehiclesStore = useVehicleStore();
  const vehicles = computed(() => vehiclesStore.getVehicleList);
  
  const localLog = ref({ ...props.log });
  
  watch(() => props.log, (newLog) => {
    localLog.value = { ...newLog };
  });
  
  const maintenanceTypeOptions = ['Repair', 'Routine', 'Inspection'];
  const statusOptions = ['Pending', 'In Progress', 'Completed'];
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveLog = () => {
    emit('save', localLog.value);
    emit('update:modelValue', false);
  };

  onMounted(() => {
    vehiclesStore.fetchVehicleList();
  })
  </script>
  
  <style scoped>
  </style>
  