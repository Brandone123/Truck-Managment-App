<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="500px">
      <v-card class="grey-background">
        <v-toolbar color="primary" title="Confirm Current Action" density="compact">
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>Are you sure you want to delete this item ?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeDialog">No</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="confirmDeletion">Yes</v-btn>
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
  
  const confirmDeletion = () => {
    emit('confirm');
    emit('update:modelValue', false);
  };
  </script>
  
  <style scoped>
  </style>
  