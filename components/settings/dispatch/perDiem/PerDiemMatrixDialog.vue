<!-- src/components/dispatch/PerDiemMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePerDiemMatrixStore } from '@/stores/settings/dispatch/perDiemMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { PerDiemMatrixInfo } from '@/types/dispatch/perDiemMatrix';
import { useRRPsStore } from '@/stores/settings/dispatch/rrpsStore'; // Assuming you have a store for RRPs (Equipment Owners)

const emit = defineEmits(['update:show']);

const perDiemMatrixStore = usePerDiemMatrixStore();
const rrpsStore = useRRPsStore(); // Fetch RRPs for selection
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<PerDiemMatrixInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const perDiemMatrixForm = ref(null);
const perDiemMatrix = ref<PerDiemMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Per Diem Matrix' : 'Add Per Diem Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

onMounted(() => {
  rrpsStore.fetchRRPs(); // Fetch equipment owners
});

const save = async () => {
  if (perDiemMatrixForm.value) {
    const isValid = await perDiemMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await perDiemMatrixStore.updatePerDiemMatrix(perDiemMatrix.value);
    } else {
      await perDiemMatrixStore.createPerDiemMatrix(perDiemMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  perDiemMatrixForm.value?.reset();
  perDiemMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      perDiemMatrix.value = { ...props.item };
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
        <v-form ref="perDiemMatrixForm">
          <v-select
            label="Equipment Owner"
            v-model="perDiemMatrix.dispatch_rrp_id"
            :items="rrpsStore.rrpsList"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-textarea
            label="Description"
            v-model="perDiemMatrix.description"
          ></v-textarea>
          <v-switch
            label="Status"
            v-model="perDiemMatrix.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
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
