<!-- src/components/dispatch/ZoneMileageList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useZoneMileageStore } from '@/stores/settings/dispatch/zoneMileageStore';
import { useZoneStore } from '@/stores/settings/dispatch/zoneStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import ZoneMileageDialog from '@/components/settings/dispatch/zone/ZoneMileageDialog.vue';
import type { DispatchZoneMileageInfo } from '@/types/dispatch/dispatchZoneMileage';

const zoneMileageStore = useZoneMileageStore();
const { zoneMileageList } = storeToRefs(zoneMileageStore);
const zoneStore = useZoneStore();
const layoutStore = useLayoutStore();

onMounted(() => {
  zoneMileageStore.fetchZoneMileageList();
  zoneStore.fetchZoneList();
});

const zoneMileageHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'ORIGIN ZONE', key: 'origin_zone_id' },
  { title: 'DESTINATION ZONE', key: 'destination_zone_id' },
  { title: 'MILEAGE FROM', key: 'mileage_from' },
  { title: 'MILEAGE TO', key: 'mileage_to' },
  { title: 'RATE PER MILE', key: 'rate_per_mile' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedZoneMileage = ref<DispatchZoneMileageInfo>({});
const updatingZoneMileage = ref(false);
const zoneMileageDialog = ref(false);

const editZoneMileage = (mileage: DispatchZoneMileageInfo) => {
  editedZoneMileage.value = { ...mileage };
  updatingZoneMileage.value = true;
  zoneMileageDialog.value = true;
};

const deleteZoneMileage = async (mileageId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this zone mileage?');
  if (confirm) {
    zoneMileageStore.deleteZoneMileage(mileageId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="zoneMileageDialog = true">
        <v-icon>mdi-plus</v-icon> Add Zone Mileage
      </v-btn>
      <ZoneMileageDialog
        :show="zoneMileageDialog"
        @update:show="zoneMileageDialog = $event"
        :updating="updatingZoneMileage"
        :item="editedZoneMileage"
        :zoneList="zoneStore.zoneList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="zoneMileageHeaders"
        :items="zoneMileageList"
      >
        <template v-slot:item.origin_zone_id="{ item }">
          {{
            zoneStore.zoneList.find(zone => zone.id === item.origin_zone_id)?.name
          }}
        </template>
        <template v-slot:item.destination_zone_id="{ item }">
          {{
            zoneStore.zoneList.find(zone => zone.id === item.destination_zone_id)?.name
          }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editZoneMileage(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteZoneMileage(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
