<!-- src/components/dispatch/FuelSurchargeRateList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFuelSurchargeRateStore } from '@/stores/settings/dispatch/fuelSurchargeRateStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import FuelSurchargeRateDialog from '@/components/settings/dispatch/fuelsurcharge/FuelSurchargeRateDialog.vue';
import type { FuelSurchargeRateInfo } from '@/types/dispatch/fuelSurchargeRate';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const fuelSurchargeRateStore = useFuelSurchargeRateStore();
const { fuelSurchargeRateList } = storeToRefs(fuelSurchargeRateStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  fuelSurchargeRateStore.fetchFuelSurchargeRateList(props.matrixId);
});

const fuelSurchargeRateHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'FUEL PRICE FROM', key: 'fuel_price_from' },
  { title: 'FUEL PRICE TO', key: 'fuel_price_to' },
  { title: 'SURCHARGE RATE', key: 'surcharge_rate' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedFuelSurchargeRate = ref<FuelSurchargeRateInfo>({});
const updatingFuelSurchargeRate = ref(false);
const fuelSurchargeRateDialog = ref(false);

const editFuelSurchargeRate = (rate: FuelSurchargeRateInfo) => {
  editedFuelSurchargeRate.value = { ...rate };
  updatingFuelSurchargeRate.value = true;
  fuelSurchargeRateDialog.value = true;
};

const deleteFuelSurchargeRate = async (rateId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this rate?');
  if (confirm) {
    fuelSurchargeRateStore.deleteFuelSurchargeRate(props.matrixId, rateId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="fuelSurchargeRateDialog = true">
        <v-icon>mdi-plus</v-icon> Add Rate
      </v-btn>
      <FuelSurchargeRateDialog
        :show="fuelSurchargeRateDialog"
        @update:show="fuelSurchargeRateDialog = $event"
        :updating="updatingFuelSurchargeRate"
        :item="editedFuelSurchargeRate"
        :matrixId="props.matrixId"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="fuelSurchargeRateHeaders"
        :items="fuelSurchargeRateList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editFuelSurchargeRate(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteFuelSurchargeRate(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
