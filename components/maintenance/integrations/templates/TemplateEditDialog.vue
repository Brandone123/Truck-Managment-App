<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ isEdit ? 'Edit DVIR Template' : 'Add DVIR Template' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field v-model="template.name" label="Template Name" required></v-text-field>
            <v-select v-model="template.type" :items="templateTypes" label="Template Type" required></v-select>
            <SectionBuilder :sections.sync="template.sections" />
            <v-select v-model="template.status" :items="statusOptions" label="Status" required></v-select>
            <v-textarea v-model="template.notes" label="Notes"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveTemplate">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import SectionBuilder from './SectionBuilder.vue';
  import type { DVIRTemplate, Section } from '@/types/maintenance/templatesTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    template: {
      type: Object as () => DVIRTemplate,
      required: true,
      default: () => ({
        id: null,
        name: '',
        type: '',
        sections: [] as Section[],
        status: '',
        notes: ''
      })
    },
    isEdit: Boolean
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const templateTypes = ['Pre-trip', 'Post-trip'];
  const statusOptions = ['Active', 'Inactive'];
  
  const template = ref<DVIRTemplate>({ ...props.template });
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveTemplate = () => {
    emit('save', template.value);
    closeDialog();
  };
  </script>
  
  <style scoped>
  </style>
  