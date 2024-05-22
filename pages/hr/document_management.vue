<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Document Management</span>
      <v-btn color="primary" density="comfortable" @click="showUploadDialog">
        Upload Document
      </v-btn>
    </div>


    <SharedUiCustomTable :headers="headers" :items="documents">
      <template v-slot:item.actions="{ item }">
        <v-btn icon variant="tonal" density="compact" color="primary" @click="downloadDocument(item)">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn class="mx-3" icon variant="tonal" density="compact" color="secondary" @click="editDocument(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon variant="tonal" density="compact" color="red" @click="deleteDocument(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </SharedUiCustomTable>

    <!-- Upload Document Dialog -->
    <v-dialog v-model="uploadDialog" persistent max-width="600px">
      <v-card class="grey-background">
        <v-toolbar class="d-flex justify-space-between" color="primary" density="compact">
          <v-toolbar-title>Upload Document</v-toolbar-title>
          <v-btn icon density="comfortable" @click="closeUploadDialog"><v-icon>mdi-window-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-title>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-text-field variant="solo" density="compact" v-model="newDocument.name" label="Document Name" required></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-textarea variant="solo" density="compact" v-model="newDocument.description" label="Description"></v-textarea>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-file-input variant="solo" density="compact" v-model="newDocument.file" label="File input"
                  prepend-icon="mdi-paperclip"></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn density="comfortable" class="text-none" color="blue darken-1" title
            @click="closeUploadDialog">Cancel</v-btn>
          <v-btn density="comfortable" class="text-none" scolor="blue darken-1" title :disabled="!valid"
            @click="uploadDocument">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const search = ref('');
const uploadDialog = ref(false);
const valid = ref(false);
const documents = ref([
  // Sample data - replace with data fetched from your backend
  {
    id: 1,
    name: 'Employee Handbook',
    description: 'The company policies and procedures.',
    path: 'path/to/document.pdf',
  },
  // ... more documents
]);
const newDocument = reactive({
  name: '',
  description: '',
  file: null,
});

const headers = [
  { title: 'Document Name', value: 'name' },
  { title: 'Description', value: 'description' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const showUploadDialog = () => {
  uploadDialog.value = true;
};

const closeUploadDialog = () => {
  uploadDialog.value = false;
};

const uploadDocument = () => {
  // Validate and upload document
  console.log('Uploading document:', newDocument);
  closeUploadDialog();
};

const downloadDocument = (item) => {
  // Logic to download the document
  console.log('Downloading document:', item);
};

const editDocument = (item) => {
  // Logic to edit the document details
  console.log('Editing document:', item);
};

const deleteDocument = (item) => {
  // Logic to delete the document
  console.log('Deleting document:', item);
};
</script>