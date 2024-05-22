<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Incident Reporting & Investigation
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openIncidentDialog">Report Incident</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search incidents..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="incidents"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editIncident(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteIncident(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Incident Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="incident.date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="incident.date"
                        label="Incident Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="incident.date" no-title @input="menu = false"></v-date-picker>
                  </v-menu>
                  <v-text-field v-model="incident.location" label="Location"></v-text-field>
                  <v-textarea v-model="incident.description" label="Description"></v-textarea>
                  <v-select
                    v-model="incident.type"
                    :items="incidentTypes"
                    label="Incident Type"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                  <!-- Additional fields as needed -->
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveIncident">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const incidents = ref([
    // Sample data - replace with data from your backend
    {
      id: 1,
      date: '2024-03-15',
      location: 'Interstate 10',
      description: 'Rear-end collision during traffic congestion',
      type: 'Accident',
    },
    // Additional incidents
  ]);
  
  const headers = ref([
    { text: 'Date', value: 'date' },
    { text: 'Location', value: 'location' },
    { text: 'Description', value: 'description' },
    { text: 'Type', value: 'type' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const menu = ref(false);
  const incident = ref({
    date: '',
    location: '',
    description: '',
    type: '',
  });
  const incidentTypes = ref([
    { value: 'Accident', name: 'Accident' },
    { value: 'Near Miss', name: 'Near Miss' },
    // Add more types as needed
  ]);
  
  const openIncidentDialog = () => {
    dialog.value = true;
   
    dialogTitle.value = 'Report New Incident';
  resetIncident(); // Reset incident form for new entry
};

const editIncident = (item) => {
  incident.value = { ...item };
  dialogTitle.value = 'Edit Incident';
  dialog.value = true;
};

const deleteIncident = (item) => {
  console.log('Deleting incident', item);
  // Implement deletion logic here, such as calling an API to remove the incident
  // After deletion, refresh the incidents list to reflect changes
};

const saveIncident = () => {
  console.log('Saving incident', incident.value);
  // Implement save logic here, such as calling an API to save the new or updated incident
  // Ensure to handle both add and update operations as needed
  // After saving, refresh the incidents list to reflect the new or updated data
  closeDialog();
};

const resetIncident = () => {
  incident.value = {
    date: '',
    location: '',
    description: '',
    type: '',
  };
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* You can add page-specific styles here */
</style>
