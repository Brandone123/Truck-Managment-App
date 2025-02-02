<!-- src/components/workforce/leave/LeaveAccrualsList.vue -->

<template>
  <SharedUiServerTable :items="leaveAccruals" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;" :items-length="total_items" dynamicSearch>


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
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="deleteLeaveAccrual(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="primary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Accrual
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

    <!-- Accrual Date Column -->
    <template v-slot:item.accrual_date="{ item }">
      <span>{{ formatDate(item.accrual_date) }}</span>
    </template>

    <!-- Accrual Days Column -->
    <template v-slot:item.accrual_days="{ item }">
      <span>{{ item.accrual_days }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { PropType } from 'vue';
import type { LeaveAccrual } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import moment from 'moment';
import { storeToRefs } from 'pinia';


const props = defineProps({
  leaveAccruals: {
    type: Array as PropType<LeaveAccrual[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete']);

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
  leaveAccrualPagination,
  totalAccrualItems: total_items,
  totalAccrualPages: total_pages
} = storeToRefs(leaveStore);

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}


const pagination = computed({
  get() {
    return leaveAccrualPagination.value
  },
  set(value) {
    leaveStore.setLeaveAccrualPagination(value);
  }
})

const tableHeaders = [
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Leave Type', key: 'leave_type', sortable: true },
  { title: 'Accrual Date', key: 'accrual_date' },
  { title: 'Accrual Days', key: 'accrual_days' },
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

/**
 * Delete a leave accrual.
 *
 * @param leaveAccrual The leave accrual to delete.
 */
const deleteLeaveAccrual = async (leaveAccrual: LeaveAccrual) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete accrual #${leaveAccrual.id}?`)
  if (confirm) {
    // Implement delete functionality in the store if needed
    // Example:
    // await leaveStore.deleteLeaveAccrual(leaveAccrual.accrual_id);
    useLayoutStore().setStatusMessage('Delete functionality not implemented yet.', 'warning');
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