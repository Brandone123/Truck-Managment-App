<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class='pa-0' style='overflow: hidden'>
        <FormBuilder v-model="elements" @update:validity="elementsValid = $event"
          height="calc(100vh - (48px + 52px))" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue';
import FormBuilder from '../FormBuilder/FormBuilder.vue';
import type { ApplicationFormVersion} from '@/types/recruiting/applicantApplication';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<ApplicationFormVersion>
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const localForm = ref<Partial<ApplicationFormVersion>>({});

const title = computed(() => ('Edit Application Items'));

const elements = computed({
  get() {
    return localForm.value.elements || []
  },
  set(val) {
    localForm.value.elements = val
  }
})

const elementsValid = ref<boolean>(false);

const saveForm = () => {
  if (!elements.value?.length) {
    return
  }

  let payload = {
    id: localForm.value.application_form_id,
    elements: elements.value
  }

  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
};

watch(()=>dialog.value , (newVal) => {
  if(newVal){
      localForm.value = JSON.parse(JSON.stringify(props.form))
  }

})

const closeDialog = () => {
  dialog.value = false
  emit('close');
};
</script>