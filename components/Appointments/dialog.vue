<!-- Dialog.vue -->
<template>
    <v-dialog v-model="isVisible">
      <v-card>
        <v-card-title>Dialog Title</v-card-title>
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        isVisible: true,
      };
    },
    methods: {
      closeDialog() {
        this.isVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your dialog styles here */
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  