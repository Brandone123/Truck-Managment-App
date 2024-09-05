<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Service Schedule Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold">Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle Name</v-col>
                      <v-col cols="12" md="6">
                        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div class="d-flex">
                              <div>
                                <div class="rounded position-relative"
                                  style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                  <span style="font-size:xx-small;" v-if="getVehicleName(serviceSchedule.vehicle_id)?.type">{{
                                    getVehicleName(serviceSchedule.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                  <span v-else style="font-size:xx-small;">VHI</span>
                                  <div v-if="getVehicleName(serviceSchedule.vehicle_id)?.status"
                                    :class="`${'bg-' + getVehicleStatusColor(getVehicleName(serviceSchedule.vehicle_id)?.status)}`"
                                    style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                  </div>
                                </div>
                              </div>
                              <div class="ml-2">
                                <span class="text-secondary" v-bind="props"
                                  style="cursor: pointer; border-bottom: 1px dotted;"
                                  >
                                  {{ getVehicleName(serviceSchedule.vehicle_id)?.name }}
                                </span>
                              </div>
                            </div>
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <div class="d-flex mb-2">
                                      <div >
                                        <div class="rounded position-relative"
                                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                          <span style="font-size: large;">{{ getVehicleName(serviceSchedule.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                        </div>
                                      </div>
                                      <div class="ml-2">
                                        <span class="text-secondary" v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;">
                                          {{ getVehicleName(serviceSchedule.vehicle_id)?.name }}
                                        </span>
                                      </div>
                                    </div>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(serviceSchedule.vehicle_id)?.status">
                                        <v-chip density="compact" class="text-capitalize"
                                          :color="getVehicleStatusColor(getVehicleName(serviceSchedule.vehicle_id)?.status)">
                                          {{ getVehicleName(serviceSchedule.vehicle_id)?.status }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceSchedule.vehicle_id)?.odometer }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceSchedule.vehicle_id)?.type }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Year Make Model</v-col>
                                      <v-col cols="12" md="6">
                                        {{ getVehicleName(serviceSchedule.vehicle_id)?.year }}
                                        {{ getVehicleName(serviceSchedule.vehicle_id)?.make }}
                                        {{ getVehicleName(serviceSchedule.vehicle_id)?.model }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(serviceSchedule.vehicle_id)?.dimensions">{{
                                        getVehicleName(serviceSchedule.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceSchedule.vehicle_id)?.vin }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Current Meter</v-col>
                                      <v-col cols="12" md="6">{{ }}</v-col>
                                    </v-row>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Program Name</v-col>
                      <v-col cols="12" md="6">{{ getProgramName(serviceSchedule.program_id) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Due Date</v-col>
                      <v-col cols="12" md="6">{{ serviceSchedule.due_date.substring(0, 10) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6">
                        <v-chip density="compact" variant="flat" :color="getStatusColor(serviceSchedule.status)">{{ serviceSchedule.status }}</v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ServiceSchedule } from '@/types/maintenance/serviceSchedule';
const serviceProgramStore = useServiceProgramStore()
const { servicePrograms } = storeToRefs(serviceProgramStore)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  serviceSchedule: {
    type: Object as any,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const step = ref(1)

const close = () => {
  emit('update:modelValue', false);
};

const getProgramName = (programId: number) => {
  return servicePrograms.value.find(program => program.id == programId)?.program_name
}
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const getStatusColor = (status: string) => {
  switch ((status || '')) {
    case 'Completed':
      return 'primary';
    case 'Overdue':
      return 'orange';
    case 'Upcoming':
      return 'pink';
    default:
      return 'grey'
  }
}

const getVehicleStatusColor = (status: any) => {
  switch ((status || '')) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

watch(
  () => props.modelValue,
  (newModalValue) => {
    if (newModalValue == false) {
      step.value = 1
    }
  }
)
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>