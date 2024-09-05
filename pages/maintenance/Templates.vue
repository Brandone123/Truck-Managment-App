<template>
  <div>
    <div class="d-flex justify-space-between mb-16">
      <span class="text-primary text-h5">DVIR Templates Management</span>
      <v-btn color="primary" @click="openAddTemplateDialog">Add DVIR Template</v-btn>
    </div>

    <v-row>
      <v-col cols="12">
        <TemplatesTable @view="viewTemplate" @edit="editTemplate" @delete="deleteTemplate" />
      </v-col>
    </v-row>

    <TemplateDetailsDialog :modelValue="detailsDialog" :template="selectedTemplate"
      @update:modelValue="detailsDialog = $event" />
    <TemplateEditDialog :modelValue="editDialog" :template="selectedTemplate" @update:modelValue="editDialog = $event"
      @save="saveTemplate" />
    <DeleteTemplateDialog :modelValue="deleteDialog" @confirm="confirmDeleteTemplate" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import TemplatesTable from '@/components/maintenance/integrations/templates/TemplatesTable.vue';
import TemplateDetailsDialog from '@/components/maintenance/integrations/templates/TemplateDetailsDialog.vue';
import TemplateEditDialog from '@/components/maintenance/integrations/templates/TemplateEditDialog.vue';
import DeleteTemplateDialog from '@/components/maintenance/integrations/templates/DeleteTemplateDialog.vue';
import { useTemplatesStore } from '@/stores/maintenance/templatesStore';
import type { Template } from '@/types/maintenance/templatesTypes';

const templatesStore = useTemplatesStore();
const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedTemplate = ref<Template | null>(null);

const openAddTemplateDialog = () => {
  selectedTemplate.value = null;
  editDialog.value = true;
};

const viewTemplate = (template: Template) => {
  selectedTemplate.value = template;
  detailsDialog.value = true;
};

const editTemplate = (template: Template) => {
  selectedTemplate.value = template;
  editDialog.value = true;
};

const deleteTemplate = (template: Template) => {
  selectedTemplate.value = template;
  deleteDialog.value = true;
};

const saveTemplate = (template: Template) => {
  if (template.id) {
    templatesStore.updateTemplate(template);
  } else {
    templatesStore.createTemplate(template);
  }
  editDialog.value = false;
};

const confirmDeleteTemplate = () => {
  if (selectedTemplate.value) {
    templatesStore.deleteTemplate(selectedTemplate.value.id);
  }
  deleteDialog.value = false;
};
</script>