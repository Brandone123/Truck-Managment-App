<!-- src/components/dispatch/ZoneList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useZoneStore } from '@/stores/settings/dispatch/zoneStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import ZoneDialog from '@/components/settings/dispatch/zone/ZoneDialog.vue';
import type { DispatchZoneInfo } from '@/types/dispatch/dispatchZone';
import { useRouter } from 'vue-router';

const zoneStore = useZoneStore();
const { zoneList } = storeToRefs(zoneStore);
const layoutStore = useLayoutStore();
const router = useRouter();

onMounted(() => {
  zoneStore.fetchZoneList();
});

const zoneHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'CODE', key: 'code' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedZone = ref<DispatchZoneInfo>({});
const updatingZone = ref(false);
const zoneDialog = ref(false);

const editZone = (zone: DispatchZoneInfo) => {
  editedZone.value = { ...zone };
  updatingZone.value = true;
  zoneDialog.value = true;
};

const deleteZone = async (zoneId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this zone?');
  if (confirm) {
    zoneStore.deleteZone(zoneId);
  }
};

const viewZoneZipCodes = (zone: DispatchZoneInfo) => {
  router.push({ name: 'ZoneZipCodes', params: { id: zone.id } });
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="zoneDialog = true">
        <v-icon>mdi-plus</v-icon> Add Zone
      </v-btn>
      <ZoneDialog
        :show="zoneDialog"
        @update:show="zoneDialog = $event"
        :updating="updatingZone"
        :item="editedZone"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="zoneHeaders"
        :items="zoneList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editZone(item)">mdi-pencil</v-icon>
          <v-icon color="green" @click="viewZoneZipCodes(item)">mdi-eye</v-icon>
          <v-icon color="red" @click="deleteZone(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
