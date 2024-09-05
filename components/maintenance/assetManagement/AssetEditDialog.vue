<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="assetForm">
          <v-row class="mt-1">
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.name" :rules="[validation.required]" label="Name*" variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-select v-model="localAsset.status" :rules="[validation.required]" label="Status*"
                :items="statusOptions" item-value="value" item-title="label" variant="solo" flat
                density="compact"></v-select>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-select v-model="localAsset.type" :items="['Truck', 'Trailer', 'Equipment']"
                :rules="[validation.required]" label="Type*" variant="solo" flat density="compact"></v-select>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.vin" :rules="[validation.required, validation.fixedStringLength(17)]"
                label="VIN" variant="solo" flat density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.make" :rules="[validation.required]" label="Make*" variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.model" :rules="[validation.required]" label="Model*" variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.year"
                :rules="[validation.required, validation.minNumber(1900), validation.maxNumber(currentYear)]"
                label="Year*" type="number" variant="solo" flat density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.odometer" label="Odometer" type="number" variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localAsset.license_plate" label="License Plate" variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAsset">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { Asset } from '~/types/maintenance/assetTypes';

const props = defineProps({
  modelValue: Boolean,
  asset: {
    type: Object as PropType<Partial<Asset>>,
    required: true,
  },
});

const statusOptions = [
  { label: 'Active', value: 'active' }, 
  { label: 'Inactive', value: 'inactive' }, 
  { label: 'Out of Service', value: 'Out of Service' }, 
  { label: 'In Shop', value: 'In Shop' }];

const emit = defineEmits(['update:modelValue', 'save']);

const localAsset = ref<Partial<Asset>>(JSON.parse(JSON.stringify(props.asset || {})));

const validation = useValidation();
const currentYear = new Date().getFullYear();

const assetForm = ref<HTMLFormElement | null>(null)
watch(
  () => props.asset,
  (newAsset) => {
    localAsset.value = JSON.parse(JSON.stringify(newAsset || {}))
  }
);

const title = computed(() => (props.asset && props.asset.id ? 'Edit Asset' : 'Add Asset'));

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const saveAsset = async () => {
  const formStatus = await assetForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  emit('save', localAsset.value);
  emit('update:modelValue', false);
};
</script>

<style scoped></style>
