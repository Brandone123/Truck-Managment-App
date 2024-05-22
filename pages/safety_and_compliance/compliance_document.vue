<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Compliance Document Management
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openDocumentDialog">Upload Document</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search documents..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="documents"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editDocument(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteDocument(item)">
                    mdi-delete
                  </v-icon>
                </template>
                <template v-slot:item.expiry="{ item }">
                  <span :class="{'text-danger': isExpiringSoon(item.expiry)}">{{ item.expiry | formatDate }}</span>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Document Upload/Edit Dialog -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentDocument.name" label="Document Name"></v-text-field>
                  <v-text-field v-model="currentDocument.description" label="Description"></v-text-field>
                  <v-file-input v-model="currentDocument.file" label="Document file"></v-file-input>
                  <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="currentDocument.expiry" label="Expiry Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="currentDocument.expiry" no-title @input="menu = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveDocument">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const documents = ref([
    // Sample data
    {
      id: 1,
      name: 'Vehicle Registration',
      description: 'Registration document for Truck 123',
      file: '',
      expiry: '2024-12-31',
    },
    // Additional document records as needed
  ]);
  
  const headers = ref([
    { text: 'Document Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Expiry Date', value: 'expiry' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const menu = ref(false);
  const dialogTitle = ref('');
  const currentDocument = ref({});
  
  const openDocumentDialog = () => {
    dialog.value = true;
    dialogTitle.value = 'Upload New Document';
    currentDocument.value = {}; // Reset for new entry
  };
  
  const editDocument = (item) => {
    currentDocument.value = { ...item };
    dialogTitle.value = 'Edit Document';
    dialog.value = true;
  };
  
  const deleteDocument = (item) => {
    console.log('Deleting document', item);
    // Implement deletion logic here
  };
  
  const saveDocument = () => {
   
    console.log('Saving document', currentDocument.value);
  // Implement save logic here
  // This typically involves checking if you're adding a new document or updating an existing one,
  // and then making an API call to save the document information.
  // You might also need to handle file uploads if your application requires storing documents.
  // After saving, refresh the documents list to reflect the latest data.
  closeDialog();
};

const isExpiringSoon = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const dayDifference = (expiry - today) / (1000 * 60 * 60 * 24);
  return dayDifference <= 30; // Marks as expiring soon if within 30 days
};

const closeDialog = () => {
  dialog.value = false;
};

// Utility filter for formatting dates within the template
import { defineComponent } from 'vue';
defineComponent({
  filters: {
    formatDate(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      }
    },
  },
});
</script>

<style scoped>
.text-danger {
  color: #ff5252; /* Example color for expiring/expired documents */
}
</style>
