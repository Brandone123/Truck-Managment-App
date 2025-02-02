<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Open
          <v-chip class="ml-1 bg-secondary" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ faultSummary?.Open || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip class="ml-1 bg-yellow" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ faultSummary?.Pending || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip class="ml-1 bg-primary" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ faultSummary?.Resolved || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="ignored" class="text-none">
          <span class="mr-1 bg-purple" style="width: 8px; height: 8px; border-radius: 50%;"></span>Ignored
          <v-chip class="ml-1 bg-purple" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ faultSummary?.Ignored || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" show-select :sticky-top="true" :sticky-top-offset="95"
      :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders" :items="filteredFaults"
      :loading="loading" @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems"
      return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense
          @click="$emit('viewDetails', item.id)">
          {{ item.id }}
        </span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" :color="getStatusColor(item.status)">{{
          item.status }}</v-chip>
      </template>
      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" style="color:"
          :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
      </template>
      <template v-slot:item.critical="{ item }">
        <span>{{ item.critical ? 'Yes' : 'No' }}</span>
      </template>
      <template v-slot:item.date_reported="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.date_reported).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top" location-strategy="connected">
            {{ getRelativeDateTime(item.date_reported) }}
          </v-tooltip>
        </span>
      </template>
      <template v-slot:item.issue_id="{ item }">
        <span v-if="item.issue" @click="viewIssue(item.issue_id)" style="cursor: pointer; border-bottom: 1px dotted;"
          class="text-secondary">
          <IssueMenu :issue="item.issue" />
        </span>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.work_order="{ item }">
        <div v-if="item.issue?.work_order_id">
          <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;"
            @click="viewWorkOrder(item.issue?.work_order_id)">
            #{{ item.issue?.work_order_id }}
          </span>
        </div>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" v-if="item.vehicle_id" />
        <span v-else>N/A</span>
      </template>

    </SharedUiServerTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Fault } from '@/types/maintenance/fault';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';
import moment from 'moment'

const router = useRouter();

const props = defineProps({
  faults: {
    type: Array as PropType<Fault[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const faultStore = useFaultStore();
const { total_items, pagination: faultPagination, getFaultList, loadingSummary, faultSummary } = storeToRefs(faultStore);

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)


const tableHeaders = [
  // { title: 'Fault ID', key: 'id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Code', key: 'fault_code' },
  { title: 'Critical', key: 'critical' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Last Occured Date', key: 'date_reported' },
  { title: 'Status', key: 'status' },
  { title: 'Issue', key: 'issue_id' },
  // { title: 'Work Order', key: 'work_order' },
  // { title: 'Priority', key: 'priority' },
  // { title: 'Date Reported', key: 'date_reported' },
  // { title: 'Description', key: 'description' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

const getStatusColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return 'secondary';
    case 'resolved':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'ignored':
      return 'purple';
  }
}

const getPriorityColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'low':
      return 'grey';
    case 'medium':
      return 'orange';
    case 'high':
      return 'error';
    case 'no priority':
      return 'gray';
    case 'normal':
      return 'gray';
    default:
      return 'gray';
  }
}

const activeFilter = ref<string>('all')

const filteredFaults = computed(() => {
  const faults = getFaultList.value.map(fault => {
    return {
      ...fault
    };
  });

  if (activeFilter.value == "all") {
    return faults;
  }

  return faults.filter(
    (item) => item.status == activeFilter.value
  );
});

const viewIssue = (issueId: number) => {
  router.push(`IssuesManagement/${issueId}`)
};

const viewWorkOrder = (workOrderId: number) => {
  router.push(`WorkOrders/${workOrderId}`)
};

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const filterAssets = computed(() => {
  return [
    {
      title: 'Filter By Status',
      key: 'status',
      items:
        [
          { text: 'Open', value: 'Open' },
          { text: 'Resolved', value: 'Resolved' },
          { text: 'Pending', value: 'Pending' },
          { text: 'Ignored', value: 'Ignored' }
        ],
      width: '300px',
    },
    {
      title: 'Filter By Priority',
      key: 'priority',
      items:
        [
          { text: 'Low', value: 'low' },
          { text: 'Medium', value: 'medium' },
          { text: 'High', value: 'high' },
          { text: 'Normal', value: 'normal' }
        ],
      width: '300px',
    }
  ] as filterItem[]
})

onMounted(() => {
  faultStore.fetchFaults(searchQuery.value);
})

const pagination = computed({
  get() {
    return faultPagination.value
  },
  set(value) {
    faultStore.setPagination(value);
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
  faultStore.fetchFaults(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    faultStore.fetchFaults(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  faultStore.fetchFaults(searchQuery.value);
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