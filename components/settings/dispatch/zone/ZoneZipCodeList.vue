<!-- src/components/dispatch/ZoneZipCodeList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useZoneZipCodeStore } from '@/stores/settings/dispatch/zoneZipCodeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import ZoneZipCodeDialog from '@/components/settings/dispatch/zone/ZoneZipCodeDialog.vue';
import type { DispatchZoneZipCodeInfo } from '@/types/dispatch/dispatchZoneZipCode';

const props = defineProps({
  zoneId: {
    type: Number,
    required: true,
  },
});

const zoneZipCodeStore = useZoneZipCodeStore();
const { zoneZipCodeList } = storeToRefs(zoneZipCodeStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  zoneZipCodeStore.fetchZoneZipCodeList(props.zoneId);
});

const zoneZipCodeHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'ZIP CODE', key: 'zip_code' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const newZipCode = ref<DispatchZoneZipCodeInfo>({});
const zipCodeDialog = ref(false);

const deleteZoneZipCode = async (zipCodeId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this zip code?');
  if (confirm) {
    zoneZipCodeStore.deleteZoneZipCode(props.zoneId, zipCodeId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="zipCodeDialog = true">
        <v-icon>mdi-plus</v-icon> Add Zip Code
      </v-btn>
      <ZoneZipCodeDialog
        :show="zipCodeDialog"
        @update:show="zipCodeDialog = $event"
        :zoneId="props.zoneId"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="zoneZipCodeHeaders"
        :items="zoneZipCodeList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="red" @click="deleteZoneZipCode(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
