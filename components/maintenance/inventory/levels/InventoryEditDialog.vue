<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
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
              <v-col cols="12" sm="6">
                 <v-select variant="solo" flat density="compact" label="Select Part" :items="partSupplies" item-title="part_number" item-value="id" v-model="localInventoryItem.part_id" :rules="[validation.required]"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-text-field variant="solo" flat density="compact" type="number" label="Current Quantity" v-model="localInventoryItem.current_quantity" :rules="[validation.required]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-text-field variant="solo" flat density="compact" label="Reorder Point" v-model="localInventoryItem.reorder_point" type="number" :rules="[validation.required]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-text-field variant="solo" flat density="compact" label="Location" v-model="localInventoryItem.location" required></v-text-field>
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
  import { ref, computed, watch } from 'vue';
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
  const {partSupplies} = storeToRefs(partsAndSuppliesStore)
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const localInventoryItem = ref<Partial<InventoryItem>>(JSON.parse(JSON.stringify(props.inventoryItem || {})));
  
  const title = computed(() => (props.inventoryItem && props.inventoryItem.id ? 'Edit Inventory Item' : 'Add Inventory Item'));
  
  watch(
    () => props.inventoryItem,
    (newInventoryItem) => {
      localInventoryItem.value = { ...newInventoryItem };
    }
  );

  const inventoryItemForm = ref<HTMLFormElement | null>(null)

  const validateForm1 = async () => {
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
    let validForm1 = await validateForm1()
    if (!validForm1) {
      return;
    }

    emit('save', localInventoryItem.value);
    emit('update:modelValue', false);
    emit('close');
  };
  </script>
  