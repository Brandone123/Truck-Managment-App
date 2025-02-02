<!-- src/components/dispatch/PerDiemMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePerDiemMatrixStore } from '@/stores/settings/dispatch/perDiemMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import PerDiemMatrixDialog from '@/components/settings/dispatch/perDiem/PerDiemMatrixDialog.vue';
import type { PerDiemMatrixInfo } from '@/types/dispatch/perDiemMatrix';
import { useRouter } from 'vue-router';

const perDiemMatrixStore = usePerDiemMatrixStore();
const { perDiemMatrixList } = storeToRefs(perDiemMatrixStore);
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  perDiemMatrixStore.fetchPerDiemMatrixList();
});

const perDiemMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'EQUIPMENT OWNER', key: 'dispatch_rrp_id' },
  { title: 'STATUS', key: 'status' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedPerDiemMatrix = ref<PerDiemMatrixInfo>({});
const updatingPerDiemMatrix = ref(false);
const perDiemMatrixDialog = ref(false);

const editPerDiemMatrix = (matrix: PerDiemMatrixInfo) => {
  editedPerDiemMatrix.value = { ...matrix };
  updatingPerDiemMatrix.value = true;
  perDiemMatrixDialog.value = true;
};

const deletePerDiemMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog(
    'Are you sure you want to delete this Per Diem Matrix?'
  );
  if (confirm) {
    perDiemMatrixStore.deletePerDiemMatrix(matrixId);
  }
};

const viewPerDiemEntries = (matrix: PerDiemMatrixInfo) => {
  router.push({ name: 'PerDiemEntries', params: { id: matrix.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="perDiemMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Per Diem Matrix
      </v-btn>
      <PerDiemMatrixDialog
        :show="perDiemMatrixDialog"
        @update:show="perDiemMatrixDialog = $event"
        :updating="updatingPerDiemMatrix"
        :item="editedPerDiemMatrix"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="perDiemMatrixHeaders"
        :items="perDiemMatrixList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editPerDiemMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewPerDiemEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deletePerDiemMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
