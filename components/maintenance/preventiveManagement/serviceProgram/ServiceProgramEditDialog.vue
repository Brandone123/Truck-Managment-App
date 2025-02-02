<template>
  <v-dialog v-model="dialog" scrollable max-width="800px">
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="serviceProgramForm">
          <v-row class="mt-4">
            <v-col cols="12" class="py-0">
              <v-text-field variant="outlined" flat density="compact" v-model="localServiceProgram.program_name"
                label="Program Name*" :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-textarea variant="outlined" flat density="compact" v-model="localServiceProgram.description"
                label="Description"></v-textarea>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-card class="pa-2" variant="outlined">
                <v-radio-group hide-details density="compact" color="primary"
                  v-model="localServiceProgram.primary_meter_utilization" :rules="[validation.required]">
                  <template v-slot:label>
                    <div>
                      <div class="text-caption font-weight-bold">Primary Meter*</div>
                      <div class="text-caption">Select how you measure utilization for this service program.</div>
                    </div>
                  </template>
                  <v-radio value="miles" label="Miles"></v-radio>
                  <v-radio value="kilometers" label="Kilometers"></v-radio>
                  <v-radio value="hours" label="Hours"></v-radio>
                </v-radio-group>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions density="">
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveServiceProgram">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { ServiceProgramPayload } from '@/types/maintenance/ServiceProgram';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  serviceProgram: {
    type: Object as PropType<Partial<ServiceProgramPayload>>,
    default: () => ({ subscribed_tasks: [], subscribed_vehicles: [] }),
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const serviceProgramForm = ref<HTMLFormElement | null>(null);
const localServiceProgram = ref<Partial<ServiceProgramPayload>>({});

watch(
  () => props.serviceProgram,
  (newServiceProgram) => {
    localServiceProgram.value = JSON.parse(JSON.stringify(newServiceProgram));
  },
  { immediate: true }
);

const title = computed(() => (props.serviceProgram && props.serviceProgram.id ? 'Edit Service Program' : 'Create Service Program'));


const saveServiceProgram = async () => {
  const formStatus = await serviceProgramForm.value?.validate();
  if (!formStatus.valid) {
    return
  }

  emit('save', localServiceProgram.value);
  closeDialog();
};

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val);
  }
})

const closeDialog = () => {
  dialog.value = false
  emit('close');
  resetForm();
};

const resetForm = () => {
  localServiceProgram.value = JSON.parse(JSON.stringify(props.serviceProgram));
};
</script>