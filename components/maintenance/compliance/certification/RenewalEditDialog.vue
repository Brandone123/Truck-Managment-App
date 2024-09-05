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
        <v-form ref="renewalForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select variant="solo" flat density="compact" label="Select Vehicle*" :items="assetList"
                v-model="localRenewal.vehicle_id" item-title="name" item-value="id"
                :rules="[validation.required]"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select variant="solo" flat density="compact" label="Renewal Type*"
                :items="['Insurance', 'Registration', 'Emission Test', 'Certification']" v-model="localRenewal.type"
                :rules="[validation.required]"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field variant="solo" flat density="compact" label="Due Date*" v-model="localRenewal.due_date"
                type="date" :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field variant="solo" flat density="compact" label="Due Soon Threshhold"
                v-model="localRenewal.due_soon_threshold" type="date"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select variant="solo" flat density="compact" label="Status*"
                :items="['pending', 'completed', 'in progress']" v-model="localRenewal.status"
                :rules="[validation.required]"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-textarea variant="solo" flat density="compact" label="Comments"
                v-model="localRenewal.comments"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveRenewal">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useVehicleStore } from '@/stores/vehicle';
import type { Renewal } from '@/types/maintenance/renewalTypes';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  renewal: {
    type: Object as PropType<Partial<Renewal>>,
    default: {} as Partial<Renewal>
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore)

const localRenewal = ref<Partial<Renewal>>(JSON.parse(JSON.stringify(props.renewal)));

const title = computed(() => (props.renewal && props.renewal.id ? 'Edit Renewal' : 'Add Renewal'));

const renewalForm = ref<HTMLFormElement | null>(null)

watch(
  () => props.renewal,
  (newRenewal) => {
    localRenewal.value = JSON.parse(JSON.stringify(newRenewal));
  }
);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveRenewal = async () => {
  let formStatus = await renewalForm.value?.validate()
  if (!formStatus.valid) {
    return
  }

  emit('save', localRenewal.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>