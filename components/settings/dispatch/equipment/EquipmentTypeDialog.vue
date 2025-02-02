<!-- src/components/dispatch/EquipmentTypeDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEquipmentTypeStore } from '@/stores/settings/dispatch/equipmentTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { EquipmentTypeInfo } from '@/types/dispatch/equipmentType';

const emit = defineEmits(['update:show']);

const equipmentTypeStore = useEquipmentTypeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<EquipmentTypeInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const equipmentTypeForm = ref(null);
const equipmentType = ref<EquipmentTypeInfo>({});

const title = computed(() => (props.updating ? 'Update Equipment Type' : 'Add Equipment Type'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => {
    if (value === null || value === undefined || value === '') return true;
    return !isNaN(Number(value)) || 'Must be a number';
  },
};

const save = async () => {
  if (equipmentTypeForm.value) {
    const isValid = await equipmentTypeForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await equipmentTypeStore.updateEquipmentType(equipmentType.value);
    } else {
      await equipmentTypeStore.createEquipmentType(equipmentType.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  equipmentTypeForm.value?.reset();
  equipmentType.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      equipmentType.value = { ...props.item };
    } else {
      resetForm();
    }
  }
);
</script>

<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-toolbar color="primary">
        <span class="white--text">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="equipmentTypeForm">
          <v-text-field
            label="Type"
            v-model="equipmentType.type"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Height"
            v-model="equipmentType.height"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Length"
            v-model="equipmentType.length"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="equipmentType.description"
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
