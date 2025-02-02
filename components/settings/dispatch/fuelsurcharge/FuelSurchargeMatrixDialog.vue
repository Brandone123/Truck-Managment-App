<!-- src/components/dispatch/FuelSurchargeMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFuelSurchargeMatrixStore } from '@/stores/settings/dispatch/fuelSurchargeMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { FuelSurchargeMatrixInfo } from '@/types/dispatch/fuelSurchargeMatrix';

const emit = defineEmits(['update:show']);

const fuelSurchargeMatrixStore = useFuelSurchargeMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<FuelSurchargeMatrixInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const fuelSurchargeMatrixForm = ref(null);
const fuelSurchargeMatrix = ref<FuelSurchargeMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Fuel Surcharge Matrix' : 'Add Fuel Surcharge Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (fuelSurchargeMatrixForm.value) {
    const isValid = await fuelSurchargeMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await fuelSurchargeMatrixStore.updateFuelSurchargeMatrix(fuelSurchargeMatrix.value);
    } else {
      await fuelSurchargeMatrixStore.createFuelSurchargeMatrix(fuelSurchargeMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  fuelSurchargeMatrixForm.value?.reset();
  fuelSurchargeMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      fuelSurchargeMatrix.value = { ...props.item };
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
        <v-form ref="fuelSurchargeMatrixForm">
          <v-text-field
            label="Name"
            v-model="fuelSurchargeMatrix.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Rate Method"
            v-model="fuelSurchargeMatrix.rate_method"
            :items="['Pricing Table']"
            :rules="[rules.required]"
          ></v-select>
          <v-select
            label="Rate Type"
            v-model="fuelSurchargeMatrix.rate_type"
            :items="['Percent', 'Flat']"
            :rules="[rules.required]"
          ></v-select>
          <v-textarea
            label="Description"
            v-model="fuelSurchargeMatrix.description"
          ></v-textarea>
          <v-switch
            label="Status"
            v-model="fuelSurchargeMatrix.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
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
