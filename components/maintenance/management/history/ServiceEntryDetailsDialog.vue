<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Service Entry #{{ serviceEntry.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
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
                      <v-col cols="12" md="6">Completion Date</v-col>
                      <v-col cols="12" md="6">
                        <span style="cursor: pointer; border-bottom: 1px dotted;">
                          {{ new Date(serviceEntry.completed_at).toLocaleDateString('en-US') }}
                          <v-tooltip activator="parent" location="top">
                            {{ getRelativeDateTime(serviceEntry.completed_at) }}
                          </v-tooltip>
                        </span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6">
                        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div class="d-flex">
                              <div>
                                <div class="rounded position-relative"
                                  style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                  <span style="font-size:xx-small;" v-if="getVehicleName(serviceEntry.vehicle_id as number)?.type">{{
                                    getVehicleName(serviceEntry.vehicle_id as number)?.type.slice(0, 3).toUpperCase() }}</span>
                                  <span v-else style="font-size:xx-small;">VHI</span>
                                  <div v-if="getVehicleName(serviceEntry.vehicle_id as number)?.status"
                                    :class="`${'bg-' + getVehicleStatusColor(getVehicleName(serviceEntry.vehicle_id as number)?.status)}`"
                                    style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span class="text-secondary ml-2" v-bind="props"
                                  style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                  {{ getVehicleName(serviceEntry.vehicle_id as number)?.name }}
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
                                        <div class="rounded position-relative"
                                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                          <span style="font-size: large;">{{ getVehicleName(serviceEntry.vehicle_id as number)?.type.slice(0, 3) }}</span>
                                        </div>
                                      </div>
                                      <div class="ml-1">
                                        <span class="text-secondary" v-bind="props">
                                          {{ getVehicleName(serviceEntry.vehicle_id as number)?.name }}
                                        </span>
                                      </div>
                                    </div>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(serviceEntry.vehicle_id as number)?.status">
                                        <v-chip density="compact" class="text-capitalize"
                                          :color="getVehicleStatusColor(getVehicleName(serviceEntry.vehicle_id as number)?.status)">
                                          {{ getVehicleName(serviceEntry.vehicle_id as number)?.status }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceEntry.vehicle_id as number)?.odometer }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceEntry.vehicle_id as number)?.type }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Year Make Model</v-col>
                                      <v-col cols="12" md="6">
                                        {{ getVehicleName(serviceEntry.vehicle_id as number)?.year }}
                                        {{ getVehicleName(serviceEntry.vehicle_id as number)?.make }}
                                        {{ getVehicleName(serviceEntry.vehicle_id as number)?.model }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(serviceEntry.vehicle_id as number)?.dimensions">{{
                                        getVehicleName(serviceEntry.vehicle_id as number)?.dimensions.ground_clearance }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(serviceEntry.vehicle_id as number)?.vin }}</v-col>
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
                      <v-col cols="12" md="6">Vendor</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.vendor }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Priority</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.priority }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6"><v-chip density="compact" variant="flat" :color="getStatusColor(serviceEntry.status)">{{ serviceEntry.status }}</v-chip></v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Actual Completion Date</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.actual_completion_date }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Reference</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.reference }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Odometer (mi)</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.meter.meter }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Description</v-col>
                      <v-col cols="12" md="6">{{ serviceEntry.description }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                  </v-card-text>
                </v-card>

                <v-card class="mt-5" height="200">
                  <v-card-title class="font-weight-bold">Resolved Issues</v-card-title>
                  <v-card-text>
                    <span class="text-grey text-center">
                      No issues to show. If this service entry resolves any issues, you can add them by editing the service entry.
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <div class="d-flex">
                <v-card-title class="font-weight-bold">Line Items</v-card-title>
              </div>
              
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th><strong>Service Task</strong></th>
                      <th><strong>Labor</strong></th>
                      <th><strong>Part</strong></th>
                      <th><strong>Subtotal</strong></th>
                    </tr>
                  </thead>
                  <tbody v-if="serviceEntry.service_tasks !== null">
                    <template v-for="(task, index) in serviceTasksList(serviceEntry.service_tasks)" :key="index">
                      <tr>
                        <td>{{ task }}</td>
                        <td>${{ getServiceTaskLineItem(task, 'labor_cost') }}</td>
                        <td>${{ getServiceTaskLineItem(task, 'part_cost') }}</td>
                        <td>${{ getServiceTaskLineItem(task, 'subtotal') }}</td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
                <v-col cols="12">
                  <v-table class="grey-background text-right ">
                    <tbody>
                      <tr class="text-h7">
                        <td><strong>SubTotal</strong>
                          <div style="font-size: smaller;">Labor</div>
                          <div style="font-size: smaller;">Part</div>
                        </td>
                        <td>
                          <strong>${{ totalSubTotal.toFixed(2) }}</strong>
                          <div style="font-size: smaller;">${{ serviceEntry.line_items?.labor_subtotal }}</div>
                          <div style="font-size: smaller;">${{ serviceEntry.line_items?.parts_subtotal }}</div>
                        </td>
                      </tr>

                      <tr class="text-h7">
                        <td><strong>Tax(0.0%)</strong></td>
                        <td ><strong>+${{ serviceEntry.line_items?.tax }}</strong></td>
                      </tr>
                      <tr class="text-h7">
                        <td><strong>Warranty Credits(Fixed)</strong></td>
                        <td ><strong>-$0.00</strong></td>
                      </tr>
                      <tr class="text-h7">
                        <td><strong>Discount(0.0%)</strong></td>
                        <td ><strong>-${{ serviceEntry.line_items?.discount }}</strong></td>
                      </tr>
                      <tr class="text-h6">
                        <td><strong>Total Amount</strong></td>
                        <td ><strong>${{ totalRevenu.toFixed(2) }}</strong></td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveServiceEntry">Save</v-btn>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { ServiceEntry } from '@/types/maintenance/serviceHistory';

const props = defineProps({
  modelValue: Boolean,
  serviceEntry: {
    type: Object as PropType<ServiceEntry>,
    required: true,
  },
});

const serviceHistoryStore = useServiceHistoryStore();

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const emit = defineEmits(['update:modelValue', 'close']);

const step = ref(0)

const newComment = ref('');

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveServiceEntry = async (service: any) => {
  if (service.id) {
    await serviceHistoryStore.updateServiceEntry(service);
  }
  close();
};

const getServiceTaskName = (serviceTaskId: number) => {
  const taskName = serviceTaskList.value.find(task => task.id == serviceTaskId)
  return taskName ? taskName.name : ''
}

// const addComment = () => {
//   if (!props.serviceEntry.comments) {
//     props.serviceEntry.comments = [];
//   }
//   props.serviceEntry.comments.push({
//     date: new Date().toISOString(),
//     description: newComment.value,
//   });
//   newComment.value = '';
// };

// const removeTask = (taskId: number) => {
//   props.serviceEntry.service_tasks = props.serviceEntry.service_tasks.filter((task) => task.id !== taskId);
// };

// const hasServiceTasks = computed(() => {
//   if (props.serviceEntry.line_items && props.serviceEntry.line_items.length > 0) {
//     return true;
//   }
//   return false;
// })

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: number) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

