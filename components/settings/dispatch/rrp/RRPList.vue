<!-- src/components/dispatch/RRPList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRRPStore } from '@/stores/settings/dispatch/rrpStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import RRPDialog from '@/components/settings/dispatch/rrp/RRPDialog.vue';
import type { DispatchRRPInfo } from '@/types/dispatch/dispatchRRP';

const rrpStore = useRRPStore();
const { rrpList } = storeToRefs(rrpStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  rrpStore.fetchRRPList();
});

const rrpHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'CODE', key: 'code' },
  { title: 'NAME', key: 'name' },
  { title: 'TYPE', key: 'type' },
  { title: 'STATUS', key: 'status' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedRRP = ref<DispatchRRPInfo>({});
const updatingRRP = ref(false);
const rrpDialog = ref(false);

const editRRP = (rrp: DispatchRRPInfo) => {
  editedRRP.value = { ...rrp };
  updatingRRP.value = true;
  rrpDialog.value = true;
};

const deleteRRP = async (rrpId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this RRP?');
  if (confirm) {
    rrpStore.deleteRRP(rrpId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="rrpDialog = true">
        <v-icon>mdi-plus</v-icon> Add RRP
      </v-btn>
      <RRPDialog
        :show="rrpDialog"
        @update:show="rrpDialog = $event"
        :updating="updatingRRP"
        :item="editedRRP"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="rrpHeaders"
        :items="rrpList"
      >
        <template v-slot:item.status="{ item }">
          {{ item.status ? 'Active' : 'Inactive' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editRRP(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteRRP(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
