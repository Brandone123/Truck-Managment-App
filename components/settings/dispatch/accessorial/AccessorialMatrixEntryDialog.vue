<!-- src/components/settings/dispatch/accessorial/AccessorialMatrixEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAccessorialMatrixEntryStore } from '@/stores/settings/dispatch/accessorialMatrixEntryStore';
import { useAccessorialChargeStore } from '@/stores/settings/dispatch/accessorialChargeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { AccessorialMatrixEntryInfo } from '@/types/dispatch/accessorialMatrixEntry';
import type { AccessorialChargeInfo } from '@/types/dispatch/accessorialCharge';

const emit = defineEmits(['update:show']);

const accessorialMatrixEntryStore = useAccessorialMatrixEntryStore();
const accessorialChargeStore = useAccessorialChargeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<AccessorialMatrixEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const accessorialMatrixEntryForm = ref(null);
const accessorialMatrixEntry = ref<AccessorialMatrixEntryInfo>({});

const accessorialCharges = ref<AccessorialChargeInfo[]>([]);

const title = computed(() => (props.updating ? 'Update Entry' : 'Add Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

onMounted(() => {
  accessorialChargeStore.fetchAccessorialChargeList().then(() => {
    accessorialCharges.value = accessorialChargeStore.accessorialChargeList;
    console.log("Accessorial Charges Loaded:", accessorialCharges.value);
  });
});

const onChargeChange = () => {
  const selectedCharge = accessorialCharges.value.find(
    (charge) => charge.id === accessorialMatrixEntry.value.dispatch_accessorial_charge_id
  );
  if (selectedCharge) {
    accessorialMatrixEntry.value.rate = selectedCharge.rate;
    accessorialMatrixEntry.value.description = selectedCharge.description;
  }
};

const save = async () => {
  if (accessorialMatrixEntryForm.value) {
    const isValid = await accessorialMatrixEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await accessorialMatrixEntryStore.updateAccessorialMatrixEntry(accessorialMatrixEntry.value);
    } else {
      await accessorialMatrixEntryStore.createAccessorialMatrixEntry({
        ...accessorialMatrixEntry.value,
        dispatch_accessorial_matrix_id: props.matrixId,
      });
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  accessorialMatrixEntryForm.value?.reset();
  accessorialMatrixEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      accessorialMatrixEntry.value = { ...props.item };
    } else {
      resetForm();
    }
  }
);

watch(
  () => accessorialMatrixEntry.value.dispatch_accessorial_charge_id,
  () => {
    onChargeChange();
  }
);
</script>

<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-toolbar color="primary" dark>
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="accessorialMatrixEntryForm">
          <v-select
            label="Accessorial Charge"
            v-model="accessorialMatrixEntry.dispatch_accessorial_charge_id"
            :items="accessorialCharges"
            item-title="code"
            item-value="id"
            :rules="[rules.required]"
            @change="onChargeChange"
          ></v-select>

          <v-text-field
            label="Rate"
            v-model="accessorialMatrixEntry.rate"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>

          <v-textarea
            label="Description"
            v-model="accessorialMatrixEntry.description"
          ></v-textarea>

          <!-- Dummy data for fuel matrix and accounts -->
          <v-select
            label="Fuel Matrix"
            v-model="accessorialMatrixEntry.fuel_matrix"
            :items="['Fuel Matrix 1', 'Fuel Matrix 2']"
          ></v-select>

          <v-select
            label="Account"
            v-model="accessorialMatrixEntry.account_id"
            :items="[1, 2, 3]" 
          ></v-select>

          <v-select
            label="Rounding"
            v-model="accessorialMatrixEntry.rounding"
            :items="['up', 'down', 'none']"
            :rules="[rules.required]"
          ></v-select>

          <v-select
            label="Invoice Inclusion"
            v-model="accessorialMatrixEntry.invoice_inclusion"
            :items="['itemize', 'include_in_rate']"
            :rules="[rules.required]"
          ></v-select>

          <v-switch
            label="Paid to Driver"
            v-model="accessorialMatrixEntry.paid_to_driver"
          ></v-switch>

          <v-switch
            label="Commission Paid"
            v-model="accessorialMatrixEntry.commission_paid"
          ></v-switch>

          <v-switch
            label="Auto Add"
            v-model="accessorialMatrixEntry.auto_add"
          ></v-switch>

          <v-select
            label="Status"
            v-model="accessorialMatrixEntry.status"
            :items="['active', 'inactive', 'pending']"
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
