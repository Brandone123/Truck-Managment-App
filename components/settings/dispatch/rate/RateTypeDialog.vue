<!-- src/components/dispatch/RateTypeDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchRateTypeStore } from '@/stores/settings/dispatch/dispatchRateTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchRateTypeInfo } from '@/types/dispatch/dispatchRateType';

const emit = defineEmits(['update:show']);

const dispatchRateTypeStore = useDispatchRateTypeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchRateTypeInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const rateTypeForm = ref(null);
const rateType = ref<DispatchRateTypeInfo>({});

const title = computed(() => (props.updating ? 'Update Rate Type' : 'Add Rate Type'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (rateTypeForm.value) {
    const isValid = await rateTypeForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchRateTypeStore.updateDispatchRateType(rateType.value);
    } else {
      await dispatchRateTypeStore.createDispatchRateType(rateType.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  rateTypeForm.value?.reset();
  rateType.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      rateType.value = { ...props.item };
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
        <v-form ref="rateTypeForm">
          <v-text-field
            label="Name"
            v-model="rateType.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="rateType.description"
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
