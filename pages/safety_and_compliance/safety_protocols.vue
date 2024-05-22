<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Safety Protocols
              <v-spacer></v-spacer>
              <v-btn color="success" @click="openProtocolDialog">Add Protocol</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search protocols..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="protocols"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editProtocol(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteProtocol(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Protocol Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentProtocol.name" label="Protocol Name"></v-text-field>
                  <v-textarea v-model="currentProtocol.description" label="Description"></v-textarea>
                  <v-select
                    v-model="currentProtocol.status"
                    :items="statuses"
                    label="Implementation Status"
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
            <v-btn color="blue darken-1" text @click="saveProtocol">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const protocols = ref([
    // Sample data - replace with data from your backend
    {
      id: 1,
      name: 'Emergency Evacuation',
      description: 'Protocol for emergency evacuation from facilities.',
      status: 'Implemented',
    },
    // Add more protocols as needed
  ]);
  
  const headers = ref([
    { text: 'Protocol Name', value: 'name' },
    { text: 'Description', value: 'description', align: 'start' },
    { text: 'Status', value: 'status' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const currentProtocol = ref({});
  const statuses = ref([
    { value: 'Implemented', name: 'Implemented' },
    { value: 'Pending', name: 'Pending' },
    // Add more statuses as needed
  ]);
  
  const openProtocolDialog = () => {
    dialog.value = true;
    dialogTitle.value = 'Add New Safety Protocol';
    currentProtocol.value = {}; // Reset for new entry
  };
  
  const editProtocol = (item) => {
    currentProtocol.value = { ...item };
    dialogTitle.value = 'Edit Safety Protocol';
    dialog.value = true;
  };
  
  const deleteProtocol = (item) => {
    console.log('Deleting protocol', item);
    // Implement deletion logic
  };
  
  const saveProtocol = () => {
    console.log('Saving protocol', currentProtocol.value);
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
  