<!-- src/components/dispatch/RateMatrixEntryList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchRateMatrixEntryStore } from '@/stores/settings/dispatch/dispatchRateMatrixEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import RateMatrixEntryDialog from '@/components/settings/dispatch/rate/RateMatrixEntryDialog.vue';
import type { DispatchRateMatrixEntryInfo } from '@/types/dispatch/dispatchRateMatrixEntry';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const dispatchRateMatrixEntryStore = useDispatchRateMatrixEntryStore();
const { dispatchRateMatrixEntryList } = storeToRefs(dispatchRateMatrixEntryStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  dispatchRateMatrixEntryStore.fetchDispatchRateMatrixEntryList(props.matrixId);
});

const rateMatrixEntryHeaders = ref([
  { title: 'ID', key: 'id' },
  // Include relevant fields based on your application needs
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedRateMatrixEntry = ref<DispatchRateMatrixEntryInfo>({});
const updatingRateMatrixEntry = ref(false);
const rateMatrixEntryDialog = ref(false);

const editRateMatrixEntry = (entry: DispatchRateMatrixEntryInfo) => {
  editedRateMatrixEntry.value = { ...entry };
  updatingRateMatrixEntry.value = true;
  rateMatrixEntryDialog.value = true;
};

const deleteRateMatrixEntry = async (entryId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this entry?');
  if (confirm) {
    dispatchRateMatrixEntryStore.deleteDispatchRateMatrixEntry(props.matrixId, entryId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="rateMatrixEntryDialog = true">
        <v-icon>mdi-plus</v-icon> Add Entry
      </v-btn>
      <RateMatrixEntryDialog
        :show="rateMatrixEntryDialog"
        @update:show="rateMatrixEntryDialog = $event"
        :updating="updatingRateMatrixEntry"
        :item="editedRateMatrixEntry"
        :matrixId="props.matrixId"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="rateMatrixEntryHeaders"
        :items="dispatchRateMatrixEntryList"
      >
        <!-- Customize slots based on the fields you wish to display -->
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editRateMatrixEntry(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteRateMatrixEntry(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
