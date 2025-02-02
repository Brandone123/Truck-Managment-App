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
        <v-form ref="inspectionForm">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="localForm.name" density="comfortable" variant="outlined"
                :rules=[validation.required] label="Name*"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="localForm.description" density="comfortable" variant="outlined"
                label="Description"></v-textarea>
            </v-col>
            <v-col cols="12" v-if="!form.id">
              <v-autocomplete :items="forms" item-value="id" item-title="name" v-model="localForm.template_id"
                density="comfortable" variant="outlined" label="Copy From Template" clearable
                hint="Use a pre-loaded vehicle checklist as a starting point (Optional)"
                persistent-hint></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-checkbox density="comfortable" label="Prevent Use of Stored Photos"
                v-model="localForm.prevent_use_of_stored_photos" color="primary" persistent-hint
                hint="Users will only be able to attach photos by taking them with the device's built-in camera"></v-checkbox>
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
import type { InspectionForm } from '@/types/maintenance/inspectionForm';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const inspectionFormStore = useInspectionFormStore()
const {
  forms
} = storeToRefs(inspectionFormStore)

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

const inspectionForm = ref<HTMLFormElement | null>(null)
const localForm = ref<Partial<InspectionForm>>(JSON.parse(JSON.stringify({ ...props.form })))

const title = computed(() => props.form.id ? 'Edit Inspection Form' : 'Add Inspection Form')

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
})

const save = async () => {
  const formStatus = await inspectionForm.value?.validate()
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