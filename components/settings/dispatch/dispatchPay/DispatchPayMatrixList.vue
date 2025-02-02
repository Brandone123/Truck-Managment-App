<!-- src/components/dispatch/DispatchPayMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchPayMatrixStore } from '@/stores/settings/dispatch/dispatchPayMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import DispatchPayMatrixDialog from '@/components/settings/dispatch/dispatchPay/DispatchPayMatrixDialog.vue';
import type { DispatchPayMatrixInfo } from '@/types/dispatch/dispatchPayMatrix';
import { useRouter } from 'vue-router';

const dispatchPayMatrixStore = useDispatchPayMatrixStore();
const { dispatchPayMatrixList } = storeToRefs(dispatchPayMatrixStore);
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  dispatchPayMatrixStore.fetchDispatchPayMatrixList();
});

const dispatchPayMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedDispatchPayMatrix = ref<DispatchPayMatrixInfo>({});
const updatingDispatchPayMatrix = ref(false);
const dispatchPayMatrixDialog = ref(false);

const editDispatchPayMatrix = (matrix: DispatchPayMatrixInfo) => {
  editedDispatchPayMatrix.value = { ...matrix };
  updatingDispatchPayMatrix.value = true;
  dispatchPayMatrixDialog.value = true;
};

const deleteDispatchPayMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog(
    'Are you sure you want to delete this Dispatch Pay Matrix?'
  );
  if (confirm) {
    dispatchPayMatrixStore.deleteDispatchPayMatrix(matrixId);
  }
};

const viewDispatchPayMatrixEntries = (matrix: DispatchPayMatrixInfo) => {
  router.push({ name: 'DispatchPayMatrixEntries', params: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="dispatchPayMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Dispatch Pay Matrix
      </v-btn>
      <DispatchPayMatrixDialog
        :show="dispatchPayMatrixDialog"
        @update:show="dispatchPayMatrixDialog = $event"
        :updating="updatingDispatchPayMatrix"
        :item="editedDispatchPayMatrix"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="dispatchPayMatrixHeaders"
        :items="dispatchPayMatrixList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editDispatchPayMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewDispatchPayMatrixEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteDispatchPayMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
