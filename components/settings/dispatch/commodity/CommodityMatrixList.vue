<!-- src/components/dispatch/CommodityMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommodityMatrixStore } from '@/stores/settings/dispatch/commodityMatrixStore';
import { useDispatchRateMethodStore } from '@/stores/settings/dispatch/dispatchRateMethodStore';
import { useDispatchRateTypeStore } from '@/stores/settings/dispatch/dispatchRateTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import CommodityMatrixDialog from '@/components/settings/dispatch/commodity/CommodityMatrixDialog.vue';
import type { CommodityMatrixInfo } from '@/types/dispatch/commodityMatrix';
import { useRouter } from 'vue-router';

const commodityMatrixStore = useCommodityMatrixStore();
const { commodityMatrixList } = storeToRefs(commodityMatrixStore);
const dispatchRateMethodStore = useDispatchRateMethodStore();
const dispatchRateTypeStore = useDispatchRateTypeStore();
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  commodityMatrixStore.fetchCommodityMatrixList();
  dispatchRateMethodStore.fetchDispatchRateMethodList();
  dispatchRateTypeStore.fetchDispatchRateTypeList();
});

const commodityMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'RATE METHOD', key: 'dispatch_rate_method_id' },
  { title: 'RATE TYPE', key: 'dispatch_rate_type_id' },
  { title: 'STATUS', key: 'status' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedCommodityMatrix = ref<CommodityMatrixInfo>({});
const updatingCommodityMatrix = ref(false);
const commodityMatrixDialog = ref(false);

const editCommodityMatrix = (matrix: CommodityMatrixInfo) => {
  editedCommodityMatrix.value = { ...matrix };
  updatingCommodityMatrix.value = true;
  commodityMatrixDialog.value = true;
};

const deleteCommodityMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this commodity matrix?');
  if (confirm) {
    commodityMatrixStore.deleteCommodityMatrix(matrixId);
  }
};

const viewCommodityMatrixEntries = (matrix: CommodityMatrixInfo) => {
  router.push({ name: 'CommodityMatrixEntries', params: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="commodityMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Commodity Matrix
      </v-btn>
      <CommodityMatrixDialog
        :show="commodityMatrixDialog"
        @update:show="commodityMatrixDialog = $event"
        :updating="updatingCommodityMatrix"
        :item="editedCommodityMatrix"
        :rateMethods="dispatchRateMethodStore.dispatchRateMethodList"
        :rateTypes="dispatchRateTypeStore.dispatchRateTypeList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="commodityMatrixHeaders"
        :items="commodityMatrixList"
      >
        <template v-slot:item.dispatch_rate_method_id="{ item }">
          {{
            dispatchRateMethodStore.dispatchRateMethodList.find(
              method => method.id === item.dispatch_rate_method_id
            )?.name
          }}
        </template>
        <template v-slot:item.dispatch_rate_type_id="{ item }">
          {{
            dispatchRateTypeStore.dispatchRateTypeList.find(
              type => type.id === item.dispatch_rate_type_id
            )?.name
          }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status ? 'Active' : 'Inactive' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editCommodityMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewCommodityMatrixEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteCommodityMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
