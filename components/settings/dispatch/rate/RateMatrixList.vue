<!-- src/components/dispatch/RateMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchRateMatrixStore } from '@/stores/settings/dispatch/dispatchRateMatrixStore';
import { useDispatchRateMethodStore } from '@/stores/settings/dispatch/dispatchRateMethodStore';
import { useDispatchRateTypeStore } from '@/stores/settings/dispatch/dispatchRateTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import RateMatrixDialog from '@/components/settings/dispatch/rate/RateMatrixDialog.vue';
import type { DispatchRateMatrixInfo } from '@/types/dispatch/dispatchRateMatrix';
import { useRouter } from 'vue-router';

const dispatchRateMatrixStore = useDispatchRateMatrixStore();
const { dispatchRateMatrixList } = storeToRefs(dispatchRateMatrixStore);
const dispatchRateMethodStore = useDispatchRateMethodStore();
const dispatchRateTypeStore = useDispatchRateTypeStore();
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  dispatchRateMatrixStore.fetchDispatchRateMatrixList();
  dispatchRateMethodStore.fetchDispatchRateMethodList();
  dispatchRateTypeStore.fetchDispatchRateTypeList();
});

const rateMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'MATRIX NO', key: 'matrix_no' },
  { title: 'NAME', key: 'name' },
  { title: 'RATE METHOD', key: 'dispatch_rate_method_id' },
  { title: 'RATE TYPE', key: 'dispatch_rate_type_id' },
  { title: 'BIDIRECTIONAL', key: 'is_bidirectional' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedRateMatrix = ref<DispatchRateMatrixInfo>({});
const updatingRateMatrix = ref(false);
const rateMatrixDialog = ref(false);

const editRateMatrix = (matrix: DispatchRateMatrixInfo) => {
  editedRateMatrix.value = { ...matrix };
  updatingRateMatrix.value = true;
  rateMatrixDialog.value = true;
};

const deleteRateMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this Rate Matrix?');
  if (confirm) {
    dispatchRateMatrixStore.deleteDispatchRateMatrix(matrixId);
  }
};

const viewRateMatrixEntries = (matrix: DispatchRateMatrixInfo) => {
 
  router.push({ path: `/setup/dispatch/RateMatrixEntriesPage`, query: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="rateMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Rate Matrix
      </v-btn>
      <RateMatrixDialog
        :show="rateMatrixDialog"
        @update:show="rateMatrixDialog = $event"
        :updating="updatingRateMatrix"
        :item="editedRateMatrix"
        :rateMethods="dispatchRateMethodStore.dispatchRateMethodList"
        :rateTypes="dispatchRateTypeStore.dispatchRateTypeList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="rateMatrixHeaders"
        :items="dispatchRateMatrixList"
      >
        <template v-slot:item.dispatch_rate_method_id="{ item }">
          {{ dispatchRateMethodStore.dispatchRateMethodList.find(
            method => method.id === item.dispatch_rate_method_id
          )?.name }}
        </template>
        <template v-slot:item.dispatch_rate_type_id="{ item }">
          {{ dispatchRateTypeStore.dispatchRateTypeList.find(
            type => type.id === item.dispatch_rate_type_id
          )?.name }}
        </template>
        <template v-slot:item.is_bidirectional="{ item }">
          {{ item.is_bidirectional ? 'Yes' : 'No' }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status ? 'Active' : 'Inactive' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editRateMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewRateMatrixEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteRateMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
