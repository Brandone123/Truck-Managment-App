<template>
  <SharedUiServerTable class="custom-table" :items="correctionRequests" :headers="tableHeaders" :loading="loading"
    :show-footer-in-head="false" :sticky-top="true" :sticky-top-offset="52" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;" :items-length="total_items" dynamicSearch>

    <template v-slot:filters>
      <div class="d-inline-flex">
        <SharedDateRangePicker color="primary" variant="solo" density="compact" hide-details
          v-model="selectedFilters.date_range" label="Select Range" style="width: 300px" />
      </div>
    </template>

    <template v-slot:item.actions="{ item, index }">
      <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="$emit('view', item)">
          <template v-slot:append>
            <v-icon color="primary">mdi-eye</v-icon>
          </template>
          View</v-list-item>
        <v-list-item v-if="['Pending', 'Denied'].includes(item.status)" @click="$emit('approveRequest', item)">
          <template v-slot:append>
            <v-icon color="primary">mdi-check</v-icon>
          </template>
          Approve Request</v-list-item>
        <v-list-item v-if="['Pending', 'Approved'].includes(item.status)" @click="$emit('denyRequest', item)"
          append-icon="mdi-window-close">
          <template v-slot:append>
            <v-icon color="primary">mdi-window-close</v-icon>
          </template>
          Deny Request</v-list-item>
        <v-list-item @click="$emit('delete', item.id)">
          <template v-slot:append>
            <v-icon color="error">mdi-delete</v-icon>
          </template>
          Delete</v-list-item>
      </SharedTableActionMenu>
    </template>

    <template v-slot:item.employee="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.employee" :technician="item.employee" />
    </template>

    <template v-slot:item.requested_at="{ item }">
      <span v-if="item.requested_at">{{ moment(item.requested_at).format('dddd, MMM Do YYYY, h:mm A') }}</span>
    </template>

    <template v-slot:item.attendance_id="{ item }">
      {{ item.attendance_id }}
    </template>

    <template v-slot:item.attendance_record.date="{ item }">
      <span v-if="item.attendance_record?.date">{{ moment(item.attendance_record.date).format('dddd, MMM Do YYYY')
        }}</span>
    </template>

    <template v-slot:item.corrected_clock_out_time="{ item }">
      <span>{{ formatTime(item.requested_at) }}</span>
    </template>
    <template v-slot:item.corrected_clock_in_time="{ item }">
      <span>{{ formatTime(item.corrected_clock_in_time) }}</span>
    </template>
    <template v-slot:item.attendance_record.clock_in_time="{ item }">
      <span v-if="item.attendance_record?.clock_in_time">{{ formatTime(item.attendance_record.clock_in_time) }}</span>
    </template>
    <template v-slot:item.attendance_record.clock_out_time="{ item }">
      <span v-if="item.attendance_record?.clock_out_time">{{ formatTime(item.attendance_record.clock_out_time) }}</span>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" small>{{ item.status }}</v-chip>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TimeCorrectionRequest } from '@/types/workforce/attendanceRecord';
import { useTimeCorrectionRequestStore } from '@/stores/workforce/timeCorrectionRequestStore';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const props = defineProps({
  correctionRequests: {
    type: Array as PropType<TimeCorrectionRequest[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()

const selectedFilters = ref<Record<string, any>>({
  date_range: {
    start: moment().subtract(6, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  }
})
const hoveredRow = ref<number | null>(null)

const correctionRequestStore = useTimeCorrectionRequestStore();
const {
  pagination: timeCorrectionPagination,
  total_items,
  total_pages
} = storeToRefs(correctionRequestStore);

const pagination = computed({
  get() {
    return timeCorrectionPagination.value
  },
  set(value) {
    correctionRequestStore.setPagination(value);
  }
})

const tableHeaders = [
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Attendance Record ID', key: 'attendance_id' },
  { title: 'Attendance Date', key: 'attendance_record.date' },
  { title: 'Requested At', key: 'requested_at' },
  { title: 'Original Clock In', key: 'attendance_record.clock_in_time' },
  { title: 'Corrected Clock In', key: 'corrected_clock_in_time' },
  { title: 'Original Clock Out', key: 'attendance_record.clock_out_time' },
  { title: 'Corrected Clock Out', key: 'corrected_clock_out_time' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  const date = new Date(timeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'green';
    case 'Denied':
      return 'red';
    default:
      return 'orange';
  }
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

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

defineExpose({
  searchQuery,
  setSelectedItems
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