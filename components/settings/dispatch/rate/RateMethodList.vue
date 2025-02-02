<!-- src/components/dispatch/RateMethodList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDispatchRateMethodStore } from '@/stores/settings/dispatch/dispatchRateMethodStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import RateMethodDialog from '@/components/settings/dispatch/rate/RateMethodDialog.vue';
import type { DispatchRateMethodInfo } from '@/types/dispatch/dispatchRateMethod';

const dispatchRateMethodStore = useDispatchRateMethodStore();
const { dispatchRateMethodList } = storeToRefs(dispatchRateMethodStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  dispatchRateMethodStore.fetchDispatchRateMethodList();
});

const rateMethodHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedRateMethod = ref<DispatchRateMethodInfo>({});
const updatingRateMethod = ref(false);
const rateMethodDialog = ref(false);

const editRateMethod = (rateMethod: DispatchRateMethodInfo) => {
  editedRateMethod.value = { ...rateMethod };
  updatingRateMethod.value = true;
  rateMethodDialog.value = true;
};

const deleteRateMethod = async (rateMethodId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this Rate Method?');
  if (confirm) {
    dispatchRateMethodStore.deleteDispatchRateMethod(rateMethodId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="rateMethodDialog = true">
        <v-icon>mdi-plus</v-icon> Add Rate Method
      </v-btn>
      <RateMethodDialog
        :show="rateMethodDialog"
        @update:show="rateMethodDialog = $event"
        :updating="updatingRateMethod"
        :item="editedRateMethod"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="rateMethodHeaders"
        :items="dispatchRateMethodList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editRateMethod(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteRateMethod(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
