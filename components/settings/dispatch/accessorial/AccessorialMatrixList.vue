<!-- src/components/dispatch/AccessorialMatrixList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccessorialMatrixStore } from '@/stores/settings/dispatch/accessorialMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import AccessorialMatrixDialog from '@/components/settings/dispatch/accessorial/AccessorialMatrixDialog.vue';
import type { AccessorialMatrixInfo } from '@/types/dispatch/accessorialMatrix';
import { useRouter } from 'vue-router';

const accessorialMatrixStore = useAccessorialMatrixStore();
const { accessorialMatrixList } = storeToRefs(accessorialMatrixStore);
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  accessorialMatrixStore.fetchAccessorialMatrixList();
});

const accessorialMatrixHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedAccessorialMatrix = ref<AccessorialMatrixInfo>({});
const updatingAccessorialMatrix = ref(false);
const accessorialMatrixDialog = ref(false);

const editAccessorialMatrix = (matrix: AccessorialMatrixInfo) => {
  editedAccessorialMatrix.value = { ...matrix };
  updatingAccessorialMatrix.value = true;
  accessorialMatrixDialog.value = true;
};

const deleteAccessorialMatrix = async (matrixId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog("Are you sure you want to delete this Accessorial Matrix?");
  if (confirm) {
    accessorialMatrixStore.deleteAccessorialMatrix(matrixId);
  }
};

const viewAccessorialMatrixEntries = (matrix: AccessorialMatrixInfo) => {
 
  router.push({ path: `/setup/dispatch/AccessorialMatrixEntriesPage`, query: { id: matrix.id } });

};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="accessorialMatrixDialog = true">
        <v-icon>mdi-plus</v-icon> Add Accessorial Matrix
      </v-btn>
      <AccessorialMatrixDialog
        :show="accessorialMatrixDialog"
        @update:show="accessorialMatrixDialog = $event"
        :updating="updatingAccessorialMatrix"
        :item="editedAccessorialMatrix"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="accessorialMatrixHeaders"
        :items="accessorialMatrixList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editAccessorialMatrix(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewAccessorialMatrixEntries(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteAccessorialMatrix(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
