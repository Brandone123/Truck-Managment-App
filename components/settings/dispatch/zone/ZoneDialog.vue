<!-- src/components/dispatch/ZoneDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useZoneStore } from '@/stores/settings/dispatch/zoneStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchZoneInfo } from '@/types/dispatch/dispatchZone';

const emit = defineEmits(['update:show']);

const zoneStore = useZoneStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchZoneInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const zoneForm = ref(null);
const zone = ref<DispatchZoneInfo>({});

const title = computed(() => (props.updating ? 'Update Zone' : 'Add Zone'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (zoneForm.value) {
    const isValid = await zoneForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await zoneStore.updateZone(zone.value);
    } else {
      await zoneStore.createZone(zone.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  zoneForm.value?.reset();
  zone.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      zone.value = { ...props.item };
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
        <v-form ref="zoneForm">
          <v-text-field
            label="Code"
            v-model="zone.code"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="zone.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="zone.description"
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
