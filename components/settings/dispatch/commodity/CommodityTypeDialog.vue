<!-- src/components/dispatch/CommodityTypeDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCommodityTypeStore } from '@/stores/settings/dispatch/commodityTypeStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { CommodityTypeInfo } from '@/types/dispatch/commodityType';

const emit = defineEmits(['update:show']);

const commodityTypeStore = useCommodityTypeStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<CommodityTypeInfo>,
  updating: Boolean,
  show: Boolean,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const commodityTypeForm = ref(null);
const commodityType = ref<CommodityTypeInfo>({});

const title = computed(() => (props.updating ? 'Update Commodity Type' : 'Add Commodity Type'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = async () => {
  if (commodityTypeForm.value) {
    const isValid = await commodityTypeForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await commodityTypeStore.updateCommodityType(commodityType.value);
    } else {
      await commodityTypeStore.createCommodityType(commodityType.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  commodityTypeForm.value?.reset();
  commodityType.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      commodityType.value = { ...props.item };
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
        <v-form ref="commodityTypeForm">
          <v-text-field
            label="Type"
            v-model="commodityType.type"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Haz Mat Code"
            v-model="commodityType.haz_mat_code"
          ></v-text-field>
          <v-text-field
            label="Class"
            v-model="commodityType.class"
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="commodityType.description"
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
