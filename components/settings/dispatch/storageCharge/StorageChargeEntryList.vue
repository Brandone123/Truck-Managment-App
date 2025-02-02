<!-- src/components/dispatch/StorageChargeEntryList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStorageChargeEntryStore } from '@/stores/settings/dispatch/storageChargeEntryStore';
// import { useEquipmentTypesStore } from '@/stores/settings/dispatch/equipmentTypesStore'; // Store for equipment types
import { useLayoutStore } from '@/stores/useLayoutStore';
import StorageChargeEntryDialog from '@/components/settings/dispatch/storageCharge/StorageChargeEntryDialog.vue';
import type { StorageChargeEntryInfo } from '@/types/dispatch/storageChargeEntry';

const props = defineProps({
  matrixId: {
    type: Number,
    required: true,
  },
});

const storageChargeEntryStore = useStorageChargeEntryStore();
const { storageChargeEntryList } = storeToRefs(storageChargeEntryStore);
const equipmentTypesStore = useEquipmentTypesStore();
const layoutStore = useLayoutStore();

onMounted(() => {
  storageChargeEntryStore.fetchStorageChargeEntryList(props.matrixId);
  equipmentTypesStore.fetchEquipmentTypes(); // Fetch equipment types
});

const storageChargeEntryHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'EQUIPMENT TYPE', key: 'dispatch_equipment_type_id' },
  { title: 'FREE DAYS', key: 'free_days' },
  { title: 'FIRST RATE', key: 'first_rate' },
  { title: 'FIRST RATE DAYS', key: 'first_rate_days' },
  { title: 'SECOND RATE', key: 'second_rate' },
  { title: 'SECOND RATE DAYS', key: 'second_rate_days' },
  { title: 'FINAL RATE', key: 'final_rate' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedStorageChargeEntry = ref<StorageChargeEntryInfo>({});
const updatingStorageChargeEntry = ref(false);
const storageChargeEntryDialog = ref(false);

const editStorageChargeEntry = (entry: StorageChargeEntryInfo) => {
  editedStorageChargeEntry.value = { ...entry };
  updatingStorageChargeEntry.value = true;
  storageChargeEntryDialog.value = true;
};

const deleteStorageChargeEntry = async (entryId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this entry?');
  if (confirm) {
    storageChargeEntryStore.deleteStorageChargeEntry(props.matrixId, entryId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="storageChargeEntryDialog = true">
        <v-icon>mdi-plus</v-icon> Add Entry
      </v-btn>
      <StorageChargeEntryDialog
        :show="storageChargeEntryDialog"
        @update:show="storageChargeEntryDialog = $event"
        :updating="updatingStorageChargeEntry"
        :item="editedStorageChargeEntry"
        :matrixId="props.matrixId"
        :equipmentTypeList="equipmentTypesStore.equipmentTypeList"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="storageChargeEntryHeaders"
        :items="storageChargeEntryList"
      >
        <template v-slot:item.dispatch_equipment_type_id="{ item }">
          {{
            equipmentTypesStore.equipmentTypeList.find(
              type => type.id === item.dispatch_equipment_type_id
            )?.name
          }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editStorageChargeEntry(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteStorageChargeEntry(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
