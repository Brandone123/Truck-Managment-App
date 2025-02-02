<!-- src/components/dispatch/DispatchPayMatrixEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchPayMatrixEntryStore } from '@/stores/settings/dispatch/dispatchPayMatrixEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchPayMatrixEntryInfo } from '@/types/dispatch/dispatchPayMatrixEntry';

const emit = defineEmits(['update:show']);

const dispatchPayMatrixEntryStore = useDispatchPayMatrixEntryStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchPayMatrixEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const dispatchPayMatrixEntryForm = ref(null);
const dispatchPayMatrixEntry = ref<DispatchPayMatrixEntryInfo>({});

const title = computed(() => (props.updating ? 'Update Entry' : 'Add Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (dispatchPayMatrixEntryForm.value) {
    const isValid = await dispatchPayMatrixEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchPayMatrixEntryStore.updateDispatchPayMatrixEntry(
        props.matrixId,
        dispatchPayMatrixEntry.value
      );
    } else {
      await dispatchPayMatrixEntryStore.createDispatchPayMatrixEntry(
        props.matrixId,
        dispatchPayMatrixEntry.value
      );
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  dispatchPayMatrixEntryForm.value?.reset();
  dispatchPayMatrixEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      dispatchPayMatrixEntry.value = { ...props.item };
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
        <v-form ref="dispatchPayMatrixEntryForm">
          <v-text-field
            label="From Zone"
            v-model="dispatchPayMatrixEntry.from_zone"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="To Zone"
            v-model="dispatchPayMatrixEntry.to_zone"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Rate"
            v-model="dispatchPayMatrixEntry.rate"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-select
            label="Status"
            v-model="dispatchPayMatrixEntry.status"
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
