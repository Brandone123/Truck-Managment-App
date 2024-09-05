<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ log.id ? 'Edit Usage Log' : 'Add Usage Log' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="usageForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" v-model="localLog.vehicle_name" label="Vehicle Name" :items="vehicles" item-title="asset_name" item-value="id" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" v-model="localLog.usage_type" :items="['Mileage', 'Engine Hours']" label="Usage Type" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="localLog.meter_reading" label="Meter Reading" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="localLog.date" label="Date" type="date" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="localLog.cost" label="Cost" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea variant="solo" flat density="compact" v-model="localLog.notes" label="Notes"></v-textarea>
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
        usage_type: '',
        meter_reading: 0,
        date: '',
        cost: 0,
        notes: '',
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
  