<!-- src/components/dispatch/AccessorialChargeDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAccessorialChargeStore } from '@/stores/settings/dispatch/accessorialChargeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { AccessorialChargeInfo } from '@/types/dispatch/accessorialCharge';

const emit = defineEmits(['update:show']);

const accessorialChargeStore = useAccessorialChargeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<AccessorialChargeInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const accessorialChargeForm = ref(null);
const accessorialCharge = ref<AccessorialChargeInfo>({});

const title = computed(() => (props.updating ? 'Update Accessorial Charge' : 'Add Accessorial Charge'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (accessorialChargeForm.value) {
    const isValid = await accessorialChargeForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await accessorialChargeStore.updateAccessorialCharge(accessorialCharge.value);
    } else {
      await accessorialChargeStore.createAccessorialCharge(accessorialCharge.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  accessorialChargeForm.value?.reset();
  accessorialCharge.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      accessorialCharge.value = { ...props.item };
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
        <v-form ref="accessorialChargeForm">
          <v-text-field
            label="Code"
            v-model="accessorialCharge.code"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Description"
            v-model="accessorialCharge.description"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Calculation Method"
            v-model="accessorialCharge.calculation_method"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Rate"
            v-model="accessorialCharge.rate"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-select
            label="Status"
            v-model="accessorialCharge.status"
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
