<!-- src/components/workforce/leave/LeaveRequestsList.vue -->

<template>
  <SharedUiServerTable :items="leaveRequests" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;" :items-length="totalLeaveItems" dynamicSearch>

    <!-- Date Range Filter -->
    <template v-slot:filters>
      <div class="d-inline-flex">
        <SharedDateRangePicker color="primary" variant="solo" density="compact" hide-details
          v-model="selectedFilters.date_range" label="Select Range" style="width: 300px" />
      </div>
    </template>

    <!-- Action Buttons -->
    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="$emit('view', item)" append-icon="mdi-eye">View</v-list-item>
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="deleteLeaveRequest(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View Request
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Request
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Request
          </v-tooltip>
        </span>
      </div>
    </template>

    <!-- Employee Column -->
    <template v-slot:item.employee="{ item }">
      <SharedTableDynamicTechnicianItem :technician="item.employee" v-if="item.employee" />
      <span v-else>N/A</span>
    </template>

    <!-- Leave Type Column -->
    <template v-slot:item.leave_type="{ item }">
      <span>{{ item.leave_type?.leave_type_name }}</span>
    </template>

    <!-- Start Date Column -->
    <template v-slot:item.start_date="{ item }">
      <span>{{ formatDate(item.start_date) }}</span>
    </template>

    <!-- End Date Column -->
    <template v-slot:item.end_date="{ item }">
      <span>{{ formatDate(item.end_date) }}</span>
    </template>

    <!-- Total Days Column -->
    <template v-slot:item.total_days="{ item }">
      <span>{{ item.total_days }}</span>
    </template>

    <!-- Status Column -->
    <template v-slot:item.status="{ item }">
      <v-chip :color="statusColor(item.status)" dark>{{ item.status }}</v-chip>
    </template>

    <!-- Approved By Column -->
    <template v-slot:item.approver="{ item }">
      <span v-if="item.approver">{{ item.approver.first_name }} {{ item.approver.last_name }}</span>
      <span v-else>N/A</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { PropType } from 'vue';
import type { LeaveRequest } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import moment from 'moment';


const props = defineProps({
  leaveRequests: {
    type: Array as PropType<LeaveRequest[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete', 'view']);

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()

const selectedFilters = ref<Record<string, any>>({
  date_range: {
    start: moment().startOf('year').format('YYYY-MM-DD'),
    end: moment().endOf('year').format('YYYY-MM-DD')
  }
})

const hoveredRow = ref<number | null>(null)

const leaveStore = LeaveStore();
const layoutStore = useLayoutStore();

const {
  leaveBalancePagination,
  totalLeaveItems,
  totalLeavePages
} = storeToRefs(leaveStore);

const pagination = computed({
  get() {
    return leaveBalancePagination.value
  },
  set(value) {
    leaveStore.setLeaveBalancePagination(value);
  }
})

const tableHeaders = [
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Leave Type', key: 'leave_type', sortable: true },
  { title: 'Start Date', key: 'start_date' },
  { title: 'End Date', key: 'end_date' },
  { title: 'Total Days', key: 'total_days', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Approved By', key: 'approver', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

/**
 * Format date string to YYYY-MM-DD.
 *
 * @param dateString The date string to format.
 * @returns Formatted date string.
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    payload['page'] = 1
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  // if (activeFilter.value != 'all') {
  //   payload['filters'].status = activeFilter.value
  // }

  return payload
})

/**
 * Determine chip color based on leave request status.
 *
 * @param status Leave request status.
 * @returns Color string.
 */
const statusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'green';
    case 'Rejected':
      return 'red';
    case 'Cancelled':
      return 'grey';
    default:
      return 'blue';
  }
};

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

defineExpose({
  searchQuery,
  setSelectedItems
})

// watch(() => selectedFilters.value, () => {
//   selectedItems.value = [];
//   leaveStore.fetchLeaveRequests(searchQuery.value);
// }, { deep: true })

// watch(() => pagination.value, (newVal, oldVal) => {
//   if (!_isEqual(newVal, oldVal)) {
//     selectedItems.value = [];
//     leaveStore.fetchLeaveRequests(searchQuery.value);
//   }
// }, { deep: true })

// watch(() => activeFilter.value, () => {
//   selectedItems.value = [];
//   leaveStore.fetchLeaveRequests(searchQuery.value);
// })

</script>