<!-- src/components/dispatch/PerDiemEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePerDiemEntryStore } from '@/stores/settings/dispatch/perDiemEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { PerDiemEntryInfo } from '@/types/dispatch/perDiemEntry';

const emit = defineEmits(['update:show']);

const perDiemEntryStore = usePerDiemEntryStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<PerDiemEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const perDiemEntryForm = ref(null);
const perDiemEntry = ref<PerDiemEntryInfo>({});

const title = computed(() => (props.updating ? 'Update Per Diem Entry' : 'Add Per Diem Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

// Define an array of equipment types directly in the component
const equipmentTypes = [
  { id: 1, name: 'Truck' },
  { id: 2, name: 'Trailer' }
];

const save = async () => {
  if (perDiemEntryForm.value) {
    const isValid = await perDiemEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await perDiemEntryStore.updatePerDiemEntry(props.matrixId, perDiemEntry.value);
    } else {
      await perDiemEntryStore.createPerDiemEntry(props.matrixId, perDiemEntry.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  perDiemEntryForm.value?.reset();
  perDiemEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      perDiemEntry.value = { ...props.item };
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
        <v-form ref="perDiemEntryForm">
          <v-select
            label="Equipment Type"
            v-model="perDiemEntry.dispatch_equipment_type_id"
            :items="equipmentTypes"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            label="Charge Code"
            v-model="perDiemEntry.charge_code"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Free Days"
            v-model="perDiemEntry.free_days"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="First Rate"
            v-model="perDiemEntry.first_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="First Rate Days"
            v-model="perDiemEntry.first_rate_days"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Second Rate"
            v-model="perDiemEntry.second_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Second Rate Days"
            v-model="perDiemEntry.second_rate_days"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Final Rate"
            v-model="perDiemEntry.final_rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="perDiemEntry.description"
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
