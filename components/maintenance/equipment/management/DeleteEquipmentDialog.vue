<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this equipment?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="confirm">Confirm</v-btn>
          <v-btn @click="closeDialog">Cancel</v-btn>
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
  
  const confirm = () => {
    emit('confirm');
    closeDialog();
  };
  </script>
  