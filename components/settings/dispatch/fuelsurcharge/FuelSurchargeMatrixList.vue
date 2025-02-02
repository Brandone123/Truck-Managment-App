<!-- src/components/dispatch/FuelSurchargeMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFuelSurchargeMatrixStore } from '@/stores/settings/dispatch/fuelSurchargeMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import FuelSurchargeMatrixDialog from '@/components/settings/dispatch/fuelsurcharge/FuelSurchargeMatrixDialog.vue';
import type { FuelSurchargeMatrixInfo } from '@/types/dispatch/fuelSurchargeMatrix';
import { useRouter } from 'vue-router';

const fuelSurchargeMatrixStore = useFuelSurchargeMatrixStore();
const { fuelSurchargeMatrixList } = storeToRefs(fuelSurchargeMatrixStore);
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  fuelSurchargeMatrixStore.fetchFuelSurchargeMatrixList();
});

const fuelSurchargeMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'RATE METHOD', key: 'rate_method' },
  { title: 'RATE TYPE', key: 'rate_type' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedFuelSurchargeMatrix = ref<FuelSurchargeMatrixInfo>({});
const updatingFuelSurchargeMatrix = ref(false);
const fuelSurchargeMatrixDialog = ref(false);

const editFuelSurchargeMatrix = (matrix: FuelSurchargeMatrixInfo) => {
  editedFuelSurchargeMatrix.value = { ...matrix };
  updatingFuelSurchargeMatrix.value = true;
  fuelSurchargeMatrixDialog.value = true;
};

const deleteFuelSurchargeMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog(
    'Are you sure you want to delete this Fuel Surcharge Matrix?'
  );
  if (confirm) {
    fuelSurchargeMatrixStore.deleteFuelSurchargeMatrix(matrixId);
  }
};

const viewFuelSurchargeRates = (matrix: FuelSurchargeMatrixInfo) => {
 
  router.push({ path: `/setup/dispatch/FuelSurchargeRatesPage`, query: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="fuelSurchargeMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Fuel Surcharge Matrix
      </v-btn>
      <FuelSurchargeMatrixDialog
        :show="fuelSurchargeMatrixDialog"
        @update:show="fuelSurchargeMatrixDialog = $event"
        :updating="updatingFuelSurchargeMatrix"
        :item="editedFuelSurchargeMatrix"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="fuelSurchargeMatrixHeaders"
        :items="fuelSurchargeMatrixList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editFuelSurchargeMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewFuelSurchargeRates(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteFuelSurchargeMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
