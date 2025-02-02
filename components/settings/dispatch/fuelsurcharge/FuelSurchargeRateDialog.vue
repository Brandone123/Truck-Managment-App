<!-- src/components/dispatch/FuelSurchargeRateDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFuelSurchargeRateStore } from '@/stores/settings/dispatch/fuelSurchargeRateStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { FuelSurchargeRateInfo } from '@/types/dispatch/fuelSurchargeRate';

const emit = defineEmits(['update:show']);

const fuelSurchargeRateStore = useFuelSurchargeRateStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<FuelSurchargeRateInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const fuelSurchargeRateForm = ref(null);
const fuelSurchargeRate = ref<FuelSurchargeRateInfo>({});

const title = computed(() => (props.updating ? 'Update Fuel Surcharge Rate' : 'Add Fuel Surcharge Rate'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (fuelSurchargeRateForm.value) {
    const isValid = await fuelSurchargeRateForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await fuelSurchargeRateStore.updateFuelSurchargeRate(
        props.matrixId,
        fuelSurchargeRate.value
      );
    } else {
      await fuelSurchargeRateStore.createFuelSurchargeRate(
        props.matrixId,
        fuelSurchargeRate.value
      );
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  fuelSurchargeRateForm.value?.reset();
  fuelSurchargeRate.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      fuelSurchargeRate.value = { ...props.item };
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
        <v-form ref="fuelSurchargeRateForm">
          <v-text-field
            label="Fuel Price From"
            v-model="fuelSurchargeRate.fuel_price_from"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Fuel Price To"
            v-model="fuelSurchargeRate.fuel_price_to"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Surcharge Rate"
            v-model="fuelSurchargeRate.surcharge_rate"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
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
