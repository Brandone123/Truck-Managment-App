<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar color="primary" dense>
          <v-toolbar-title>Edit Flag</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editableFlag.name" label="Flag Name" />
              </v-col>
              <v-col cols="12">
                <v-select v-model="editableFlag.status" label="Flag Status" :items="statuses" item-text="text" item-value="value"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editableFlag.warn_days_before" label="Warn Days Before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editableFlag.warn_miles_before" label="Warn Miles Before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editableFlag.stop_days_before" label="Stop Days before" type="number"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editableFlag.stop_miles_before" label="Stop Miles before" type="number" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props for receiving flag data and controlling dialog visibility
  const props = defineProps({
    modelValue: Boolean,
    flag: Object
  });
  
  const dialog = ref(props.modelValue);
  const editableFlag = ref({ ...props.flag });
  
  const statuses = [
    { text: "Ignore", value: "ignore" },
    { text: "Warn", value: "warn" },
    { text: "Stop", value: "stop" }
  ];
  
  // Watch for changes in modelValue prop to open/close the dialog
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  //method to close
  const closeDialog = () => {
    dialog.value = false;
  };

  // Emit update to close the dialog and save changes
  const close = () => emit('update:modelValue', false);
  const save = () => {
    emit('save', editableFlag.value);
    close();
  };
  </script>
  