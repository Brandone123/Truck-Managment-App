<!-- src/components/dispatch/StorageChargeEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStorageChargeEntryStore } from '@/stores/settings/dispatch/storageChargeEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { StorageChargeEntryInfo } from '@/types/dispatch/storageChargeEntry';
import type { EquipmentTypeInfo } from '@/types/dispatch/equipmentType';

const emit = defineEmits(['update:show']);

const storageChargeEntryStore = useStorageChargeEntryStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<StorageChargeEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
  equipmentTypeList: Array as PropType<EquipmentTypeInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const storageChargeEntryForm = ref(null);
const storageChargeEntry = ref<StorageChargeEntryInfo>({});

const title = computed(() => (props.updating ? 'Update Storage Charge Entry' : 'Add Storage Charge Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (storageChargeEntryForm.value) {
    const isValid = await storageChargeEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await storageChargeEntryStore.updateStorageChargeEntry(props.matrixId, storageChargeEntry.value);
    } else {
      await storageChargeEntryStore.createStorageChargeEntry(props.matrixId, storageChargeEntry.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  storageChargeEntryForm.value?.reset();
  storageChargeEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      storageChargeEntry.value = { ...props.item };
    } else {
      resetForm();
    }
  }
);
</script>

<template>
  <v-dialog v-model="dialog" width="800">
    <v-card>
      <v-toolbar color="primary">
        <span class="white--text">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="storageChargeEntryForm">
          <v-select
            label="Equipment Type"
            v-model="storageChargeEntry.dispatch_equipment_type_id"
            :items="props.equipmentTypeList"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            label="Free Days"
            v-model="storageChargeEntry.free_days"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="First Rate"
            v-model="storageChargeEntry.first_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="First Rate Days"
            v-model="storageChargeEntry.first_rate_days"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Second Rate"
            v-model="storageChargeEntry.second_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Second Rate Days"
            v-model="storageChargeEntry.second_rate_days"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Final Rate"
            v-model="storageChargeEntry.final_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="storageChargeEntry.description"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
