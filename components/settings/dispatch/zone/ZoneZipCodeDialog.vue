<!-- src/components/dispatch/ZoneZipCodeDialog.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useZoneZipCodeStore } from '@/stores/settings/dispatch/zoneZipCodeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchZoneZipCodeInfo } from '@/types/dispatch/dispatchZoneZipCode';

const emit = defineEmits(['update:show']);

const zoneZipCodeStore = useZoneZipCodeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  show: Boolean,
  zoneId: Number,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const zipCodeForm = ref(null);
const zipCode = ref<DispatchZoneZipCodeInfo>({});

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (zipCodeForm.value) {
    const isValid = await zipCodeForm.value.validate();
    if (!isValid) return;

    await zoneZipCodeStore.createZoneZipCode(props.zoneId, zipCode.value);
    dialog.value = false;
  }
};

const resetForm = () => {
  zipCodeForm.value?.reset();
  zipCode.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);
</script>

<template>
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <v-toolbar color="primary">
        <span class="white--text">Add Zip Code</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="zipCodeForm">
          <v-text-field
            label="Zip Code"
            v-model="zipCode.zip_code"
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
