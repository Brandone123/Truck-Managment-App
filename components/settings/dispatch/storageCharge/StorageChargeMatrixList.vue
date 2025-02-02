<!-- src/components/dispatch/StorageChargeMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStorageChargeMatrixStore } from '@/stores/settings/dispatch/storageChargeMatrixStore';
import { useRRPStore } from '@/stores/settings/dispatch/rrpStore'; // Store for RRPs
import { useLayoutStore } from '@/stores/useLayoutStore';
import StorageChargeMatrixDialog from '@/components/settings/dispatch/storageCharge/StorageChargeMatrixDialog.vue';
import type { StorageChargeMatrixInfo } from '@/types/dispatch/storageChargeMatrix';
import { useRouter } from 'vue-router';

const storageChargeMatrixStore = useStorageChargeMatrixStore();
const { storageChargeMatrixList } = storeToRefs(storageChargeMatrixStore);
const rrpStore = useRRPStore();
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  storageChargeMatrixStore.fetchStorageChargeMatrixList();
  rrpStore.fetchRRPList(); // Fetch RRPs for selection
});

const storageChargeMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'RRP', key: 'dispatch_rrp_id' },
  { title: 'STATUS', key: 'status' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedStorageChargeMatrix = ref<StorageChargeMatrixInfo>({});
const updatingStorageChargeMatrix = ref(false);
const storageChargeMatrixDialog = ref(false);

const editStorageChargeMatrix = (matrix: StorageChargeMatrixInfo) => {
  editedStorageChargeMatrix.value = { ...matrix };
  updatingStorageChargeMatrix.value = true;
  storageChargeMatrixDialog.value = true;
};

const deleteStorageChargeMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog(
    'Are you sure you want to delete this Storage Charge Matrix?'
  );
  if (confirm) {
    storageChargeMatrixStore.deleteStorageChargeMatrix(matrixId);
  }
};

const viewStorageChargeEntries = (matrix: StorageChargeMatrixInfo) => {
  router.push({ name: 'StorageChargeEntries', params: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="storageChargeMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Storage Charge Matrix
      </v-btn>
      <StorageChargeMatrixDialog
        :show="storageChargeMatrixDialog"
        @update:show="storageChargeMatrixDialog = $event"
        :updating="updatingStorageChargeMatrix"
        :item="editedStorageChargeMatrix"
        :rrpList="rrpStore.rrpList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="storageChargeMatrixHeaders"
        :items="storageChargeMatrixList"
      >
        <template v-slot:item.dispatch_rrp_id="{ item }">
          {{
            rrpStore.rrpList.find(rrp => rrp.id === item.dispatch_rrp_id)?.name
          }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status ? 'Active' : 'Inactive' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editStorageChargeMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewStorageChargeEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteStorageChargeMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