const getVehicleStatusColor = (status: any) => {
  switch ((status || '').toLocaleLowerCase()) {
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

const getRelativeDateTime = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString.replace(/\//g, '-'));
  const diff = now.getTime() - createdAt.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

const totalRevenu = computed(() => {
  let totalSub = 0;
  let totalRev = 0;
  let total = 0;
  if (props.serviceEntry.line_items) {
    totalSub = totalSubTotal.value;
    totalRev = totalSub - (parseFloat(props.serviceEntry.line_items?.discount || '0') + parseFloat(props.serviceEntry.line_items?.tax || '0'));
  }
  total = totalRev;
  return total;
});

const totalSubTotal = computed(() => {
  let totalPart = 0;
  let totalService = 0;
  let totalLabor = 0;
  let total = 0;
  if (props.serviceEntry && props.serviceEntry.service_tasks) {
    for (const serviceTask of props.serviceEntry.service_tasks) {
      if (serviceTask.subtotal) {
        totalService += parseFloat(serviceTask.subtotal);
      }
    }
    if (props.serviceEntry.line_items?.labor_subtotal) {
      totalLabor = parseFloat(props.serviceEntry.line_items?.labor_subtotal);
    }
    if (props.serviceEntry.line_items?.parts_subtotal) {
      totalPart = parseFloat(props.serviceEntry.line_items?.parts_subtotal);
    }
  }
  total = totalPart + totalService + totalLabor;
  return total;
});

const serviceTasksList = (tasksString: any) => {
  return tasksString ? tasksString.split('|').map((task: any) => task.trim()) : {};
};

// const getServiceTaskName2 = (taskId: number) => {
//   // Implement your logic to get the service task name from the taskId
//   return 'Service Task Name';
// };

const getServiceTaskLineItem = (taskId: string, prop: string) => {
  // Implement your logic to get the labor_cost, part_cost, or subtotal for the given taskId
  return 0;
};

const getStatusColor = (status: string) => {
  switch (status.toLocaleLowerCase()) {
    case 'completed':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'in progress':
      return 'secondary';
    default:
      return '';
  }
};
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>