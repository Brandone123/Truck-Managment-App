<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px">
      <v-card>
        <v-card-title class="headline">Delete Recall</v-card-title>
        <v-card-text>Are you sure you want to delete this recall?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmDelete">Confirm</v-btn>
          <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(['update:modelValue', 'confirm']);
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const confirmDelete = () => {
    emit('confirm');
    closeDialog();
  };
  </script>
  