<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Fault #{{ fault.id }}</v-toolbar-title>
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
                  <v-card-title class="font-weight-bold">Fault Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Date Reported</v-col>
                      <v-col cols="12" md="6">
                        <span style="cursor: pointer; border-bottom: 1px dotted;">
                          {{ fault.date_reported }}
                          <v-tooltip activator="parent" location="top" location-strategy="connected">
                            {{ getRelativeDateTime(fault.date_reported) }}
                          </v-tooltip>
                        </span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6">
                        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div class="d-flex">
                              <div>
                                <div class="rounded position-relative" style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                  <span style="font-size:xx-small;" v-if="getVehicleName(fault.vehicle_id)?.type">{{ getVehicleName(fault.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span> 
                                  <span v-else style="font-size:xx-small;" >VHI</span>
                                  <div v-if="getVehicleName(fault.vehicle_id)?.status" :class="`${'bg-' + getVehicleStatusColor(getVehicleName(fault.vehicle_id)?.status)}`" 
                                  style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span class="text-secondary ml-2" v-bind="props" style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                  {{ getVehicleName(fault.vehicle_id)?.name }}
                                </span>
                              </div>
                            </div>
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                  <div class="d-flex mb-2" style="align-items: center;">
                                    <div>
                                      <div class="rounded position-relative" style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                        <span style="font-size: large;">{{ getVehicleName(fault.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span> 
                                      </div>
                                    </div>
                                    <div class="ml-2">
                                      <span class="text-secondary" v-bind="props">
                                        {{ getVehicleName(fault.vehicle_id)?.name }}
                                      </span>
                                    </div>
                                  </div>
                                  <v-row>
                                    <v-col cols="12" md="6">Status</v-col>
                                    <v-col cols="12" md="6" v-if="getVehicleName(fault.vehicle_id)?.status">
                                      <v-chip density="compact" :color="getVehicleStatusColor(getVehicleName(fault.vehicle_id)?.status)">
                                          {{ getVehicleName(fault.vehicle_id)?.status }}
                                      </v-chip>
                                    </v-col>
                                  </v-row>
                                  <v-divider class="my-2"></v-divider>
                                  <v-row>
                                    <v-col cols="12" md="6">Operator</v-col>
                                    <v-col cols="12" md="6">{{ getVehicleName(fault.vehicle_id)?.odometer }}</v-col>
                                  </v-row>
                                  <v-divider class="my-2"></v-divider>
                                  <v-row>
                                    <v-col cols="12" md="6">Type</v-col>
                                    <v-col cols="12" md="6">{{ getVehicleName(fault.vehicle_id)?.type }}</v-col>
                                  </v-row>
                                  <v-divider class="my-2"></v-divider>
                                  <v-row>
                                    <v-col cols="12" md="6">Year Make Model</v-col>
                                    <v-col cols="12" md="6">
                                      {{ getVehicleName(fault.vehicle_id)?.year }}
                                      {{ getVehicleName(fault.vehicle_id)?.make }}
                                      {{ getVehicleName(fault.vehicle_id)?.model }}
                                    </v-col>
                                  </v-row>
                                  <v-divider class="my-2"></v-divider>
                                  <v-row>
                                    <v-col cols="12" md="6">Group</v-col>
                                    <v-col cols="12" md="6" v-if="getVehicleName(fault.vehicle_id)?.dimensions">{{ getVehicleName(fault.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                                  </v-row>
                                  <v-divider class="my-2"></v-divider>
                                  <v-row>
                                    <v-col cols="12" md="6">VIN/SN</v-col>
                                    <v-col cols="12" md="6">{{ getVehicleName(fault.vehicle_id)?.vin }}</v-col>
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
                      <v-col cols="12" md="6">Fault Code</v-col>
                      <v-col cols="12" md="6">{{ fault.fault_code }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Priority</v-col>
                      <v-col cols="12" md="6">
                        <v-chip density="compact" variant="flat" :color="getPriorityColor(fault.priority)">
                          {{ fault.priority }}</v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Critical</v-col>
                      <v-col cols="12" md="6">{{fault.critical ? 'Yes' : 'No'}}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6">
                        <v-chip density="compact" variant="flat" :color="getStatusColor(fault.status)">
                          {{ fault.status }}</v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold">Description</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="fault.description" label="Description" readonly></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="convertToIssue(fault.vehicle_id)">Create Issue</v-btn>
        <v-btn color="primary" v-if="fault.status !== 'ignored'" @click="showAddEntry(fault.status)">Ignore</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
      <v-dialog v-model="showIgnoredDialog" max-width="600px">
        <v-card class="grey-background">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Ignore Fault</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showIgnoredDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-row class="mt-3 mb-3">
              <p>Are you sure you want to ignore the selected faults?</p>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveIgnoredFault(fault)">Ignore Fault</v-btn>
            <v-btn @click="showIgnoredDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Fault } from '@/types/maintenance/fault';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import { useIssueStore } from '@/stores/maintenance/issue';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  fault: {
    type: Object as PropType<Fault>,
    required: true,
  },
});

const router = useRouter();
const emit = defineEmits(['update:modelValue']);

const faultStore = useFaultStore();

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const showIgnoredDialog = ref(false);

const statusValue = ref('')

const showAddEntry = (status: any) => {
  statusValue.value = status
  showIgnoredDialog.value = true;
};

const saveIgnoredFault = async (item: any) => {
  statusValue.value = 'ignored'
  if(item.id){
    item.status = statusValue.value
    showIgnoredDialog.value = false;
    await faultStore.updateFault(item);
    close();
  }
  useLayoutStore().setStatusMessage('Fault Ignored', 'primary')
};

const convertToIssue = (itemId: any) => {
  // Implement the convert to issue logic
  router.push({ path: '/maintenance/IssuesManagement', query: {
    vehicleName: getVehicleName(itemId as number)?.name, 
    reported_date: new Date().toISOString().slice(0, 10),
    action: 'createIssue'
  }})
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'secondary';
    case 'Resolved':
      return 'primary';
    case 'Pending':
      return 'yellow';
    case 'Ignored':
      return 'purple';
  }
}

const getPriorityColor = (status: string) => {
  switch (status) {
    case 'Low':
      return 'grey';
    case 'Medium':
      return 'orange';
    case 'High':
      return 'error';
    case 'No Priority':
      return 'gray';
    default:
      return 'gray';
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

const getRelativeDateTime = (dateString: any) =>{
  const now = new Date();
  const createdAt = new Date(dateString);
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: any) =>{
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}
</script>
<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>