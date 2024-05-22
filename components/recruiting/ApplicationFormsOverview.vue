<template>
    <v-card>
      <v-card-title>Application Forms</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="form in forms" :key="form.id">
            <v-list-item-content>
              <v-list-item-title>{{ form.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="editForm(form.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn  @click="createForm">Create New Form</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Form {
    id: number;
    name: string;
  }
  
  // Sample application forms data
  const forms = ref<Form[]>([
    { id: 1, name: 'Driver Application Form' },
    { id: 2, name: 'Office Position Application Form' },
    // Add more forms as needed
  ]);
  
  function editForm(formId: number) {
    // Logic to edit an application form
    console.log('Editing form:', formId);
  }
  
  function createForm() {
    // Logic to create a new application form
    console.log('Creating new form');
  }
  </script>
  