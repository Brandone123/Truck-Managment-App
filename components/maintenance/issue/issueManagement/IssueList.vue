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
            <span v-else>{{ issueSummary?.open || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Overdue
          <v-chip class="ml-1 bg-orange" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ issueSummary?.overdue || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip class="ml-1 bg-primary" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ issueSummary?.resolved || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="closed" class="text-none">
          <span class="mr-1 bg-cyan" style="width: 8px; height: 8px; border-radius: 50%;"></span>Closed
          <v-chip class="ml-1 bg-cyan" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ issueSummary?.closed || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" show-select :sticky-top="true" :showFooterInHead="false"
      :headers="tableHeaders" :items="filteredIssues" :loading="loading" :sticky-top-offset="94" :filters="filterAssets"
      @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems" return-object
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
        <v-btn v-if="canCreateWorkOrder" color="primary" class="text-none mr-2" @click="createWork(selectedItems[0])">
          Create Work Order
        </v-btn>
      </template>
      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense
          @click="$emit('viewDetails', item.id)">
          #{{ item.id }}
        </span>
      </template>

      <template v-slot:item.source="{ item }">
        <div class="text-primary" @click="openSamsaraIssue(item)"
          :style="{ cursor: item.samsara_id != null ? 'pointer' : '' }">{{ item.source }}</div>
      </template>


      <template v-slot:item.asset_name="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.asset" v-if="item.asset_name" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip class="text-capitalize" density="compact" variant="flat"
          v-if="typeof item.status === 'string' && (item.status !== '1' && item.status !== '0')"
          :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
      </template>
      <template v-slot:item.issue="{ item }">
        <span>{{ item.issue ? `#${item.issue}` : 'N/A' }}</span>
      </template>

      <template v-slot:item.priority="{ item }">
        <v-chip class="text-capitalize" density="compact"
          v-if="typeof item.priority === 'string' && (item.priority !== '1' && item.status !== '0')"
          :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
        <span v-else></span>
      </template>

      <!-- Assignment -->
      <template v-slot:item.assigned_to="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.assigned_to_user" :technician="item.assigned_to_user" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.watchers="{ item }">
        <SharedTableDynamicWatcherItem :watchers="item.watching_employees" />
      </template>

      <template v-slot:item.reported_date="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
          {{ new Date(item.reported_date).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top" location-strategy="connected">
            {{ getRelativeDateTime(item.reported_date) }}
          </v-tooltip>
        </span>
      </template>
    </SharedUiServerTable>
  </div>
  <WorkOrderEditDialog :modelValue="workOrderEditDialog" :workOrder="selectedWorkOrder"
    :vehicleId="(selectedWorkOrder.vehicle_id as number)" @update:modelValue="workOrderEditDialog = $event"
    @close="closeWorkOrderEditDialog" @save="saveWorkOrder" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import type { filterItem } from '~/types/layout/table';
import type { EmployeeInfo } from '~/types/store/employee';
import WorkOrderEditDialog from "@/components/maintenance/management/workOrder/WorkOrderEditDialog.vue";
import type { WorkOrder } from "~/types/maintenance/workOrder";
import { useColor } from '@/composables/useColors';
import moment from 'moment';

const props = defineProps({
  issues: {
    type: Array as PropType<Issues[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore()
const { getStatusColor, getPriorityColor } = useColor();

const employeeStore = useEmployeeStore();

const issueStore = useIssueStore();
const { loadingSummary, issueSummary, total_items,
  pagination: issuePagination, getIssuesList } = storeToRefs(issueStore);

const activeFilter = ref<string>('all')

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const filteredIssues = computed(() => {
  if (activeFilter.value == "all") {
    return getIssuesList.value;
  }
  return getIssuesList.value.filter(
    (item) => item.status == activeFilter.value
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const openSamsaraIssue = (issue: any) => {
  if (issue.samsara_id) {
    window.open(`https://cloud.samsara.com/o/46837/fleet/maintenance/dvir/${issue.samsara_id}`, '_blank')
  } else {

  }
}

const tableHeaders = [
  { title: 'Priority', key: 'priority' },
  { title: 'Asset', key: 'asset_name' },
  { title: 'Issue', key: 'id' },
  { title: 'Summary', key: 'summary' },
  { title: 'Issue Status', key: 'status' },
  { title: 'Source', key: 'source' },
  { title: 'Reported Date', key: 'reported_date' },
  { title: 'Assigned', key: 'assigned_to' },
  // { title: 'Label', key: 'labels' },
  // { title: 'Vehicle', key: 'vehicle_id' },
  // { title: 'Priority', key: 'priority' },
  { title: 'Watchers', key: 'watchers' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

const selectedWorkOrder = ref<Partial<WorkOrder>>({} as Partial<WorkOrder>);
const layoutStore = useLayoutStore()
const workOrderEditDialog = ref(false);

const canCreateWorkOrder = computed(() => {
  if (selectedItems.value.length < 2) {
    return false;
  }
  const vehicleIds = selectedItems.value.map(item => item.asset_name);
  return new Set(vehicleIds).size === 1;
});

const closeWorkOrderEditDialog = () => {
  workOrderEditDialog.value = false;
};

const saveWorkOrder = async (workOrder: any) => {
  if (workOrder) {
    issueStore.createWorkOrderFromIssues({ ...workOrder, issue_ids: selectedItems.value.map(item => item.id) })
  }
  workOrderEditDialog.value = false;
  selectedItems.value = [];
}

const createWork = (vehicle: any) => {
  selectedWorkOrder.value = {
    vehicle_id: vehicle.asset_name,
    date_created: new Date().toISOString().slice(0, 10),
    status: 'Open',
    created_by: authStore?.user?.id,
    issue_ids: selectedItems.value.map(item => item.id)
  };
  workOrderEditDialog.value = true;
};

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: [{ text: 'Open', value: 'open' },
      { text: 'Close', value: 'closed' },
      { text: 'Resolved', value: 'resolved' },
      { text: 'Overdue', value: 'overdue' }],
      width: '300px',
    },
  ] as filterItem[]
})


const pagination = computed({
  get() {
    return issuePagination.value
  },
  set(value) {
    issueStore.setPagination(value);
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
  issueStore.fetchIssues(searchQuery.value);
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  issueStore.fetchIssues(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    issueStore.fetchIssues(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  issueStore.fetchIssues(searchQuery.value);
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
