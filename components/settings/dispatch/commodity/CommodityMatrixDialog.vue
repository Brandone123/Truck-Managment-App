<!-- src/components/dispatch/CommodityMatrixDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCommodityMatrixStore } from '@/stores/settings/dispatch/commodityMatrixStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { CommodityMatrixInfo } from '@/types/dispatch/commodityMatrix';
import type { DispatchRateMethodInfo } from '@/types/dispatch/dispatchRateMethod';
import type { DispatchRateTypeInfo } from '@/types/dispatch/dispatchRateType';

const emit = defineEmits(['update:show']);

const commodityMatrixStore = useCommodityMatrixStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<CommodityMatrixInfo>,
  updating: Boolean,
  show: Boolean,
  rateMethods: Array as PropType<DispatchRateMethodInfo[]>,
  rateTypes: Array as PropType<DispatchRateTypeInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const commodityMatrixForm = ref(null);
const commodityMatrix = ref<CommodityMatrixInfo>({});

const title = computed(() => (props.updating ? 'Update Commodity Matrix' : 'Add Commodity Matrix'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (commodityMatrixForm.value) {
    const isValid = await commodityMatrixForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await commodityMatrixStore.updateCommodityMatrix(commodityMatrix.value);
    } else {
      await commodityMatrixStore.createCommodityMatrix(commodityMatrix.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  commodityMatrixForm.value?.reset();
  commodityMatrix.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      commodityMatrix.value = { ...props.item };
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
        <v-form ref="commodityMatrixForm">
          <v-text-field
            label="Name"
            v-model="commodityMatrix.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="Rate Method"
            v-model="commodityMatrix.dispatch_rate_method_id"
            :items="props.rateMethods"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-select
            label="Rate Type"
            v-model="commodityMatrix.dispatch_rate_type_id"
            :items="props.rateTypes"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-switch
            label="Status"
            v-model="commodityMatrix.status"
            :true-value="true"
            :false-value="false"
            :true-label="'Active'"
            :false-label="'Inactive'"
          ></v-switch>
          <v-textarea
            label="Description"
            v-model="commodityMatrix.description"
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
