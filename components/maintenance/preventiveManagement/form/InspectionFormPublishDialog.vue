<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable width="800px">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Inspection Publishing</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div style="position:sticky; top:-15px; z-index: 1;" class="grey-background mx-n6 mt-n4">
          <v-stepper flat v-model="step">
            <v-stepper-header>
              <v-stepper-item color="primary" title="Drivers" :value="1"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Vehicles" :value="2"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Platforms" :value="3"></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </div>
        <v-form ref="publishingForm">
          <v-window v-model="step">
            <v-window-item :value="1">
              <div style="z-index: 1; position:sticky; top: 400;">
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-autocomplete variant="solo" flat density="compact" :items="filteredDriverList"
                      v-model="selectedDriver" label="Select Driver" return-object required item-title="id">
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :subtitle="item.raw.name" :title="item.raw.id"></v-list-item>
                      </template>
                      <template v-slot:append>
                        <v-btn color="primary" :disabled="!selectedDriver"
                          @click="addDriver"><v-icon>mdi-plus</v-icon>Add Driver</v-btn>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </div>
              <v-table>
                <thead>
                  <tr>
                    <th>Driver ID</th>
                    <th>Driver Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(local, index) in localPublishing.drivers" :key="index">
                    <td>{{ local.id }}</td>
                    <td>{{ local.name }}</td>
                    <td> <v-icon color="red" @click="removeDriver(local.id)">mdi-delete</v-icon></td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
            <v-window-item :value="2">
              <div style="z-index: 1; position:sticky; top: 400;">
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-autocomplete variant="solo" flat density="compact" :items="filteredVehicleList"
                      v-model="selectedVehicle" label="Select Vehicle" return-object required item-title="id">
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :subtitle="item.raw.type" :title="item.raw.id"></v-list-item>
                      </template>
                      <template v-slot:append>
                        <v-btn color="primary" :disabled="!selectedVehicle"
                          @click="addVehicle"><v-icon>mdi-plus</v-icon>Add Vehicle</v-btn>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </div>

              <v-table>
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Vehicle Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in localPublishing.vehicles" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.type }}</td>
                    <td> <v-icon color="red" @click="removeVehicle(item.id)">mdi-delete</v-icon></td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
            <v-window-item :value="3">
              <v-row class="mt-4">
                <v-col>
                  <v-checkbox color="primary" v-model="localPublishing.platforms.mobile"
                    label="Mobile App"></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox color="primary" v-model="localPublishing.platforms.web" label="Web Portal"></v-checkbox>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="step += 1">Next<v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="step == 3" color="primary" variant="text" @click="saveInspection">Publish</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  form: {
    type: Object as any,
    required: true,
  },
});

const drivers = ref([
  { id: 'DRV-001', name: 'John Doe' },
  { id: 'DRV-002', name: 'Jane Smith' },
])

const selectedDriver = ref<any | null>(null)
const selectedVehicle = ref<any | null>(null)

const filteredDriverList = computed(() => {
  return drivers.value.filter(driver => !localPublishing.value.drivers.includes(driver))
})

const filteredVehicleList = computed(() => {
  return vehicles.value.filter(vehicle => !localPublishing.value.vehicles.includes(vehicle))
})
const driver_headers = ref([
  { title: 'Driver ID', key: 'id' },
  { title: 'Driver Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false },
])

const vehicles = ref([
  { id: 'VEH-001', type: 'Trailer' },
  { id: 'VEH-002', type: 'Truck' },
])

const vehicle_headers = ref([
  { title: 'Vehicle ID', key: 'id' },
  { title: 'Vehicle Type', key: 'type' },
  { title: 'Actions', key: 'actions', sortable: false },
])

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localPublishing = ref({
  vehicles: [] as any[],
  drivers: [] as any[],
  platforms: {
    mobile: false,
    web: false,
  }
});

const step = ref(1)

// watch(
//   () => props.publishing,
//   (newInspection) => {
//     localPublishing.value = { ...newInspection };
//   }
// );

// const title = computed(() => (props.publishing && props.publishing.id ? 'Edit Inspection' : 'Create Inspection'));

const publishingForm = ref(null);


const removeDriver = (driverId: any) => {
  let index = localPublishing.value.drivers.findIndex(driver => driver.id == driverId)
  if (index > -1) {
    localPublishing.value.drivers.splice(index, 1)
  }
}

const addDriver = () => {
  if (selectedDriver.value) {
    localPublishing.value.drivers.push(selectedDriver.value)
  }
  selectedDriver.value = null
}

const removeVehicle = (vehicleId: any) => {
  let index = localPublishing.value.vehicles.findIndex(vehicle => vehicle.id == vehicleId)
  if (index > -1) {
    localPublishing.value.vehicles.splice(index, 1)
  }
}

const addVehicle = () => {
  if (selectedVehicle.value) {
    localPublishing.value.vehicles.push(selectedVehicle.value)
  }
  selectedVehicle.value = null
}

// const addResult = () => {
//   localPublishing.value.results.push({
//     name: '',
//     status: '',
//     comments: ''
//   });
// }


const saveInspection = () => {
  emit('save', localPublishing.value);
  emit('update:modelValue', false);
  emit('close');
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const { modelValue } = toRefs(props);

watch([modelValue], ([newModelValue]) => {
  if (newModelValue === false) {
    resetForm();
  }
})

const resetForm = () => {
  step.value = 1
  localPublishing.value = {
    vehicles: [],
    drivers: [],
    platforms: {
      mobile: false,
      web: false,
    }
  }
}
</script>

<style scoped></style>