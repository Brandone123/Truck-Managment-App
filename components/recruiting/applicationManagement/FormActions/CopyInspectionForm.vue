<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Copy Application Form</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="applicationFormCopy">
          <v-row>
            <v-col cols="12">
              <v-text-field density="comfortable" variant="outlined" :rules=[validation.required]
                label="New Form Title*" v-model="localForm.name"></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
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
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';

import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

interface copyForm {
  name: string,
  job_id: number,
  // schedules: boolean
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<ApplicationForm>,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const applicationFormCopy = ref<HTMLFormElement | null>(null)
const defaultForm = { id: 0, name: '', job: 0};
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
  const formStatus = await applicationFormCopy.value?.validate()
  if (!formStatus.valid) {
    return
  }
  emit('save', localForm.value)
  dialog.value = false
}

watch(() => dialog.value, (val) => {
  if (val) {
    localForm.value.name = props.form.name + ' copy'
  } else {
    reset()
  }
})

const reset = () => {
  localForm.value = JSON.parse(JSON.stringify(defaultForm))
}
</script>