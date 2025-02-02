<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="applicationForm">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="localForm.name" density="comfortable" variant="outlined"
                :rules=[validation.required] label="Name*"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="dialog = false" class="text-none">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="save" class="text-none">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

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

const applicationForm = ref<HTMLFormElement | null>(null)
const localForm = ref<Partial<ApplicationForm>>(JSON.parse(JSON.stringify({ ...props.form })))

const title = computed(() => props.form.id ? 'Edit Application Form' : 'Add Application Form')

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
})

const save = async () => {
  const formStatus = await applicationForm.value?.validate()
  if (!formStatus.valid) {
    return
  }
  emit('save', localForm.value)
  dialog.value = false
}

watch(() => dialog.value, (val) => {
  if (val) {
    localForm.value = JSON.parse(JSON.stringify({ ...props.form }))
  }
})
</script>