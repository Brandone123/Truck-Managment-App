<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="Upcoming" class="text-none">
          <span class="mr-1 bg-pink" style="width: 8px; height: 8px; border-radius: 50%;"></span> Upcoming
          <v-chip density="compact" class="ml-1 bg-pink">{{ UpcomingCount }}</v-chip></v-tab>
        <v-tab value="Overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span> Overdue
          <v-chip density="compact" class="ml-1 bg-orange">{{ OverdueCount }}</v-chip></v-tab>
        <v-tab value="Completed" class="text-none"><span class="mr-1 bg-primary"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip density="compact" class="ml-1 bg-primary">{{ CompletedCount }}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable show-select :showFooterInHead="false" :headers="tableHeaders"
      :items="filteredSchedule" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
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
              <div class="ml-2">
                <span class="text-secondary" v-bind="props"
                  style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;"
                  @click="viewVehicleDetails(getVehicleName(item.vehicle_id)?.id)">
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
                      <div class="ml-2">
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
      <template v-slot:item.program_id="{ item }">
        <div class="d-flex" style="align-items: center;">
          <div>
            <div class="rounded position-relative"
              style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
              <span style="font-size:xx-small;" v-if="getProgramName(item.program_id)">{{
                getProgramName(item.program_id)?.slice(0, 3).toUpperCase() }}</span>
              <span v-else style="font-size:xx-small;">PRO</span>
            </div>
          </div>
          <div>
            <span class="ml-2 text-secondary"  @click="viewProgramDetails(item.program_id)"
              style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
              {{ getProgramName(item.program_id) }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:item.due_date="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
          {{ new Date(item.due_date).toLocaleDateString('en-US', 
          { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </span>
        <v-tooltip activator="parent" location="top">
          {{ getRelativeDateTime(item.due_date) }}
        </v-tooltip>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" v-if="item.status"
          :color="getStatusColor(item.status)">{{ item.status
          }}</v-chip>
        <span v-else></span>
      </template>
    </SharedUiCustomTable>
  </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { ServiceSchedule } from '@/types/maintenance/serviceSchedule';
import type { filterItem } from '~/types/layout/table';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()

const props = defineProps({
  serviceSchedules: {
    type: Array as PropType<ServiceSchedule[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = [
  // { title: 'Schedule ID', key: 'id' },
  // { title: 'Vehicle ID', key: 'vehicle.id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Program Name', key: 'program_id' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getRelativeDateTime = (dateString: any) => {
  const now = new Date();
  const createdAt = new Date(dateString);
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

const filteredSchedule = computed(() => {
  if (activeFilter.value == 'all') {
    return props.serviceSchedules
  }
  return props.serviceSchedules.filter(item => (item.status || '') == activeFilter.value)
})

const UpcomingCount = computed(() => {
  return props.serviceSchedules?.filter(item => (item.status || '') == 'Upcoming')?.length || 0
})

const OverdueCount = computed(() => {
  return props.serviceSchedules?.filter(item => (item.status || '') == 'Overdue')?.length || 0
})

const CompletedCount = computed(() => {
  return props.serviceSchedules?.filter(item => (item.status || '') == 'Completed')?.length || 0
})

// const filterAssets = computed(() => {
//   return [
//     {
//       title: 'Status',
//       key: 'status',
//       items: ['Upcoming', 'Overdue', 'Completed'],
//       width: '300px',
//     },
//   ] as filterItem[]
// })

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

const viewVehicleDetails = (vehicleId: any) => {
  router.push(`/maintenance/AssetListPage/details/${vehicleId}`)
}

const viewProgramDetails = (programId: any) => {
  router.push(`/maintenance/serviceProgram/details/${programId}`)
}

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const serviceProgramStore = useServiceProgramStore()
const { servicePrograms } = storeToRefs(serviceProgramStore)

const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

const getProgramName = (programId: number) => {
  return servicePrograms.value.find(program => program.id == programId)?.program_name
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
</script>