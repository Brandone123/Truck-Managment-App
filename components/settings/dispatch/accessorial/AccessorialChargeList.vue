<!-- src/components/dispatch/AccessorialChargeList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccessorialChargeStore } from '@/stores/settings/dispatch/accessorialChargeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import AccessorialChargeDialog from '@/components/settings/dispatch/accessorial/AccessorialChargeDialog.vue';
import type { AccessorialChargeInfo } from '@/types/dispatch/accessorialCharge';

const accessorialChargeStore = useAccessorialChargeStore();
const { accessorialChargeList } = storeToRefs(accessorialChargeStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  accessorialChargeStore.fetchAccessorialChargeList();
});

const accessorialChargeHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'CODE', key: 'code' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'CALCULATION METHOD', key: 'calculation_method' },
  { title: 'RATE', key: 'rate' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedAccessorialCharge = ref<AccessorialChargeInfo>({});
const updatingAccessorialCharge = ref(false);
const accessorialChargeDialog = ref(false);

const editAccessorialCharge = (accessorialCharge: AccessorialChargeInfo) => {
  editedAccessorialCharge.value = { ...accessorialCharge };
  updatingAccessorialCharge.value = true;
  accessorialChargeDialog.value = true;
};

const deleteAccessorialCharge = async (accessorialChargeId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog("Are you sure you want to delete this Accessorial Charge?");
  if (confirm) {
    accessorialChargeStore.deleteAccessorialCharge(accessorialChargeId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="accessorialChargeDialog = true">
        <v-icon>mdi-plus</v-icon> Add Accessorial Charge
      </v-btn>
      <AccessorialChargeDialog
        :show="accessorialChargeDialog"
        @update:show="accessorialChargeDialog = $event"
        :updating="updatingAccessorialCharge"
        :item="editedAccessorialCharge"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="accessorialChargeHeaders"
        :items="accessorialChargeList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editAccessorialCharge(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteAccessorialCharge(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
