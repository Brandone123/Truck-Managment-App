<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px"
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ data?.id ? 'Edit' : 'Add' }} Telematics Device</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="telematicsForm">
          <v-row> 
            <v-col cols="12" md="6">
              <v-text-field density="compact" variant="solo" v-model="localData.telematics_equipment_id" label="Device ID"
                :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete density="compact" variant="solo" v-model="localData.vehicle_id" :items="assetList" item-value="id" item-title="name" label="Vehicle"
                :rules="[validation.required]"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-select density="compact" variant="solo" v-model="localData.data_type" :items="dataTypes" label="Data Type"
                :rules="[validation.required]"></v-select>
            </v-col>
          </v-row>
          <div class="my-3 text-h6">Telematics Data</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field density="compact" variant="solo" v-model="localData.data_value.date" label="Date" type="date"
                :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" variant="solo" v-model="localData.data_value.mileage" label="Mileage" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" variant="solo" v-model="localData.data_value.engine_status" label="Engine Status"
                :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" variant="solo" v-model="localData.data_value.engine_oil_level" label="Engine Oil Level"
                :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field density="compact" variant="solo" v-model="localData.data_value.location" label="Location"
                :rules="[validation.required]"></v-text-field>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col cols="12">
              <v-textarea v-model="localData.summary" label="Summary" required></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="localData.notes" label="Notes"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input v-model="localData.attachments" label="Attachments" multiple></v-file-input>
            </v-col>
          </v-row> -->
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import { useTelematicsStore } from '@/stores/maintenance/telematicsStore';
import type { TelematicsData, DataValue } from '@/types/maintenance/telematicsTypes';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object as () => Partial<TelematicsData>,
    default: () => ({
      data_value: {} as DataValue
    }),
  },
});

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const emit = defineEmits(['update:modelValue', 'close', 'save']);
const localData = ref(JSON.parse(JSON.stringify(props.data)));

watch(() => props.data, (newValue) => {
  localData.value = JSON.parse(JSON.stringify(newValue))
});

const dataTypes = ['Inspection', 'Service', 'Fuel Entry'];
const telematicsForm = ref<HTMLFormElement | null>(null)
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const save = async () => {
  const formStatus = await telematicsForm.value?.validate()
  if (!formStatus.valid) {
    return
  }

  emit('save', localData.value);
  closeDialog();
};
</script>