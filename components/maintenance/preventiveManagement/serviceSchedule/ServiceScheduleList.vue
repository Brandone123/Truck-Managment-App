<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="Upcoming" class="text-none">
          <span class="mr-1 bg-pink" style="width: 8px; height: 8px; border-radius: 50%;"></span> Upcoming
          <v-chip density="compact" class="ml-1 bg-pink">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ serviceScheduleSummary?.Upcoming || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="Overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span> Overdue
          <v-chip density="compact" class="ml-1 bg-orange">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ serviceScheduleSummary?.Overdue || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="Completed" class="text-none"><span class="mr-1 bg-primary"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip density="compact" class="ml-1 bg-primary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ serviceScheduleSummary?.Completed || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" show-select :showFooterInHead="false" :headers="tableHeaders" :items="filteredSchedule"
      :loading="loading" @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems"
      return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('view', item.id)" append-icon="mdi-eye">View</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="$emit('view', item.id)">
          {{ item.id }}
        </span>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" v-if="item.vehicle" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.program_id="{ item }">
        <SharedTableDynamicProgramItem :program="item.program" v-if="item.program" />
        <span v-else>N/A</span>
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
    </SharedUiServerTable>
  </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { ServiceSchedule } from '@/types/maintenance/serviceSchedule';
import type { filterItem } from '~/types/layout/table';
import { useRouter, useRoute } from 'vue-router';
import { useServiceScheduleStore } from '@/stores/maintenance/serviceSchedule'

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

const serviceScheduleStore = useServiceScheduleStore();
const {
  loadingSummary,
  total_items,
  pagination: schedulePagination,
  loading,
  serviceScheduleSummary,
  getServiceScheduleList
} = storeToRefs(serviceScheduleStore)
const hoveredRow = ref<number | null>(null)

const tableHeaders = [
  { title: 'Schedule ID', key: 'id' },
  // { title: 'Vehicle ID', key: 'vehicle.id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Program Name', key: 'program_id' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
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
  if (activeFilter.value == "all") {
    return getServiceScheduleList.value;
  }
  return getServiceScheduleList.value.filter(
    (item) => item.status == activeFilter.value
  );
});

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
  router.push(`ServicePrograms/${programId}`)
}

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const serviceProgramStore = useServiceProgramStore()
const { servicePrograms } = storeToRefs(serviceProgramStore)

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})

const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

const getProgramName = (programId: any) => {
  const programName = servicePrograms.value.find((program) => program.id === programId)
  return programName?.program_name
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

const pagination = computed({
  get() {
    return schedulePagination.value
  },
  set(value) {
    serviceScheduleStore.setPagination(value);
  }
})

const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  }

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0]
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all') {
    payload['filters'].status = activeFilter.value
  }

  return payload
})

onMounted(() => {
  serviceScheduleStore.fetchServiceSchedules(searchQuery.value)
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  serviceScheduleStore.fetchServiceSchedules(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    serviceScheduleStore.fetchServiceSchedules(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  serviceScheduleStore.fetchServiceSchedules(searchQuery.value);
})
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>