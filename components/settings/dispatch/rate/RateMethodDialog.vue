<!-- src/components/dispatch/RateMethodDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDispatchRateMethodStore } from '@/stores/settings/dispatch/dispatchRateMethodStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchRateMethodInfo } from '@/types/dispatch/dispatchRateMethod';

const emit = defineEmits(['update:show']);

const dispatchRateMethodStore = useDispatchRateMethodStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchRateMethodInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const rateMethodForm = ref(null);
const rateMethod = ref<DispatchRateMethodInfo>({});

const title = computed(() => (props.updating ? 'Update Rate Method' : 'Add Rate Method'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (rateMethodForm.value) {
    const isValid = await rateMethodForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await dispatchRateMethodStore.updateDispatchRateMethod(rateMethod.value);
    } else {
      await dispatchRateMethodStore.createDispatchRateMethod(rateMethod.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  rateMethodForm.value?.reset();
  rateMethod.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      rateMethod.value = { ...props.item };
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
        <v-form ref="rateMethodForm">
          <v-text-field
            label="Name"
            v-model="rateMethod.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="rateMethod.description"
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
