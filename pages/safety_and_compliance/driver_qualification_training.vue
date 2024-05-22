<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Driver Qualifications & Training
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openQualificationDialog">Add Qualification</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search drivers..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="drivers"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editQualification(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteQualification(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Qualification Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentQualification.driverName" label="Driver Name"></v-text-field>
                  <v-text-field v-model="currentQualification.cdlType" label="CDL Type"></v-text-field>
                  <v-text-field v-model="currentQualification.endorsements" label="Endorsements"></v-text-field>
                  <v-combobox
                    v-model="currentQualification.medicalCertificationStatus"
                    :items="['Valid', 'Expired', 'Pending']"
                    label="Medical Certification Status"
                  ></v-combobox>
                  <v-combobox
                    v-model="currentQualification.trainingStatus"
                    :items="['Completed', 'Scheduled', 'Required']"
                    label="Training Status"
                  ></v-combobox>
                  <!-- Additional fields as necessary -->
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveQualification">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const drivers = ref([
    // Sample data - replace with data fetched from your backend
    {
      id: 1,
      driverName: 'John Doe',
      cdlType: 'Class A',
      endorsements: 'Hazardous Materials, Tanker',
      medicalCertificationStatus: 'Valid',
      trainingStatus: 'Completed',
    },
    // Additional driver records as needed
  ]);
  
  const headers = ref([
    { text: 'Driver Name', value: 'driverName' },
    { text: 'CDL Type', value: 'cdlType' },
    { text: 'Endorsements', value: 'endorsements' },
    { text: 'Med. Cert. Status', value: 'medicalCertificationStatus' },
    { text: 'Training Status', value: 'trainingStatus' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const currentQualification = ref({});
  
  const openQualificationDialog = () => {
    dialog.value = true;
    dialogTitle.value = 'Add New Qualification';
    currentQualification.value = {}; // Reset for new entry
  };
  
  const editQualification = (item) => {
    currentQualification.value = { ...item };
    dialogTitle.value = 'Edit Qualification';
    dialog.value = true;
  };
  
  const deleteQualification = (item) => {
    console.log('Deleting qualification', item);
    // Implement deletion logic here
  };
  
  const saveQualification = () => {
   
    console.log('Saving qualification', currentQualification.value);
  // Implement save logic here
  // This typically involves checking if we're adding a new record or updating an existing one,
  // then making an API call to the server to save the data
  // After saving, refresh the driver qualifications list to reflect the latest data
  closeDialog();
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Add any page-specific styles here */
</style>
