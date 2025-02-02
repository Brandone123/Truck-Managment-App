<!-- src/components/dispatch/RateMatrixEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchRateMatrixEntryStore } from '@/stores/settings/dispatch/dispatchRateMatrixEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchRateMatrixEntryInfo } from '@/types/dispatch/dispatchRateMatrixEntry';

const emit = defineEmits(['update:show']);

const dispatchRateMatrixEntryStore = useDispatchRateMatrixEntryStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchRateMatrixEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const rateMatrixEntryForm = ref(null);
const rateMatrixEntry = ref<DispatchRateMatrixEntryInfo>({});

const title = computed(() => (props.updating ? 'Update Rate Matrix Entry' : 'Add Rate Matrix Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (rateMatrixEntryForm.value) {
    const isValid = await rateMatrixEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchRateMatrixEntryStore.updateDispatchRateMatrixEntry(props.matrixId, rateMatrixEntry.value);
    } else {
      await dispatchRateMatrixEntryStore.createDispatchRateMatrixEntry(props.matrixId, rateMatrixEntry.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  rateMatrixEntryForm.value?.reset();
  rateMatrixEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      rateMatrixEntry.value = { ...props.item };
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
        <v-form ref="rateMatrixEntryForm">
          <!-- Include fields based on rate method and rate type -->
          <!-- For example: -->
          <v-text-field
            label="Origin City"
            v-model="rateMatrixEntry.origin_city"
          ></v-text-field>
          <v-text-field
            label="Destination City"
            v-model="rateMatrixEntry.destination_city"
          ></v-text-field>
          <v-text-field
            label="Rate"
            v-model="rateMatrixEntry.rate"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="rateMatrixEntry.description"
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
