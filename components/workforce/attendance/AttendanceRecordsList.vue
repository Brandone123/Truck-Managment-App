<template>
  <SharedUiServerTable class="custom-table" :items="attendanceRecords" :headers="tableHeaders" :loading="loading"
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
          View
        </v-list-item>
        <v-list-item @click="$emit('edit', item)">
          <template v-slot:append>
            <v-icon color="primary">mdi-pencil</v-icon>
          </template>
          Edit</v-list-item>
        <v-list-item @click="confirmDelete(item)">
          <template v-slot:append>
            <v-icon color="error">mdi-delete</v-icon>
          </template>
          Delete</v-list-item>
      </SharedTableActionMenu>
    </template>

    <template v-slot:item.employee="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.employee" :technician="item.employee" />
    </template>

    <template v-slot:item.date="{ item }">
      <span>{{ formatDate(item.date) }}</span>
    </template>

    <template v-slot:item.clock_in_time="{ item }">
      <span>{{ formatTime(item.clock_in_time) }}</span>
    </template>

    <template v-slot:item.clock_out_time="{ item }">
      <span>{{ formatTime(item.clock_out_time) }}</span>
    </template>

    <template v-slot:item.total_hours="{ item }">
      <span v-if="item.total_hours">{{ formatTimeDuration(item.total_hours) }}</span>
    </template>

    <template v-slot:item.is_late="{ item }">
      <v-icon color="primary" v-if="item.is_late">mdi-check-circle</v-icon>
      <v-icon color="secondary" v-else>mdi-window-close</v-icon>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import type { AttendanceRecord } from '@/types/workforce/attendanceRecord';
import { AttendanceStore } from '@/stores/workforce/attendanceStore';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const props = defineProps({
  attendanceRecords: {
    type: Array as PropType<AttendanceRecord[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view', 'edit', 'delete']);
const layoutStore = useLayoutStore();

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()

const selectedFilters = ref<Record<string, any>>({
  date_range: {
    start: moment().subtract(6, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  }
})

const hoveredRow = ref<number | null>(null)

const attendanceStore = AttendanceStore();
const {
  pagination: attendancePagination,
  total_items,
  total_pages
} = storeToRefs(attendanceStore);

const pagination = computed({
  get() {
    return attendancePagination.value
  },
  set(value) {
    attendanceStore.setPagination(value);
  }
})

const tableHeaders = [
  { title: 'ID', value: 'id', sortable: true },
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Date', key: 'date' },
  { title: 'Clock In', key: 'clock_in_time' },
  { title: 'Clock Out', key: 'clock_out_time' },
  { title: 'Duration', key: 'total_hours' },
  { title: 'Late', key: 'is_late', sortable: false },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatDate = (dateString: string) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  const date = new Date(timeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}`;
};


const formatTimeDuration = (decimalHours: number) => {
  const duration = moment.duration(decimalHours, "hours");
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (hours === 0 && minutes === 0) {
    return `${seconds}sec`;
  } else if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}hr`;
  }

  return `${hours}hr ${minutes}min`;
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


// Delete Confirmation
const confirmDelete = async (attendanceRecord: AttendanceRecord) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this attendance record?`)

  if (confirm) {
    emit('delete', attendanceRecord.id)
  }
};

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