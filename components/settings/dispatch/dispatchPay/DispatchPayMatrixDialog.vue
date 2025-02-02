<!-- src/components/dispatch/DispatchPayMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchPayMatrixStore } from '@/stores/settings/dispatch/dispatchPayMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchPayMatrixInfo } from '@/types/dispatch/dispatchPayMatrix';

const emit = defineEmits(['update:show']);

const dispatchPayMatrixStore = useDispatchPayMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchPayMatrixInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const dispatchPayMatrixForm = ref(null);
const dispatchPayMatrix = ref<DispatchPayMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Dispatch Pay Matrix' : 'Add Dispatch Pay Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (dispatchPayMatrixForm.value) {
    const isValid = await dispatchPayMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchPayMatrixStore.updateDispatchPayMatrix(dispatchPayMatrix.value);
    } else {
      await dispatchPayMatrixStore.createDispatchPayMatrix(dispatchPayMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  dispatchPayMatrixForm.value?.reset();
  dispatchPayMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      dispatchPayMatrix.value = { ...props.item };
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
        <v-form ref="dispatchPayMatrixForm">
          <v-text-field
            label="Name"
            v-model="dispatchPayMatrix.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Description"
            v-model="dispatchPayMatrix.description"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Status"
            v-model="dispatchPayMatrix.status"
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
