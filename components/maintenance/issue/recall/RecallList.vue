<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="needs action" class="text-none">
          <span class="mr-1 bg-error" style="width: 8px; height: 8px; border-radius: 50%;"></span>Needs Action
          <v-chip class="ml-1 bg-error" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ recallSummary?.["needs action"] || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="Open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Open
          <v-chip class="ml-1 bg-secondary" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ recallSummary?.open || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip class="ml-1 bg-primary" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ recallSummary?.resolved || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="acknowledged" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Acknowledged
          <v-chip class="ml-1 bg-orange" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ recallSummary?.acknowledged || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip class="ml-1 bg-yellow" density="comfortable">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ recallSummary?.pending || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiServerTable class="custom-table" show-select :sticky-top="true" :sticky-top-offset="95" :showFooterInHead="false"
      :headers="tableHeaders" :items="filteredRecall" :loading="loading"
      @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems" return-object
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <!-- <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" v-if="(item.status || '').toLowerCase() === 'needs_action'"
          :color="getStatusColor(item.status)">
          Needs Action
        </v-chip>
        <v-chip density="compact" variant="flat" v-else :color="getStatusColor(item.status)">
          {{ statuses[item.status.toLocaleLowerCase()] }}
        </v-chip>
      </template> -->
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" :color="getStatusColor(item.status)">{{
          item.status }}</v-chip>
      </template>
      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense
          @click="$emit('viewDetails', item.id)">
          {{ item.id }}
        </span>
      </template>
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="viewRecall(item.id)" append-icon="mdi-pencil">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" v-if="item.vehicle_id" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.issued_date="{ item }">

        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ item.issued_date }}
          <v-tooltip activator="parent" location="top" location-strategy="connected">
            {{ getRelativeDateTime(item.issued_date) }}
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
      <template v-slot:item.summary="{ item }">
        <span>{{ item.summary.length > 100 ? item.summary.slice(0, 100) + '...' : item.summary }}</span>
      </template>
      <template v-slot:item.manufacturer="{ item }">
        <v-chip v-if="item.manufacturer" class="font-weight-bold text-secondary">{{ item.manufacturer ?? 'N/A'
          }}</v-chip>
        <div class="text-center" v-else>---</div>
      </template>
    </SharedUiServerTable>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Recall } from '@/types/maintenance/recall';
import { useRouter } from 'vue-router';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';
import moment from 'moment'

const router = useRouter();

const props = defineProps({
  recalls: {
    type: Array as PropType<Recall[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const recallStore = useRecallStore();
const { pagination: recallPagination, getRecallList, total_items, loadingSummary, recallSummary } = storeToRefs(recallStore);

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)


const getStatusColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'open':
      return 'secondary';
    case 'needs action':
      return 'error';
    case 'resolved_issue':
    case 'resolved':
      return 'primary';
    case 'acknowledged':
      return 'orange';
    case 'pending':
      return 'yellow';
    default:
      return 'grey'
  }
}

const tableHeaders = [
  // { title: 'Recall ID', key: 'id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  // { title: 'Date Imported', key: 'date' },
  { title: 'Issued At', key: 'issued_date' },
  { title: 'Summary', key: 'summary' },
  { title: 'Status', key: 'status' },
  { title: 'Issue', key: 'issue_id' },
  { title: 'Manufacturer', key: 'manufacturer' },
  { title: 'NHTSA Campaign Number', key: 'nhtsa_campaign_number' },
  { title: 'Work Order', key: 'work_order' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },

];


const statuses = ref({
  'needs action': 'Needs Action',
  open: 'Open',
  resolved_issue: 'Resolved',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
  pending: 'Pending',
})

const activeFilter = ref<string>('all')

const filteredRecall = computed(() => {
  return getRecallList.value.map(recall => {
    return {
      ...recall,
    };
  }).filter(item => activeFilter.value === 'all' || item.status === activeFilter.value);
});

const viewRecall = (recallId: number) => {
  router.push(`/maintenance/RecallManagement/${recallId}`)
};

const viewIssue = (issueId: number) => {
  router.push(`/maintenance/IssuesManagement/${issueId}`)
};

const viewWorkOrder = (workOrderId: number) => {
  router.push(`/maintenance/WorkOrders/${workOrderId}`)
};

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

onMounted(() => {
  recallStore.fetchRecalls(searchQuery.value);
});

const pagination = computed({
  get() {
    return recallPagination.value
  },
  set(value) {
    recallStore.setPagination(value);
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
  recallStore.fetchRecalls(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recallStore.fetchRecalls(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recallStore.fetchRecalls(searchQuery.value);
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