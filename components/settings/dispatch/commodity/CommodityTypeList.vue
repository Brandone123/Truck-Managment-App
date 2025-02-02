<!-- src/components/dispatch/CommodityTypeList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommodityTypeStore } from '@/stores/settings/dispatch/commodityTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import CommodityTypeDialog from '@/components/settings/dispatch/commodity/CommodityTypeDialog.vue';
import type { CommodityTypeInfo } from '@/types/dispatch/commodityType';

const commodityTypeStore = useCommodityTypeStore();
const { commodityTypeList } = storeToRefs(commodityTypeStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  commodityTypeStore.fetchCommodityTypeList();
});

const commodityTypeHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'TYPE', key: 'type' },
  { title: 'HAZ MAT CODE', key: 'haz_mat_code' },
  { title: 'CLASS', key: 'class' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedCommodityType = ref<CommodityTypeInfo>({});
const updatingCommodityType = ref(false);
const commodityTypeDialog = ref(false);

const editCommodityType = (commodityType: CommodityTypeInfo) => {
  editedCommodityType.value = { ...commodityType };
  updatingCommodityType.value = true;
  commodityTypeDialog.value = true;
};

const deleteCommodityType = async (commodityTypeId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this commodity type?');
  if (confirm) {
    commodityTypeStore.deleteCommodityType(commodityTypeId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="commodityTypeDialog = true">
        <v-icon>mdi-plus</v-icon> Add Commodity Type
      </v-btn>
      <CommodityTypeDialog
        :show="commodityTypeDialog"
        @update:show="commodityTypeDialog = $event"
        :updating="updatingCommodityType"
        :item="editedCommodityType"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="commodityTypeHeaders"
        :items="commodityTypeList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editCommodityType(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteCommodityType(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
