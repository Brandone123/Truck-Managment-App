<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Open
          <v-chip density="compact" class="ml-1 bg-secondary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ workOrderSummary?.open ?? 0 }}</span></v-chip></v-tab>
        <v-tab value="in progress" class="text-none">
          <span class="mr-1 bg-black " style="width: 8px; height: 8px; border-radius: 50%;"></span> In Progress
          <v-chip density="compact" class="ml-1">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ workOrderSummary['in progress'] ?? 0 }}</span></v-chip></v-tab>
            <v-tab value="completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip density="compact" class="ml-1 bg-primary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>
              {{ workOrderSummary.completed ?? 0 }}</span></v-chip></v-tab>
        <v-tab value="pending" class="text-none"><span class="mr-1 bg-yellow"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip density="compact" class="ml-1 bg-yellow">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ workOrderSummary.pending ?? 0 }}</span></v-chip></v-tab>
              <v-tab value="draft" class="text-none">
          <span class="mr-1 bg-grey" style="width: 8px; height: 8px; border-radius: 50%;"></span> Draft
          <v-chip density="compact" class="ml-1 bg-grey">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ workOrderSummary?.draft ?? 0 }}</span></v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiServerTable class="custom-table" :show-footer-in-head="false" :sticky-top="true" :sticky-top-offset="94"
      :items="workOrders" :headers="tableHeaders" :selectable="true" v-model="selectedItems" show-select return-object
      :items-per-page="pagination.itemsPerPage" :loading="loading" :items-length="total_items"
      :sort-by="pagination.sortBy" @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">

      <!-- <template v-slot:headers>
          <v-data-table-headers sticky></v-data-table-headers>
      </template> -->


      <!-- Let Table Render Filters (Select Fields Only) -->
      <!-- <template v-slot:filters>
        <SharedInputTechnicianNameAutoCompleteInput v-model="selectedFilters['assigned_to']" variant="solo" flat
          density="compact" style="width: 300px" :label="selectEmployee" hide-details placeholder="Assigned Technician" />
      </template> -->

      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="viewDetails(item.id)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>

        <!-- <v-icon class="ml-2" color="primary" @click="viewDetails(item.id)">mdi-eye</v-icon>
          <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon> -->
      </template>

      <!-- <template v-slot:headers>
          <v-data-table-headers sticky></v-data-table-headers>
      </template> -->
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize"
          :variant="hasWorkInProgress(item.line_items) ? 'tonal' : 'flat'" v-if="item.status"
          :color="getStatusColor(item.status)">
          <template v-slot:prepend v-if="hasWorkInProgress(item.line_items)">
            <v-icon size="small">mdi-alarm-check</v-icon>
          </template>
          {{ item.status }}
        </v-chip>
        <span v-else></span>
      </template>


      <template v-slot:item.assigned_to="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.assigned_to"
          :technician="(item.assigned_to_user as EmployeeInfo)" />
        <span v-else>N/A</span>
      </template>
      <!-- <template v-slot:item.service_tasks="{item}">
        <div v-if="service_tasks.length > 3"></div>
        <div v-else>
          <span v-for="(item,i) in item.line_items"></span>
        </div>
      </template> -->

      <template v-slot:item.line_items="{ item }">
        <div v-if="item.line_items != null">
          <div v-if="item.line_items.length <= 3" v-for="(lineItem, i) in item.line_items">
            <SharedTableDynamicServiceTask :serviceTask="lineItem.service_task" />
          </div>

          <div v-else>
            <div v-for="(lineItem, i) in item.line_items.slice(0, 3)">
              <SharedTableDynamicServiceTask :serviceTask="lineItem.service_task" />
            </div>
            <div class="text-primary">+ {{ item.line_items.length - 3 }} more</div>
          </div>
        </div>
      </template>

      <template v-slot:item.issues="{ item }">
        <div v-if="item.issues != null">
          <div v-if="item.issues.length <= 3" v-for="(issue, i) in item.issues">
            <IssueMenu :issue="issue" />
          </div>

          <div v-else>
            <div v-for="(issue, i) in item.issues.slice(0, 3)">
              <IssueMenu :issue="issue" />
            </div>
            <div class="text-primary">+ {{ item.issues.length - 3 }} more</div>
          </div>
        </div>
      </template>

      <template v-slot:item.id="{ item }">
        #{{ item.id }}
      </template>


      <template v-slot:item.created_at="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.created_at).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.created_at) }}
          </v-tooltip>
        </span>
      </template>

      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" v-if="item.priority"
          :color="getPriorityColor(item.priority)">{{
            item.priority
          }}</v-chip>
        <span v-else></span>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" />
      </template>
    </SharedUiServerTable>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { filterItem } from '~/types/layout/table';
import type { EmployeeInfo } from '~/types/store/employee';
import IssueMenu from './components/WorkOrderTableIssueMenu.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const router = useRouter();
import moment from 'moment';


const workOrderStore = useWorkOrderStore();
const {
  workOrders,
  loading,
  workOrderSummary,
  loadingSummary,
  pagination: workOrderPagination,
  total_items,
  total_pages
} = storeToRefs(workOrderStore);

// const props = defineProps({
//   // workOrders: {
//   //   type: Array as PropType<WorkOrder[]>,
//   //   required: true,
//   // },
//   loading: {
//     type: Boolean,
//     default: false,
//   },
// });

onMounted(() => {
  workOrderStore.fetchWorkOrders(searchQuery.value)
})

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const pagination = computed({
  get() {
    return workOrderPagination.value
  },
  set(value) {
    workOrderStore.setPagination(value);
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
  workOrderStore.fetchWorkOrders(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    workOrderStore.fetchWorkOrders(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  workOrderStore.fetchWorkOrders(searchQuery.value);
})

const viewDetails = (workOrderId: number) => {
  router.push(`/maintenance/WorkOrders/${workOrderId}`);
};

const availableFilters = computed(() => {
  return [
    // {
    //   title: 'Customer',
    //   key: 'customer_id',
    //   items: customerList.value.map(item => ({ value: item.id, text: item.name })),
    //   width: '300px',
    // }
  ];
})

const hasWorkInProgress = (line_items: Array<any>) => {
  return line_items?.map((lineitem: any) => lineitem.labor)?.reduce((accumulator: Array<any>, currentValue: any) => {
    return accumulator.concat(currentValue);
  }, [])
    ?.filter((item: any) => Boolean(item?.start_time) && !Boolean(item?.end_time) && Boolean(item.user_id)).length > 0
}

const tableHeaders = ref<any[]>([
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Number', key: 'id' },
  { title: 'Status', key: 'status' },
  { title: 'Repair Priority Class', key: 'priority' },
  { title: 'Date Created', key: 'created_at' },
  { title: 'Assigned Technician', key: 'assigned_to' },
  { title: 'Service Tasks', key: 'line_items' },
  { title: 'Resolved Issues', key: 'issues' },
  // { title: 'Watchers', key: 'watchers' },
  // { title: 'Operator', key: 'operator_id' },
  { title: '', key: 'actions', sortable: false, width: '200px', align:'end' },
]);


const getStatusColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'completed':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'open':
      return 'secondary';
    case 'in progress':
      return 'black';
    case 'draft':
      return 'grey'
    default:
      return 'gray'
  }
}

const getPriorityColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'scheduled':
      return 'green';
    case 'non-scheduled':
      return 'secondary';
    case 'emergency':
      return 'alert';
  }
}


const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: ['Open', 'In Progress', 'Completed'],
      width: '300px',
    },
  ] as filterItem[]
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