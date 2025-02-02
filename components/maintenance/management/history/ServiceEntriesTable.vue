<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="in progress" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>In Progress
          <v-progress-circular v-if="loadingSummary" :size="30" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else class="ml-1 bg-secondary" density="comfortable">{{ serviceHistorySummary['in progress']
            }}</v-chip>
        </v-tab>
        <v-tab value="completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-progress-circular v-if="loadingSummary" :size="30" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else class="ml-1 bg-primary" density="comfortable">{{ serviceHistorySummary.completed }}</v-chip>
        </v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-progress-circular v-if="loadingSummary" :size="30" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else class="ml-1 bg-yellow" density="comfortable">{{ serviceHistorySummary.pending }}</v-chip>
        </v-tab>
      </v-tabs>
    </div>
    <SharedUiServerTable class="custom-table" :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false"
      show-select :headers="tableHeaders" :items="serviceEntries" :loading="loading" :selectable="true"
      v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage" :items-length="total_items"
      :sort-by="pagination.sortBy" @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="viewDetails(item.id)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{
          item.status.charAt(0).toUpperCase() + item.status.slice(1)
          }}</v-chip>
      </template>
      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" variant="flat" :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
      </template>
      <template v-slot:item.service_tasks="{ item }">
        <span style="cursor: pointer; font-size: small">
          {{ formatServiceTasks(item.line_items).name + ` ` }}
        </span>
        <span class="text-primary font-weight-bold" style="cursor: pointer; font-size: small">
          {{ formatServiceTasks(item.line_items).count > 0 ? `+${formatServiceTasks(item.line_items).count} more` : ''
          }}
        </span>
      </template>

      <template v-slot:item.watchers="{ item }">
        <!-- <div>
          <template v-if="watchersList(item.watchers).length <= 2">
            <span style="cursor: pointer; font-size:small">
              {{ watchersList(item.watchers).join(' , ') }}
            </span>
          </template>
          <template v-else>
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="cursor: pointer; font-size:small">
                  {{ watchersList(item.watchers).slice(0, 2).join(' ; ') }} <strong class="text-primary"> + {{
                    watchersList(item.watchers).length - 2 }} more</strong>
                </span>
              </template>
              <span>{{ watchersList(item.watchers).join(', ') }}</span>
            </v-tooltip>
          </template>
        </div> -->
        <SharedTableDynamicWatcherItem :watchers="item.watching_employees" />
      </template>
      <template v-slot:item.vehicle="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" />
      </template>
      <template v-slot:item.completed_at="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.completed_at).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.completed_at) }}
          </v-tooltip>
        </span>
      </template>
    </SharedUiServerTable>
  </div>

</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';

const emit = defineEmits(['view', 'edit', 'delete']);
const router = useRouter();
const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const serviceHistoryStore = useServiceHistoryStore();
const { serviceEntries, loading, pagination: serviceHistoryPagination, total_items, loadingSummary, serviceSummary, serviceHistorySummary } = storeToRefs(serviceHistoryStore);

const viewDetails = (serviceHistoryId: number) => {
  router.push(`/maintenance/ServiceHistory/${serviceHistoryId}`);
};

const formatServiceTasks = (lineItems) => {
  const taskNames = lineItems.map(item => item.service_task?.name).filter(name => name); // Filter out any undefined or null names
  const firstTwoTasks = taskNames.slice(0, 2);
  return { name: [...firstTwoTasks].filter(Boolean).join(', '), count: taskNames.length > 2 ? taskNames.length - 2 : 0 };
};

const pagination = computed({
  get() {
    return serviceHistoryPagination.value
  },
  set(value) {
    serviceHistoryStore.setPagination(value);
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

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  serviceHistoryStore.fetchServiceEntries(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    serviceHistoryStore.fetchServiceEntries(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  serviceHistoryStore.fetchServiceEntries(searchQuery.value);
})

onMounted(() => {
  serviceHistoryStore.fetchServiceEntries(searchQuery.value);
})

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle' },
  { title: 'Complation Date', key: 'completed_at' },
  { title: 'Repair Priority Class', key: 'priority' },
  { title: 'Meter', key: 'odometer' },
  { title: 'Watchers', key: 'watchers' },
  { title: 'Service Task', key: 'service_tasks' },
  { title: 'Status', key: 'status' },
  { title: 'Total Cost', key: 'total_cost' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
];

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

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>