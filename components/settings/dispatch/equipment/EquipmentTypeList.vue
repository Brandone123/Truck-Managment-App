<!-- src/components/dispatch/EquipmentTypeList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEquipmentTypeStore } from '@/stores/settings/dispatch/equipmentTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import EquipmentTypeDialog from '@/components/settings/dispatch/equipment/EquipmentTypeDialog.vue';
import type { EquipmentTypeInfo } from '@/types/dispatch/equipmentType';

const equipmentTypeStore = useEquipmentTypeStore();
const { equipmentTypeList } = storeToRefs(equipmentTypeStore);
const layoutStore = useLayoutStore();

onMounted(() => {
  equipmentTypeStore.fetchEquipmentTypeList();
});

const equipmentTypeHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'TYPE', key: 'type' },
  { title: 'HEIGHT', key: 'height' },
  { title: 'LENGTH', key: 'length' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]);

const editedEquipmentType = ref<EquipmentTypeInfo>({});
const updatingEquipmentType = ref(false);
const equipmentTypeDialog = ref(false);

const editEquipmentType = (equipmentType: EquipmentTypeInfo) => {
  editedEquipmentType.value = { ...equipmentType };
  updatingEquipmentType.value = true;
  equipmentTypeDialog.value = true;
};

const deleteEquipmentType = async (equipmentTypeId: number) => {
  const { confirm } = await layoutStore.showConfirmDialog('Are you sure you want to delete this equipment type?');
  if (confirm) {
    equipmentTypeStore.deleteEquipmentType(equipmentTypeId);
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="equipmentTypeDialog = true">
        <v-icon>mdi-plus</v-icon> Add Equipment Type
      </v-btn>
      <EquipmentTypeDialog
        :show="equipmentTypeDialog"
        @update:show="equipmentTypeDialog = $event"
        :updating="updatingEquipmentType"
        :item="editedEquipmentType"
      />
    </div>
    <div>
      <SharedUiCustomTable
        :headers="equipmentTypeHeaders"
        :items="equipmentTypeList"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="editEquipmentType(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteEquipmentType(item.id!)">mdi-delete</v-icon>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>
