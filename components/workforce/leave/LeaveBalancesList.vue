<!-- src/components/workforce/leave/LeaveBalancesList.vue -->

<template>
  <SharedUiServerTable :items="leaveBalances" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;" :items-length="total_items" dynamicSearch>

    <!-- Date Range Filter -->
    <!-- <template v-slot:filters>
      <div class="d-inline-flex">
        <SharedDateRangePicker color="primary" variant="solo" density="compact" hide-details
          v-model="selectedFilters.date_range" label="Select Range" style="width: 300px" />
      </div>
    </template> -->

    <!-- Date Range Filter -->
    <template v-slot:filters>
      <div class="d-inline-flex">
        <SharedYearRangePicker color="primary" variant="solo" density="compact" v-model="selectedFilters.date_range"
          label="Select Range" style="width: 300px" />
      </div>
    </template>

    <!-- Action Buttons -->
    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item small @click="$emit('adjust', item)" append-icon="mdi-pencil">Edit</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('adjust', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Balance
          </v-tooltip>
        </span>
      </div>
    </template>

    <!-- Employee Column -->
    <template v-slot:item.employee="{ item }">
      <SharedTableDynamicTechnicianItem :technician="item.employee" v-if="item?.employee" />
      <span v-else>N/A</span>
    </template>

    <!-- Leave Type Column -->
    <template v-slot:item.leave_type="{ item }">
      <span>{{ item.leave_type?.leave_type_name }}</span>
    </template>

    <!-- Year Column -->
    <template v-slot:item.year="{ item }">
      <span>{{ item.year }}</span>
    </template>

    <!-- Allocated Days Column -->
    <template v-slot:item.allocated_days="{ item }">
      <span>{{ item.allocated_days }}</span>
    </template>

    <!-- Used Days Column -->
    <template v-slot:item.used_days="{ item }">
      <span>{{ item.used_days }}</span>
    </template>

    <!-- Remaining Days Column -->
    <template v-slot:item.remaining_days="{ item }">
      <span>{{ item.remaining_days }}</span>
    </template>

    <!-- Carry Over Days Column -->
    <template v-slot:item.carry_over_days="{ item }">
      <span>{{ item.carry_over_days }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import type { LeaveBalance } from '@/types/workforce/leaveRecord';
import moment from 'moment';


const props = defineProps({
  leaveBalances: {
    type: Array as PropType<LeaveBalance[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['adjust']);

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>()
const selectedFilters = ref<Record<string, any>>({
  date_range: {
    start: moment().subtract(1, 'years').format('YYYY'),
    end: moment().format('YYYY'),
  }
})
const hoveredRow = ref<number | null>(null)

const leaveStore = LeaveStore();

const {
  leavePagination,
  totalLeaveBalanceItems: total_items,
  totalLeaveBalancePages: total_pages
} = storeToRefs(leaveStore);

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

const pagination = computed({
  get() {
    return leavePagination.value
  },
  set(value) {
    leaveStore.setLeavePagination(value);
  }
})


// Table Headers Definition
const tableHeaders = [
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Leave Type', key: 'leave_type', sortable: true },
  { title: 'Year', key: 'year' },
  { title: 'Allocated Days', key: 'allocated_days' },
  { title: 'Used Days', key: 'used_days' },
  { title: 'Remaining Days', key: 'remaining_days' },
  { title: 'Carry Over Days', key: 'carry_over_days' },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

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

<style scoped></style>