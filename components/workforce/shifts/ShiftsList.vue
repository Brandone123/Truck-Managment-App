<template>
  <SharedUiCustomTable class="custom-table" :items="shifts" :headers="tableHeaders" :loading="loading"
    :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">

    <template v-slot:item.actions="{ item, index }">
      <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="confirmDelete(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu>
    </template>

    <template v-slot:item.start_time="{ item }">
      <span>{{ formatTime(item.start_time) }}</span>
    </template>

    <template v-slot:item.end_time="{ item }">
      <span>{{ formatTime(item.end_time) }}</span>
    </template>
  </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Shift } from '@/types/workforce/schedule';
import { ScheduleStore } from '@/stores/workforce/scheduleStore';
import { useLayoutStore } from '@/stores/useLayoutStore'; // Adjust the import as per actual store

const props = defineProps({
  shifts: {
    type: Array as PropType<Shift[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete']);

const scheduleStore = ScheduleStore();
const layoutStore = useLayoutStore();

const hoveredRow = ref<number | null>(null)

const tableHeaders = [
  { title: 'Name', key: 'shift_name', sortable: true },
  { title: 'Start Time', key: 'start_time', sortable: true },
  { title: 'End Time', key: 'end_time', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatTime = (timeString: string) => {
  const date = new Date(`1970-01-01T${timeString}Z`);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Delete Confirmation
const confirmDelete = async (shift: Shift) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete the shift "${shift?.shift_name}"?`)

  if (confirm) {
    emit('delete', shift.id)
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