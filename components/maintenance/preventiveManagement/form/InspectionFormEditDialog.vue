<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text :class='step == 2 ? "pa-0" : ""' :style='step == 2 ? "overflow: hidden" : ""'>
        <div :style='step >= 2 ? "position:sticky; top:-16px; z-index: 1" : ""' class="grey-background"
          :class='step != 2 ? "mx-n6 mt-n4" : ""'>
          <v-stepper flat class="rounded-0" v-model="step">
            <v-stepper-header>
              <v-stepper-item color="primary" title="Form Info" :value="1"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Inspection Items" :value="2"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Workflows" :value="3"></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </div>
        <v-form ref="inspectionForm">
          <div v-if="step == 1">
            <div class="d-flex justify-center">
              <v-row class="mt-4" style="max-width: 800px">
                <v-col cols="12">
                  <v-text-field variant="solo" flat density="compact" v-model="localForm.name" label="Form Name"
                    required :rules="[validation.required]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select variant="solo" flat density="compact" v-model="localForm.type" :items="formTypes"
                    label="Form Type" item-value="value" item-title="title"></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select variant="solo" flat density="compact" v-model="localForm.status" :items="formStatuses"
                    item-value="value" item-title="title" label="Status" required
                    :rules="[validation.required]"></v-select>
                </v-col>
              </v-row>
            </div>
          </div>
          <div v-if="step == 2">
            <FormBuilder v-model="elements" @update:validity="elementsValid = $event" />
          </div>
          <div v-if="step == 3">
            <v-card-text>
              <WorkflowPreview v-model="workflows" :inspectionItems="elements" :inspectionWorkflows="workflows" />
            </v-card-text>
          </div>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="nextStep">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="step === 3" color="primary" variant="text" @click="saveForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType, toRefs } from 'vue';
import type { InspectionForm } from '@/types/maintenance/inspectionForm';
import FormBuilder from './FormBuilder/FormBuilder.vue';
import WorkflowPreview from './WorkflowBuilder/WorkflowPreview.vue';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<Partial<InspectionForm>>,
    default: () => ({
      id: null,
      name: '',
      type: '',
      status: 'Draft',
      current_version: {
        elements: [],
        workflows: []
      }
    })
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localForm = ref({ ...props.form });

const step = ref(1);

const title = computed(() => (props.form && props.form.id ? 'Edit Inspection Form' : 'Create Inspection Form'));

const inspectionForm = ref<HTMLFormElement | null>(null);


const workflows = computed({
  get() {
    return localForm.value.current_version?.workflows || []
  },
  set(val) {
    if (!localForm.value.current_version) {
      localForm.value.current_version = { elements: [], workflows: [] } as any
    }
    localForm.value.current_version!.workflows = val
  }
})

const elements = computed({
  get() {
    return localForm.value.current_version?.elements || []
  },
  set(val) {
    if (!localForm.value.current_version) {
      localForm.value.current_version = { elements: [], workflows: [] } as any
    }
    localForm.value.current_version!.elements = val
  }
})

const elementsValid = ref<boolean>(false);

const saveForm = () => {
  let payload = {
    id: localForm.value.id,
    name: localForm.value.name,
    status: localForm.value.status,
    workflows: workflows.value,
    elements: elements.value
  }
  emit('save', payload);
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

const { modelValue, form } = toRefs(props);

const nextStep = async () => {

  const formStatus = await inspectionForm.value?.validate()

  if (step.value == 1) {
    if (!formStatus.valid) {
      return
    }
  } if (step.value == 2) {
    if (localForm.value.current_version?.elements.length == 0 || !formStatus.valid) {
      return
    }
  }

  step.value += 1
}

watch([modelValue, form], ([newModelValue, newForm]) => {
  if (newModelValue === false) {
    resetForm();
  }

  if (newForm) {
    localForm.value = { ...newForm };
  }
})

const resetForm = () => {
  step.value = 1
  localForm.value = {
    name: '',
    type: '',
    status: 'Draft',
    current_version: {
      elements: [],
      workflows: []
    } as any,
  }
}
const formTypes = [{ title: 'Daily', value: 'daily' }, { title: 'Pre-Trip', value: 'pre-trip' }, { title: 'Post-Trip', value: 'post-trip' }];
const formStatuses = [{ title: 'Active', value: 'active' }, { title: 'Draft', value: 'draft' }]
</script>