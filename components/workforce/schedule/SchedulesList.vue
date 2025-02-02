<template>
  <SharedUiCustomTable class="custom-table" :items="schedules" :headers="tableHeaders" :loading="loading"
    @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">
    <template v-slot:item.actions="{ item, index }">
      <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="confirmDelete(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu>
    </template>

    <template v-slot:item.employee="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.employee" :technician="item.employee" />
    </template>

    <template v-slot:item.shift="{ item }">
      <span>{{ item.shift?.shift_name || 'N/A' }}</span>
    </template>

    <template v-slot:item.shift_template="{ item }">
      <span>{{ item.shiftTemplate?.template_name || 'N/A' }}</span>
    </template>

    <template v-slot:item.schedule_date="{ item }">
      <span>{{ formatDate(item.schedule_date) }}</span>
    </template>

    <template v-slot:item.route="{ item }">
      <span>{{ item.route?.route_name || 'N/A' }}</span>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="statusColor(item.status)" dark>{{ item.status }}</v-chip>
    </template>
  </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Schedule } from '@/types/workforce/schedule';
import { ScheduleStore } from '@/stores/workforce/scheduleStore';
import { useLayoutStore } from '@/stores/useLayoutStore'; // Adjust the import as per actual store

const props = defineProps({
  schedules: {
    type: Array as PropType<Schedule[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit']);

const scheduleStore = ScheduleStore();
const layoutStore = useLayoutStore();
const hoveredRow = ref<number | null>(null)


const tableHeaders = [
  { title: 'Employee', key: 'employee', sortable: false },
  { title: 'Shift', key: 'shift', sortable: false },
  { title: 'Template', key: 'shift_template', sortable: false },
  { title: 'Date', key: 'schedule_date', sortable: true },
  { title: 'Route', key: 'route', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const statusColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'blue';
    case 'Completed':
      return 'green';
    case 'Cancelled':
      return 'red';
    default:
      return 'grey';
  }
};

// Delete Confirmation
const confirmDelete = async (schedule: Schedule) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete the schedule for "${schedule?.employee?.full_name}" on "${formatDate(schedule?.schedule_date)}"?`)

  if (confirm) {
    await scheduleStore.deleteSchedule(schedule.id);
  }
};
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>