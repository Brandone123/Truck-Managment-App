<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" dark v-bind="props" density="comfortable">
          {{ isNewProgram ? 'Add New Program' : 'Edit Program' }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ isNewProgram ? 'New Program' : 'Edit Program' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="programDetails.title" label="Program Title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="programDetails.description" label="Program Description" required></v-textarea>
              </v-col>
              <!-- Additional fields here -->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"  @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1"  @click="saveProgram">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const dialog = ref(false);
  
  // Determine if it's a new program or editing an existing one
  const isNewProgram = ref(true); // This should be determined by passed props or external conditions
  
  interface ProgramDetails {
    title: string;
    description: string;
    // Include other program details here
  }
  
  // You might want to fetch this from a store or have it passed in as a prop
  const programDetails = ref<ProgramDetails>({
    title: '',
    description: '',
    // Initialize other details here
  });
  
  function closeDialog() {
    dialog.value = false;
  }
  
  function saveProgram() {
    // Implement program save functionality
    console.log('Save program details', programDetails.value);
    closeDialog();
  }
  </script>
  