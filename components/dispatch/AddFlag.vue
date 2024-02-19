<template>
    <!-- <v-btn @click="openAddFlagDialog">+ Add Flag</v-btn> -->
    <v-btn @click="openAddFlagDialog" color="primary" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add Flag
            </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar color="primary" title="Add Flag" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newFlag.name" label="Flag Name" />
              </v-col>
              <v-col cols="12">
                <v-select v-model = newFlag.status label="Flag Status"
                :items='[{text:"Ignore", value:"ignore"}, {text:"Warn",value:"warn"}, {text:"Stop",value:"stop"}]'
                item-title="text" item-value="value"> </v-select>
                <!-- <v-text-field v-model="newFlag.status" label="Flag Status" /> -->
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newFlag.warn_days_before" label="Warn Days Before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newFlag.warn_miles_before" label="Warn Miles Before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newFlag.stop_days_before" label="Stop Days before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newFlag.stop_miles_before" label="Stop Miles before" type="number" />
              </v-col>
              <!-- Add fields for warn_days_before, warn_miles_before, etc. -->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveFlag">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useFlagStore } from '@/stores/settings/dispatch/flag.ts';
  
  // Store instance
  const flagStore = useFlagStore();
  
  // State for the dialog and new flag
  const dialog = ref(false);
  const newFlag = ref({
    name: '',
    status: '',
    warn_days_before: '',
    warn_miles_before: '',
    stop_days_before: '',
    stop_miles_before: '',
  });
  
  // Methods for opening and closing the dialog
  const openAddFlagDialog = () => {
    dialog.value = true;
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  
  // Method to save a new flag
  const saveFlag = () => {
    // Create a new flag object
    const flagToAdd = {
      ...newFlag.value,
      id: Date.now(), 
    };
  
    // Use the store action to add the flag
    flagStore.addFlag(flagToAdd);
  
    // Reset the new flag state and close the dialog
    newFlag.value = {
      name: '',
      status: '',
      warn_days_before: '',
      warn_miles_before: '',
      stop_days_before: '',
      stop_miles_before: '',
    };
    closeDialog();
  };
  </script>
  