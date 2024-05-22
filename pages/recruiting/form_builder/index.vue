<template>
   <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">Application Form</span>
        
      </div>
    </div>
    <div>
      <v-row class="mt-10">
        <v-col cols="12" md="4">
          <v-card outlined>
            <v-card-title>Form Properties</v-card-title>
            <v-card-text>
              <v-text-field v-model="formTitle" label="Form Title"></v-text-field>
              <v-text-field v-model="formDescription" label="Form Description" multiline></v-text-field>
              <v-btn color="success" @click="generateFormLink">Generate Link</v-btn>
              <v-text-field v-model="generatedLink" label="Form Link" readonly></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="mb-4" outlined>
            <v-card-title>Form Builder</v-card-title>
            <v-card-text>
              <draggable v-model="formFields" group="formFields" @end="saveForm">
                <v-list>
                  <v-list-item v-for="(field, index) in formFields" :key="index">
                    <v-list-item-content>
                      <v-text-field :label="field.label" :type="field.type" :placeholder="field.placeholder"></v-text-field>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon @click="removeField(index)">mdi-delete</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </draggable>
              <v-btn color="primary" @click="addField">Add Field</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
       
      </v-row>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'FormBuilder',
    components: {
     
    },
    data() {
      return {
        formFields: [
          { label: 'Name', type: 'text', placeholder: 'Enter your name' },
          // Initial form fields can be added here
        ],
        formTitle: '',
        formDescription: '',
        generatedLink: '',
      };
    },
    methods: {
      addField() {
        this.formFields.push({ label: '', type: 'text', placeholder: '' });
      },
      removeField(index: number) {
        this.formFields.splice(index, 1);
      },
      saveForm() {
        // Placeholder for save form logic
        console.log('Form saved', this.formFields);
      },
      generateFormLink() {
        // Placeholder for generate form link logic
        this.generatedLink = 'https://example.com/form-link'; // Example link, replace with real generated link
      },
    },
  });
  </script>
  
  <style scoped>
  /* Add custom styles here */
  </style>
  