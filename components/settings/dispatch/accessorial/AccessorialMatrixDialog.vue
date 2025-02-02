<!-- src/components/dispatch/AccessorialMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAccessorialMatrixStore } from '@/stores/settings/dispatch/accessorialMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { AccessorialMatrixInfo } from '@/types/dispatch/accessorialMatrix';

const emit = defineEmits(['update:show']);

const accessorialMatrixStore = useAccessorialMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<AccessorialMatrixInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const accessorialMatrixForm = ref(null);
const accessorialMatrix = ref<AccessorialMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Accessorial Matrix' : 'Add Accessorial Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (accessorialMatrixForm.value) {
    const isValid = await accessorialMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await accessorialMatrixStore.updateAccessorialMatrix(accessorialMatrix.value);
    } else {
      await accessorialMatrixStore.createAccessorialMatrix(accessorialMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  accessorialMatrixForm.value?.reset();
  accessorialMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      accessorialMatrix.value = { ...props.item };
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
        <v-form ref="accessorialMatrixForm">
          <v-text-field
            label="Name"
            v-model="accessorialMatrix.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Description"
            v-model="accessorialMatrix.description"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Status"
            v-model="accessorialMatrix.status"
            :items="['Active', 'Inactive']"
            :rules="[rules.required]"
          ></v-select>
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
