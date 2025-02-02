<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="faultForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFault.name" label="Name"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localFault.vehicle_id" label="Select Vehicle" :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFault.date_reported"
                            label="Date Reported" type="date" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFault.fault_code"
                            label="Fault Code" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localFault.priority"
                            :items="priorities" label="Priority" item-value="value" item-title="title"
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFault.source"
                            label="Source" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localFault.status"
                            :items="statuses" label="Status" item-value="value" item-title="title" required></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-checkbox variant="outlined" flat density="compact" v-model="localFault.critical"
                            label="Critical" required :true-value="1" :false-value="0"></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Description</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localFault.description"
                        label="Description" required></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>


        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveFault">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Fault } from '@/types/maintenance/fault';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  fault: {
    type: Object as PropType<Partial<Fault>>,
    required: true,
  },
});

const assetStore = useAssetStore();
const { assetList, getAssetList } = storeToRefs(assetStore);

const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);

const faultForm = ref<HTMLFormElement | null>(null)
const localFault = ref<Partial<Fault>>(JSON.parse(JSON.stringify(props.fault || {})));

const vehicles = [{ label: 'VEH-001', value: '1' }, { label: 'VEH-002', value: '2' }, { label: 'VEH-003', value: '3' }]

watch(
  () => props.fault,
  (newFault) => {
    localFault.value = { ...newFault };
  }
);

const title = computed(() => (props.fault && props.fault.id ? 'Edit Fault' : 'Report Fault'));

const validateForm1 = async () => {
  let formStatus = await faultForm.value?.validate()
  return formStatus.valid ? true : false
}

const saveFault = async () => {
   // validate first window
   let validForm1 = await validateForm1()
  if (!validForm1) {
    return;
  }

  emit('save', localFault.value);
  emit('update:modelValue', false);
  emit('close');
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const priorities = [
  {title: 'No Priority', value: 'normal'},
  {title: 'Low', value: 'low'}, 
  {title: 'Medium', value: 'medium'},	
  { title: 'High', value: 'high'}
];
const statuses = [
  {title: 'Open', value: 'open'},
  {title:  'Pending', value: 'pending'} ,
  {title:  'Resolved', value: 'resolved'},
  {title: 'Ignored', value: 'ignored'}
];

// onMounted(() => {
//   assetStore.fetchAssets();
// })

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (!props.fault || !props.fault.id) {
      // Initialize values only for new fault creation
      localFault.value.date_reported = new Date().toISOString().slice(0, 10);
      localFault.value.status = 'open';
    }
  }
});

watch(() => localFault.value.vehicle_id, (newAssetId) => {
  const selectedAsset = assetList.value.find(asset => asset.id === newAssetId);
  if (selectedAsset) {
    localFault.value.vehicle_name = selectedAsset.name;
  }
});
</script>

<style scoped></style>