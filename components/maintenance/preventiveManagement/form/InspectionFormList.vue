<template>
  <SharedUiCustomTable show-select :showFooterInHead="false" :headers="tableHeaders" :items="forms" :loading="loading">
    <template v-slot:item.web_form="{ item }">
      <v-btn desity="compact" color="primary" variant="text" class="text-none"
        @click="openWebform(item.id)">Open<v-icon>mdi-arrow-right-bold</v-icon></v-btn>
    </template>

    <template v-slot:item.status="{ item }">
      <span class="text-capitalize">{{ item.status }}</span>
    </template>

    <template v-slot:item.type="{ item }">
      <span class="text-capitalize">{{ item.type }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
      <!-- <v-icon class="ml-2" color="secondary" @click="$emit('publish', item)">mdi-publish</v-icon> -->
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { InspectionForm } from '@/types/maintenance/inspectionForm';

const props = defineProps({
  forms: {
    type: Array as PropType<InspectionForm[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = [
  { title: 'Form ID', key: 'id' },
  { title: 'Form Name', key: 'name' },
  { title: 'Form Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: '# Items', key: 'elements.length' },
  { title: '# Workflows', key: 'workflows.length' },
  { title: 'Web Form', key: 'web_form' },
  { title: 'Actions', key: 'actions', sortable: false },
];


const openWebform = (formId: number) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || "http://localhost:8000"
  window.open(`${apiUrl}/inspection/forms/${formId}`, '_blank');
}
</script>