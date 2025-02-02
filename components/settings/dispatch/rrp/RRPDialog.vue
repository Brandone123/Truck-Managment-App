<!-- src/components/dispatch/RRPDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRRPStore } from '@/stores/settings/dispatch/rrpStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchRRPInfo } from '@/types/dispatch/dispatchRRP';

const emit = defineEmits(['update:show']);

const rrpStore = useRRPStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchRRPInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const rrpForm = ref(null);
const rrp = ref<DispatchRRPInfo>({});

const title = computed(() => (props.updating ? 'Update RRP' : 'Add RRP'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (rrpForm.value) {
    const isValid = await rrpForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await rrpStore.updateRRP(rrp.value);
    } else {
      await rrpStore.createRRP(rrp.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  rrpForm.value?.reset();
  rrp.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      rrp.value = { ...props.item };
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
        <v-form ref="rrpForm">
          <v-text-field
            label="Code"
            v-model="rrp.code"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="rrp.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Type"
            v-model="rrp.type"
            :items="['Port', 'Rail', 'Equipment Owner']"
            :rules="[rules.required]"
          ></v-select>
          <v-switch
            label="Status"
            v-model="rrp.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
          <v-textarea
            label="Description"
            v-model="rrp.description"
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
