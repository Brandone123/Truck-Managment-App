<!-- src/components/dispatch/RateTypeList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchRateTypeStore } from '@/stores/settings/dispatch/dispatchRateTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import RateTypeDialog from '@/components/settings/dispatch/rate/RateTypeDialog.vue';
import type { DispatchRateTypeInfo } from '@/types/dispatch/dispatchRateType';

const dispatchRateTypeStore = useDispatchRateTypeStore();
const { dispatchRateTypeList } = storeToRefs(dispatchRateTypeStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  dispatchRateTypeStore.fetchDispatchRateTypeList();
});

const rateTypeHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedRateType = ref<DispatchRateTypeInfo>({});
const updatingRateType = ref(false);
const rateTypeDialog = ref(false);

const editRateType = (rateType: DispatchRateTypeInfo) => {
  editedRateType.value = { ...rateType };
  updatingRateType.value = true;
  rateTypeDialog.value = true;
};

const deleteRateType = async (rateTypeId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this Rate Type?');
  if (confirm) {
    dispatchRateTypeStore.deleteDispatchRateType(rateTypeId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="rateTypeDialog = true">
        <v-icon>mdi-plus</v-icon> Add Rate Type
      </v-btn>
      <RateTypeDialog
        :show="rateTypeDialog"
        @update:show="rateTypeDialog = $event"
        :updating="updatingRateType"
        :item="editedRateType"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="rateTypeHeaders"
        :items="dispatchRateTypeList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editRateType(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteRateType(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
