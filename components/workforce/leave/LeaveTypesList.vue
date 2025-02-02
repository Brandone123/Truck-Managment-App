<!-- src/components/workforce/leave/LeaveTypesList.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :items-per-page="50" :items="sortedLeaveTypes" :headers="tableHeaders"
    :loading="loading" :show-footer-in-head="false" @hoveredRow="hoveredRow = $event;">

    <!-- Action Buttons -->
    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="deleteLeaveType(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Type
          </v-tooltip>
        </span>

        <span style="cursor: pointer;" v-if="!item.has_accruals && !item.has_requests && !item.has_balances">
          <v-icon dense @click="$emit('delete', item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Type
          </v-tooltip>
        </span>
      </div>
    </template>

    <!-- Description Column -->
    <template v-slot:item.description="{ item }">
      <span>{{ item.description || 'N/A' }}</span>
    </template>

    <!-- Max Days Column -->
    <template v-slot:item.max_days_per_year="{ item }">
      <span>{{ item.max_days_per_year }}</span>
    </template>

    <!-- Carry Over Allowed Column -->
    <template v-slot:item.carry_over_allowed="{ item }">
      <v-icon color="green" v-if="item.carry_over_allowed">mdi-check</v-icon>
      <v-icon color="red" v-else>mdi-close</v-icon>
    </template>
  </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { PropType } from 'vue';
import type { LeaveType } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';

const props = defineProps({
  leaveTypes: {
    type: Array as PropType<LeaveType[]>,
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
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const leaveStore = LeaveStore();

const tableHeaders = [
  { title: 'Leave Type Name', key: 'leave_type_name', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Max Days Per Year', key: 'max_days_per_year', sortable: true },
  { title: 'Carry Over Allowed', key: 'carry_over_allowed', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
];


const sortedLeaveTypes = computed(() => {
  return (props.leaveTypes || []).sort((a, b) => {
    let first = (a.leave_type_name ?? '')?.toLowerCase();
    let second = (b.leave_type_name ?? '').toLowerCase();
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  });
})

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

const searchQuery = computed(() => {
return {}
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