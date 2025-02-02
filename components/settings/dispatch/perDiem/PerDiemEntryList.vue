<!-- src/components/dispatch/PerDiemEntryList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePerDiemEntryStore } from '@/stores/settings/dispatch/perDiemEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import PerDiemEntryDialog from '@/components/settings/dispatch/perDiem/PerDiemEntryDialog.vue';
import type { PerDiemEntryInfo } from '@/types/dispatch/perDiemEntry';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const perDiemEntryStore = usePerDiemEntryStore();
const { perDiemEntryList } = storeToRefs(perDiemEntryStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  perDiemEntryStore.fetchPerDiemEntryList(props.matrixId);
});

const perDiemEntryHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'EQUIPMENT TYPE', key: 'dispatch_equipment_type_id' },
  { title: 'CHARGE CODE', key: 'charge_code' },
  { title: 'FREE DAYS', key: 'free_days' },
  { title: 'FIRST RATE', key: 'first_rate' },
  { title: 'FIRST RATE DAYS', key: 'first_rate_days' },
  { title: 'SECOND RATE', key: 'second_rate' },
  { title: 'SECOND RATE DAYS', key: 'second_rate_days' },
  { title: 'FINAL RATE', key: 'final_rate' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedPerDiemEntry = ref<PerDiemEntryInfo>({});
const updatingPerDiemEntry = ref(false);
const perDiemEntryDialog = ref(false);

const editPerDiemEntry = (entry: PerDiemEntryInfo) => {
  editedPerDiemEntry.value = { ...entry };
  updatingPerDiemEntry.value = true;
  perDiemEntryDialog.value = true;
};

const deletePerDiemEntry = async (entryId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this entry?');
  if (confirm) {
    perDiemEntryStore.deletePerDiemEntry(props.matrixId, entryId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="perDiemEntryDialog = true">
        <v-icon>mdi-plus</v-icon> Add Entry
      </v-btn>
      <PerDiemEntryDialog
        :show="perDiemEntryDialog"
        @update:show="perDiemEntryDialog = $event"
        :updating="updatingPerDiemEntry"
        :item="editedPerDiemEntry"
        :matrixId="props.matrixId"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="perDiemEntryHeaders"
        :items="perDiemEntryList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editPerDiemEntry(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deletePerDiemEntry(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
