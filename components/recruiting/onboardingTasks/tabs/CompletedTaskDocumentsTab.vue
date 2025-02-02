<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3>Completed Documents</h3>
        <v-btn color="primary" @click="openAddDocumentDialog">Add Completed Document</v-btn>

        <!-- Completed Document Edit/Create Dialog -->
        <CompletedTaskDocumentEditDialog
          :modelValue="documentDialog"
          :document="selectedDocument"
          @update:modelValue="documentDialog = $event"
          @close="closeDocumentDialog"
          @save="saveDocument"
        />

        <!-- Completed Documents List -->
        <v-data-table
          :headers="documentHeaders"
          :items="completedDocuments"
          :loading="loadingCompletedDocuments"
          class="elevation-1 mt-3"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon small @click="viewDocument(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small @click="editDocument(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteDocument(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            <v-alert type="info" border="start" colored-border>
              No completed documents found.
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CompletedDocument } from '@/types/recruiting/onboardingOrientation';
import { OnboardingOrientationDocumentStore } from '~/stores/recruiting/onboardingOrientation/orientationDocumentStore';
import CompletedTaskDocumentEditDialog from '@/components/recruiting/onboardingTasks/CompletedTaskDocumentEditDialog.vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const props = defineProps({
  applicationId: {
    type: Number,
    required: true,
  },
});

const onboardingStore = OnboardingOrientationDocumentStore();
const { completedDocuments, loadingCompletedDocuments } = storeToRefs(onboardingStore);

// Fetch completed documents related to the application
const fetchCompletedDocuments = async () => {
  await onboardingStore.fetchCompletedDocuments(); // No arguments passed here
};

const documentHeaders = [
  { title: 'Document Name', key: 'document.name', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Completed At', key: 'completed_at', sortable: true },
  { title: 'Signed By', key: 'signed_by', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

const documentDialog = ref(false);
const selectedDocument = ref<CompletedDocument | null>(null);
const router = useRouter();

const openAddDocumentDialog = () => {
  selectedDocument.value = null;
  documentDialog.value = true;
};

const editDocument = (document: CompletedDocument) => {
  selectedDocument.value = document;
  documentDialog.value = true;
};

const viewDocument = (document: CompletedDocument) => {
  if (document.signed_file_path) {
    window.open(`/storage/${document.signed_file_path}`, '_blank');
  } else {
    alert('No signed file available for this document.');
  }
};

const closeDocumentDialog = () => {
  documentDialog.value = false;
};

const saveDocument = async (document: Partial<CompletedDocument>) => {
  documentDialog.value = false;
  if (document.id) {
    await onboardingStore.updateCompletedDocument(document.id, document);
  } else {
    await onboardingStore.createCompletedDocument({ ...document, application_id: props.applicationId });
  }
  fetchCompletedDocuments(); // Refresh list after save
};

const deleteDocument = async (document: CompletedDocument) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete document "${document.document_id}"?`);
  if (confirmDelete) {
    await onboardingStore.deleteCompletedDocument(document.id);
    fetchCompletedDocuments(); // Refresh list after delete
  }
};

onMounted(() => {
  fetchCompletedDocuments();
});
</script>

<style scoped>
/* Add your styles here */
</style>
