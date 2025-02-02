<!-- src/components/dispatch/RateMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchRateMatrixStore } from '@/stores/settings/dispatch/dispatchRateMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchRateMatrixInfo } from '@/types/dispatch/dispatchRateMatrix';
import type { DispatchRateMethodInfo } from '@/types/dispatch/dispatchRateMethod';
import type { DispatchRateTypeInfo } from '@/types/dispatch/dispatchRateType';

const emit = defineEmits(['update:show']);

const dispatchRateMatrixStore = useDispatchRateMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchRateMatrixInfo>,
  updating: Boolean,
  show: Boolean,
  rateMethods: Array as PropType<DispatchRateMethodInfo[]>,
  rateTypes: Array as PropType<DispatchRateTypeInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const rateMatrixForm = ref(null);
const rateMatrix = ref<DispatchRateMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Rate Matrix' : 'Add Rate Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (rateMatrixForm.value) {
    const isValid = await rateMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchRateMatrixStore.updateDispatchRateMatrix(rateMatrix.value);
    } else {
      await dispatchRateMatrixStore.createDispatchRateMatrix(rateMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  rateMatrixForm.value?.reset();
  rateMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      rateMatrix.value = { ...props.item };
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
        <v-form ref="rateMatrixForm">
          <v-text-field
            label="Matrix No"
            v-model="rateMatrix.matrix_no"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="rateMatrix.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Rate Method"
            v-model="rateMatrix.dispatch_rate_method_id"
            :items="props.rateMethods"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-select
            label="Rate Type"
            v-model="rateMatrix.dispatch_rate_type_id"
            :items="props.rateTypes"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-switch
            label="Bidirectional"
            v-model="rateMatrix.is_bidirectional"
            :true-value="true"
            :false-value="false"
          ></v-switch>
          <v-switch
            label="Status"
            v-model="rateMatrix.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
          <v-textarea
            label="Description"
            v-model="rateMatrix.description"
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
