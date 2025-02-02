<!-- src/components/recruiting/JobTemplateList.vue -->

<template>
  <v-dialog v-model="dialog" max-width="500px" scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          Job Template Selection
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form  ref="jobTemplateSelectionForm" v-model="formValid">
        <v-row>
          <v-col cols="12">
            <JobTemplateAutocompleteInput v-model="selectedTemplate" returnObject color="primary" :rules="[validation.required]"/>
          </v-col>
        </v-row>
      </v-form>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="!formValid" @click="loadTemplate">Use</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import JobTemplateAutocompleteInput from './components/JobTemplateAutocompleteInput'
import {useValidation} from '@/composables/formValidation'

const validation = useValidation()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const selectedTemplate = ref<Record<string,any> | null>(null);

const formValid = ref<boolean>(false);
const jobTemplateSelectionForm = ref<HTMLFormElement|null>(null)

const emit = defineEmits(['update:modelValue', 'selection']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const loadTemplate = async () => {
  const formStatus = await jobTemplateSelectionForm.value?.validate()
  if(!formStatus?.valid){
    console.log('form is invalid')
    return
  }

  emit('selection', selectedTemplate.value)
}

const resetForm = () => {
  selectedTemplate.value = null;
}

watch(()=>props.modelValue,(newVal)=>{
  if(newVal){
    resetForm()
  }
})


</script>

<style scoped>
/* Add your styles here */
</style>