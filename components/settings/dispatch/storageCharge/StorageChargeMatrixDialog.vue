<!-- src/components/dispatch/StorageChargeMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStorageChargeMatrixStore } from '@/stores/settings/dispatch/storageChargeMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { StorageChargeMatrixInfo } from '@/types/dispatch/storageChargeMatrix';
import type { DispatchRRPInfo } from '@/types/dispatch/dispatchRRP';

const emit = defineEmits(['update:show']);

const storageChargeMatrixStore = useStorageChargeMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<StorageChargeMatrixInfo>,
  updating: Boolean,
  show: Boolean,
  rrpList: Array as PropType<DispatchRRPInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const storageChargeMatrixForm = ref(null);
const storageChargeMatrix = ref<StorageChargeMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Storage Charge Matrix' : 'Add Storage Charge Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (storageChargeMatrixForm.value) {
    const isValid = await storageChargeMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await storageChargeMatrixStore.updateStorageChargeMatrix(storageChargeMatrix.value);
    } else {
      await storageChargeMatrixStore.createStorageChargeMatrix(storageChargeMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  storageChargeMatrixForm.value?.reset();
  storageChargeMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      storageChargeMatrix.value = { ...props.item };
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
        <v-form ref="storageChargeMatrixForm">
          <v-select
            label="RRP"
            v-model="storageChargeMatrix.dispatch_rrp_id"
            :items="props.rrpList"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-switch
            label="Status"
            v-model="storageChargeMatrix.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
          <v-textarea
            label="Description"
            v-model="storageChargeMatrix.description"
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
