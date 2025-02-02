<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Copy Inspection Form</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="inspectionFormCopy">
          <v-row>
            <v-col cols="12">
              <v-text-field density="comfortable" variant="outlined" :rules=[validation.required]
                label="New Form Title*" v-model="localForm.name"></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-checkbox density="comfortable" label="Include Workflows" v-model="localForm.workflows" color="primary"
                hide-details></v-checkbox>
              <!-- <v-checkbox density="comfortable" label="Include Schedules" v-model="localForm.schedules" color="primary"
                hide-details></v-checkbox> -->
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="dialog = false" class="text-none">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="save" class="text-none">Create New Form</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
import type { InspectionForm } from '@/types/maintenance/inspectionForm';

import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

interface copyForm {
  name: string,
  workflows: boolean,
  // schedules: boolean
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<InspectionForm>,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const inspectionFormCopy = ref<HTMLFormElement | null>(null)
const defaultForm = { id: 0, name: '', workflows: true, shedules: true };
const localForm = ref<copyForm>(JSON.parse(JSON.stringify(defaultForm)))


const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
})

const save = async () => {
  const formStatus = await inspectionFormCopy.value?.validate()
  if (!formStatus.valid) {
    return
  }
  emit('save', localForm.value)
  dialog.value = false
}

watch(() => dialog.value, (val) => {
  if (val) {
    localForm.value.name = props.form.name + ' copy'
    localForm.value.workflows = true
    // localForm.value.schedules = true
  } else {
    reset()
  }
})

const reset = () => {
  localForm.value = JSON.parse(JSON.stringify(defaultForm))
}
</script>