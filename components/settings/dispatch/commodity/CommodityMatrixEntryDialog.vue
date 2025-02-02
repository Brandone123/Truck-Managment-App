<!-- src/components/dispatch/CommodityMatrixEntryDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCommodityMatrixEntryStore } from '@/stores/settings/dispatch/commodityMatrixEntryStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { CommodityMatrixEntryInfo } from '@/types/dispatch/commodityMatrixEntry';
import type { CommodityTypeInfo } from '@/types/dispatch/commodityType';

const emit = defineEmits(['update:show']);

const commodityMatrixEntryStore = useCommodityMatrixEntryStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<CommodityMatrixEntryInfo>,
  updating: Boolean,
  show: Boolean,
  matrixId: Number,
  commodityTypeList: Array as PropType<CommodityTypeInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const commodityMatrixEntryForm = ref(null);
const commodityMatrixEntry = ref<CommodityMatrixEntryInfo>({});

const title = computed(() => (props.updating ? 'Update Commodity Matrix Entry' : 'Add Commodity Matrix Entry'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (commodityMatrixEntryForm.value) {
    const isValid = await commodityMatrixEntryForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await commodityMatrixEntryStore.updateCommodityMatrixEntry(props.matrixId, commodityMatrixEntry.value);
    } else {
      await commodityMatrixEntryStore.createCommodityMatrixEntry(props.matrixId, commodityMatrixEntry.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  commodityMatrixEntryForm.value?.reset();
  commodityMatrixEntry.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      commodityMatrixEntry.value = { ...props.item };
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
        <v-form ref="commodityMatrixEntryForm">
          <v-select
            label="Commodity Type"
            v-model="commodityMatrixEntry.dispatch_commodity_id"
            :items="props.commodityTypeList"
            item-text="type"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            label="Origin Zip Start"
            v-model="commodityMatrixEntry.origin_zip_start"
          ></v-text-field>
          <v-text-field
            label="Origin Zip End"
            v-model="commodityMatrixEntry.origin_zip_end"
          ></v-text-field>
          <v-text-field
            label="Destination Zip Start"
            v-model="commodityMatrixEntry.destination_zip_start"
          ></v-text-field>
          <v-text-field
            label="Destination Zip End"
            v-model="commodityMatrixEntry.destination_zip_end"
          ></v-text-field>
          <v-text-field
            label="Low Weight"
            v-model="commodityMatrixEntry.low_weight"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="High Weight"
            v-model="commodityMatrixEntry.high_weight"
            :rules="[rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Rate per CWT"
            v-model="commodityMatrixEntry.rate_per_cwt"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="commodityMatrixEntry.description"
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
