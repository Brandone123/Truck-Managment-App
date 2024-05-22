<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Vehicle Inspections & Maintenance
              <v-spacer></v-spacer>
              <v-btn color="success" @click="openInspectionDialog">Report Inspection</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search vehicles..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="inspections"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editInspection(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteInspection(item)">
                    mdi-delete
                  </v-icon>
                  <v-icon small color="blue" @click="scheduleMaintenance(item)">
                    mdi-wrench
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Inspection Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="currentInspection.vehicleId"
                    :items="vehicles"
                    item-text="name"
                    item-value="id"
                    label="Select Vehicle"
                  ></v-select>
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="currentInspection.date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="currentInspection.date"
                        label="Inspection Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="currentInspection.date" no-title @input="menu = false"></v-date-picker>
                  </v-menu>
                  <v-select
                    v-model="currentInspection.type"
                    :items="['Pre-trip', 'Post-trip', 'Random', 'Annual']"
                    label="Inspection Type"
                  ></v-select>
                  <v-textarea v-model="currentInspection.notes" label="Notes"></v-textarea>
                  <!-- Additional fields as needed -->
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveInspection">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const inspections = ref([
    // Sample data
    {
      id: 1,
      vehicleId: 'VH123',
      date: '2024-03-21',
      type: 'Pre-trip',
      notes: 'No issues found.',
    },
    // Additional inspection records
  ]);
  
  const headers = ref([
    { text: 'Vehicle ID', value: 'vehicleId' },
    { text: 'Date', value: 'date' },
    { text: 'Type', value: 'type' },
    { text: 'Notes', value: 'notes' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const vehicles = ref([
    // This should be populated with vehicle data from your backend
    { id: 'VH123', name: 'Truck 123' },
    { id:   'VH456', name: 'Truck 456' },
  // Add more vehicles as needed
]);

const search = ref('');
const dialog = ref(false);
const menu = ref(false);
const dialogTitle = ref('');
const currentInspection = ref({
  vehicleId: '',
  date: '',
  type: '',
  notes: '',
});

const openInspectionDialog = () => {
  dialog.value = true;
  dialogTitle.value = 'Report New Inspection';
  resetCurrentInspection();
};

const editInspection = (item) => {
  currentInspection.value = { ...item };
  dialogTitle.value = 'Edit Inspection';
  dialog.value = true;
};

const deleteInspection = (item) => {
  console.log('Deleting inspection', item);
  // Implement deletion logic here, such as calling an API to remove the inspection record
  // After deletion, refresh the inspections list to reflect changes
};

const scheduleMaintenance = (item) => {
  console.log('Scheduling maintenance for vehicle', item.vehicleId);
  // Navigate to or open a dialog for scheduling maintenance, pre-filling with inspection data if needed
};

const saveInspection = () => {
  console.log('Saving inspection', currentInspection.value);
  // Implement save logic here, such as calling an API to save the new or updated inspection record
  // After saving, refresh the inspections list to reflect the new or updated data
  closeDialog();
};

const resetCurrentInspection = () => {
  currentInspection.value = {
    vehicleId: '',
    date: '',
    type: '',
    notes: '',
  };
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Additional styling can be applied here */
</style>

  