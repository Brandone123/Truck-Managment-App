<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" flat v-bind="props" @click="openDialog" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Vehicle
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Add Vehicle</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="serviceProgramForm">
          <v-row class="mt-4">
            <v-col cols="12">
              <SharedInputVehicleAutoCompleteInput :selectedItems="selectedVehicleIds" variant="solo" flat density="compact" v-model="selection.vehicle_id"
                label="Select Vehicle" :rules="[validation.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="compact" v-model="selection.last_service_date"
                label="Last Service Date" type="datetime-local">
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="compact" v-model="selection.last_service_mileage"
                label="Last Service Mileage" type="number">
                <template v-slot:append-inner>
                  <span>{{ meterUnits }}</span>
                </template>
              </v-text-field>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="addVehicle()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';
import type { SubscribedVehicle } from '~/types/maintenance/ServiceProgram';

const dialog = ref(false);
const assetStore = useAssetStore();

const props = defineProps({
  selection: {
    type: Object as PropType<Partial<SubscribedVehicle>>,
    required: true,
  },
  primaryMeterUtilization: {
    type: String,
    required: true
  },
  selectedVehicleIds: {
    type: Array as PropType<any[]>,
    required: false,
    default: []
  }
});

const closeDialog = () => {
  dialog.value = false;
};

const openDialog = () => {
  resetForm();
  dialog.value = true;
};


const validation = useValidation();

const resetForm = () => {
  props.selection.vehicle_id = null;
  props.selection.last_service_date = '';
  props.selection.last_service_mileage = '';
};

const emit = defineEmits(['addVehicle']);

const meterUnits = computed(() => {
  switch (props.primaryMeterUtilization) {
    case 'miles':
      return 'mi'
    case 'kilometers':
      return 'km'
    case 'hours':
      return 'hrs'
  }
})

const addVehicle = () => {
  const now = new Date().toISOString();
  emit('addVehicle', {...props.selection, subscribed_date: now});
  closeDialog();
};

</script>