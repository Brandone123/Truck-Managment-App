<!-- src/components/dispatch/DispatchPayMatrixEntryList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchPayMatrixEntryStore } from '@/stores/settings/dispatch/dispatchPayMatrixEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import DispatchPayMatrixEntryDialog from '@/components/settings/dispatch/dispatchPay/DispatchPayMatrixEntryDialog.vue';
import type { DispatchPayMatrixEntryInfo } from '@/types/dispatch/dispatchPayMatrixEntry';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const dispatchPayMatrixEntryStore = useDispatchPayMatrixEntryStore();
const { dispatchPayMatrixEntryList } = storeToRefs(dispatchPayMatrixEntryStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  dispatchPayMatrixEntryStore.fetchDispatchPayMatrixEntryList(props.matrixId);
});

const dispatchPayMatrixEntryHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'FROM ZONE', key: 'from_zone' },
  { title: 'TO ZONE', key: 'to_zone' },
  { title: 'RATE', key: 'rate' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedDispatchPayMatrixEntry = ref<DispatchPayMatrixEntryInfo>({});
const updatingDispatchPayMatrixEntry = ref(false);
const dispatchPayMatrixEntryDialog = ref(false);

const editDispatchPayMatrixEntry = (entry: DispatchPayMatrixEntryInfo) => {
  editedDispatchPayMatrixEntry.value = { ...entry };
  updatingDispatchPayMatrixEntry.value = true;
  dispatchPayMatrixEntryDialog.value = true;
};

const deleteDispatchPayMatrixEntry = async (entryId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this entry?');
  if (confirm) {
    dispatchPayMatrixEntryStore.deleteDispatchPayMatrixEntry(props.matrixId, entryId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="dispatchPayMatrixEntryDialog = true">
        <v-icon>mdi-plus</v-icon> Add Entry
      </v-btn>
      <DispatchPayMatrixEntryDialog
        :show="dispatchPayMatrixEntryDialog"
        @update:show="dispatchPayMatrixEntryDialog = $event"
        :updating="updatingDispatchPayMatrixEntry"
        :item="editedDispatchPayMatrixEntry"
        :matrixId="props.matrixId"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="dispatchPayMatrixEntryHeaders"
        :items="dispatchPayMatrixEntryList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editDispatchPayMatrixEntry(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteDispatchPayMatrixEntry(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
