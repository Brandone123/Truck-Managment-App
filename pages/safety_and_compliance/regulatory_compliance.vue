<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Regulatory Compliance
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openRegulationDialog">Add Regulation</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search regulations..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="regulations"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editRegulation(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteRegulation(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Regulation Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentRegulation.name" label="Regulation Name"></v-text-field>
                  <v-text-field v-model="currentRegulation.description" label="Description"></v-text-field>
                  <v-select
                    v-model="currentRegulation.applicability"
                    :items="applicabilities"
                    label="Applicability"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveRegulation">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const regulations = ref([
    // Sample data - replace with data from your backend
    {
      id: 1,
      name: 'FMCSA Hours of Service',
      description: 'Regulations regarding the number of hours a driver can operate.',
      applicability: 'FMCSA',
    },
    // Add more regulations
  ]);
  
  const headers = ref([
    { text: 'Regulation Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: 'Applicability', value: 'applicability' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const currentRegulation = ref({});
  const applicabilities = ref([
    { value: 'FMCSA', name: 'Federal Motor Carrier Safety Administration' },
    { value: 'DOT', name: 'Department of Transportation' },
    // Add more as needed
  ]);
  
  const openRegulationDialog = () => {
    dialog.value = true;
    dialogTitle.value = 'Add New Regulation';
    currentRegulation.value = {}; // Reset for new entry
  };
  
  const editRegulation = (item) => {
    currentRegulation.value = { ...item };
    dialogTitle.value = 'Edit Regulation';
    dialog.value = true;
  };
  
  const deleteRegulation = (item) => {
    console.log('Deleting regulation', item);
    // Implement deletion logic
  };
  
  const saveRegulation = () => {
    console.log('Saving regulation', currentRegulation.value);
    // Implement save logic
    closeDialog();
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  </script>
  
  <style scoped>
  /* Add any additional styling here */
  </style>
  