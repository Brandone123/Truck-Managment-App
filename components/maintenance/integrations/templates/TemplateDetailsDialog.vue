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
          <v-divider class="my-4"></v-divider>
          <v-btn color="primary" @click="togglePreview">Preview Template</v-btn>
          <v-card v-if="showPreview" outlined class="mt-4">
            <v-card-title>Template Preview</v-card-title>
            <v-card-text>
              <v-container>
                <v-row v-for="section in template.sections" :key="section.id">
                  <v-col cols="12">
                    <h3>{{ section.name }}</h3>
                    <v-col v-for="item in section.items" :key="item.id">
                      <component :is="getComponent(item.type)" :label="item.name"></component>
                    </v-col>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
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
  import type { DVIRTemplate, Section, Item } from '@/types/maintenance/templatesTypes';
  
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
  
  const showPreview = ref(false);
  
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
  
  const togglePreview = () => {
    showPreview.value = !showPreview.value;
  };
  
  const getComponent = (type: string) => {
    switch (type) {
      case 'Text':
        return 'v-text-field';
      case 'Number':
        return 'v-text-field';
      case 'Boolean':
        return 'v-checkbox';
      case 'File':
        return 'v-file-input';
      default:
        return 'v-text-field';
    }
  };
  </script>
  
  <style scoped>
  .my-4 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  </style>
  