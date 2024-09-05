<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="in progress" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>in progress
          <v-chip class="ml-1 bg-secondary" density="comfortable">{{ inProgressCount }}</v-chip></v-tab>
        <v-tab value="completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ resolvedCount }}</v-chip></v-tab>
          <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip class="ml-1 bg-yellow" density="comfortable">{{ pendingCount }}</v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false" show-select :headers="tableHeaders" :items="filteredServiceEntries"
      :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{ item.status.charAt(0).toUpperCase() + item.status.slice(1)
          }}</v-chip>
      </template>
      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" variant="flat" :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
      </template>
      <template v-slot:item.service_tasks="{ item }">
        <div>
          <template v-if="serviceTasksList(item.service_tasks).length <= 2">
            <span style="cursor: pointer; font-size: small">
              {{ serviceTasksList(item.service_tasks).join(' , ') }}
            </span>
          </template>
          <template v-else>
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="cursor: pointer; font-size: small">
                  {{ serviceTasksList(item.service_tasks).slice(0, 2).join(' , ') }} <strong class="text-primary"> + {{ serviceTasksList(item.service_tasks).length - 2 }} more</strong>
                </span>
              </template>
              <span>{{ serviceTasksList(item.service_tasks).join(', ') }}</span>
            </v-tooltip>
          </template>
        </div>
      </template>

      <template v-slot:item.watchers="{ item }">
        <div>
          <template v-if="watchersList(item.watchers).length <= 2">
            <span style="cursor: pointer; font-size:small">
              {{ watchersList(item.watchers).join(' , ') }}
            </span>
          </template>
          <template v-else>
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="cursor: pointer; font-size:small">
                  {{ watchersList(item.watchers).slice(0, 2).join(' ; ') }} <strong class="text-primary"> + {{ watchersList(item.watchers).length - 2 }} more</strong>
                </span>
              </template>
              <span>{{ watchersList(item.watchers).join(', ') }}</span>
            </v-tooltip>
          </template>
        </div>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected" class="rounded" open-on-hover>
          <template v-slot:activator="{ props }">
            <div class="d-flex">
              <div>
                <div class="rounded position-relative"
                  style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                  <span style="font-size:xx-small;" v-if="getVehicleName(item.vehicle_id)?.type">{{
                    getVehicleName(item.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                  <span v-else style="font-size:xx-small;">VHI</span>
                  <div v-if="getVehicleName(item.vehicle_id)?.status"
                    :class="`${'bg-' + getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)}`"
                    style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                  </div>
                </div>
              </div>
              <div>
                <span class="text-secondary ml-2" v-bind="props"
                  style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                  {{ getVehicleName(item.vehicle_id)?.name }}
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
                          <span style="font-size: large;">{{ getVehicleName(item.vehicle_id)?.type.slice(0, 3) }}</span>
                        </div>
                      </div>
                      <div class="ml-1">
                        <span class="text-secondary" v-bind="props">
                          {{ getVehicleName(item.vehicle_id)?.name }}
                        </span>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.status">
                        <v-chip density="compact" class="text-capitalize"
                          :color="getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)">
                          {{ getVehicleName(item.vehicle_id)?.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Operator</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.odometer }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Type</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.type }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Year Make Model</v-col>
                      <v-col cols="12" md="6">
                        {{ getVehicleName(item.vehicle_id)?.year }}
                        {{ getVehicleName(item.vehicle_id)?.make }}
                        {{ getVehicleName(item.vehicle_id)?.model }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Group</v-col>
                      <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.dimensions">{{
                        getVehicleName(item.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">VIN/SN</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.vin }}</v-col>
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
      </template>
      <!-- <template v-slot:item.meter.meter="{ item }">
        <span>
          {{ item.meter.meter ? item.meter.meter `'/mi'` : ''}}
        </span>
      </template> -->
      <template v-slot:item.completed_at="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
            {{ new Date(item.completed_at).toLocaleDateString('en-US') }}
            <v-tooltip activator="parent" location="top">
              {{ getRelativeDateTime(item.completed_at) }}
            </v-tooltip>
          </span>
      </template>
    </SharedUiCustomTable>
  </div>
 
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { ServiceEntry } from '@/types/maintenance/serviceHistory';

const props = defineProps({
  loading: Boolean,
  serviceEntries: {
    type: Array as PropType<ServiceEntry[]>,
    required: true,
  },
});

const emit = defineEmits(['view', 'edit', 'delete']);

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Complation Date', key: 'completed_at' },
  { title: 'Repair Priority Class', key: 'priority' },
  { title: 'Meter', key: 'meter.meter' },
  { title: 'Watchers', key: 'watchers' },
  { title: 'Service Task', key: 'service_tasks' },
  { title: 'Status', key: 'status' },
  { title: 'Total Cost', key: 'total_cost' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const serviceTasksList = (tasksString: string) => {
  return tasksString ? tasksString.split('|').map((task) => task.trim()) : [];
};

const watchersList = (watchersString: string) => {
  return watchersString ? watchersString.split(',').map((watcher) => watcher.trim()) : [];
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

const getPriorityColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'primary';
    case 'Non-Scheduled':
      return 'secondary';
    case 'Emergency':
      return 'alert';
    default:
      return 'gray';
  }
};

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

const activeFilter = ref<string>('all')

const filteredServiceEntries = computed(() => {
  if (activeFilter.value == 'all') {
    return props.serviceEntries
  }
  return props.serviceEntries.filter(item => (item.status || '').toLocaleLowerCase() == activeFilter.value)
})


const pendingCount = computed(() => {
  return props.serviceEntries?.filter(item => (item.status || '').toLocaleLowerCase() == 'pending')?.length || 0
})

const inProgressCount = computed(() => {
  return props.serviceEntries?.filter(item => (item.status || '').toLocaleLowerCase() == 'in progress')?.length || 0
})


const resolvedCount = computed(() => {
  return props.serviceEntries?.filter(item => (item.status || '').toLocaleLowerCase() == 'completed')?.length || 0
})
</script>

<style scoped></style>