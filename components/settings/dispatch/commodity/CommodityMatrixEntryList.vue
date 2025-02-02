<!-- src/components/dispatch/CommodityMatrixEntryList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommodityMatrixEntryStore } from '@/stores/settings/dispatch/commodityMatrixEntryStore';
import { useCommodityTypeStore } from '@/stores/settings/dispatch/commodityTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import CommodityMatrixEntryDialog from '@/components/settings/dispatch/commodity/CommodityMatrixEntryDialog.vue';
import type { CommodityMatrixEntryInfo } from '@/types/dispatch/commodityMatrixEntry';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const commodityMatrixEntryStore = useCommodityMatrixEntryStore();
const { commodityMatrixEntryList } = storeToRefs(commodityMatrixEntryStore);
const commodityTypeStore = useCommodityTypeStore();
const layoutStore = useLayoutStore();

onMounted(() => {
  commodityMatrixEntryStore.fetchCommodityMatrixEntryList(props.matrixId);
  commodityTypeStore.fetchCommodityTypeList();
});

const commodityMatrixEntryHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'COMMODITY', key: 'dispatch_commodity_id' },
  { title: 'ORIGIN ZIP START', key: 'origin_zip_start' },
  { title: 'ORIGIN ZIP END', key: 'origin_zip_end' },
  { title: 'DEST ZIP START', key: 'destination_zip_start' },
  { title: 'DEST ZIP END', key: 'destination_zip_end' },
  { title: 'LOW WEIGHT', key: 'low_weight' },
  { title: 'HIGH WEIGHT', key: 'high_weight' },
  { title: 'RATE PER CWT', key: 'rate_per_cwt' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedCommodityMatrixEntry = ref<CommodityMatrixEntryInfo>({});
const updatingCommodityMatrixEntry = ref(false);
const commodityMatrixEntryDialog = ref(false);

const editCommodityMatrixEntry = (entry: CommodityMatrixEntryInfo) => {
  editedCommodityMatrixEntry.value = { ...entry };
  updatingCommodityMatrixEntry.value = true;
  commodityMatrixEntryDialog.value = true;
};

const deleteCommodityMatrixEntry = async (entryId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this entry?');
  if (confirm) {
    commodityMatrixEntryStore.deleteCommodityMatrixEntry(props.matrixId, entryId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="commodityMatrixEntryDialog = true">
        <v-icon>mdi-plus</v-icon> Add Entry
      </v-btn>
      <CommodityMatrixEntryDialog
        :show="commodityMatrixEntryDialog"
        @update:show="commodityMatrixEntryDialog = $event"
        :updating="updatingCommodityMatrixEntry"
        :item="editedCommodityMatrixEntry"
        :matrixId="props.matrixId"
        :commodityTypeList="commodityTypeStore.commodityTypeList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="commodityMatrixEntryHeaders"
        :items="commodityMatrixEntryList"
      >
        <template v-slot:item.dispatch_commodity_id="{ item }">
          {{
            commodityTypeStore.commodityTypeList.find(
              commodity => commodity.id === item.dispatch_commodity_id
            )?.type
          }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editCommodityMatrixEntry(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteCommodityMatrixEntry(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
