<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px"
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="inventoryItemForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="comfortable" label="Aisle" :items="partSupplies"
                item-title="part_number" item-value="id" v-model="currentInventoryItem.aisle"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="comfortable" type="number" label="Row"
                v-model="currentInventoryItem.row"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="comfortable" label="Bin" type="number"
                v-model="currentInventoryItem.bin" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="solo" flat density="comfortable" type="number" label="Current Quantity"
                :rules="[validation.required]" v-model="currentInventoryItem.quantity" required></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveInventoryItem">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineEmits } from 'vue';
import type { InventoryItem } from '@/types/maintenance/inventoryTypes';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  inventoryItem: {
    type: Object as PropType<Partial<InventoryItem>>,
    required: true,
  },
});

const validation = useValidation();
const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore)


const currentInventoryItem = ref<Partial<InventoryItem>>(JSON.parse(JSON.stringify(props.inventoryItem || {})));

const emit = defineEmits(['update:modelValue', 'close', 'save']);


const title = computed(() => (props.inventoryItem && props.inventoryItem.id ? 'Edit Inventory Item' : 'Add Inventory Item'));

watch(
  () => props.inventoryItem,
  (newInventoryItem) => {
    currentInventoryItem.value = { ...newInventoryItem };
  }
);

const inventoryItemForm = ref<HTMLFormElement | null>(null)

const validateForm = async () => {
  let formStatus = await inventoryItemForm.value?.validate()
  return formStatus.valid ? true : false
}

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveInventoryItem = async () => {
  // validate first window
  let validForm1 = await validateForm()
  if (!validForm1) {
    return;
  }

  emit('save', currentInventoryItem.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>