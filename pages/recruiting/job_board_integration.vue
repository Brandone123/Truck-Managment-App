<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Job Board Integrations </span>
      
    </div>
  </div>
    <v-row class="mt-10">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-item v-for="board in jobBoards" :key="board.id" two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ board.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ board.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-switch v-model="board.active" :color="board.active ? 'primary' : ''"></v-switch>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn color="primary" @click="saveSettings">Save Settings</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  interface JobBoard {
    id: number;
    name: string;
    description: string;
    active: boolean;
  }
  
  export default defineComponent({
    name: 'JobBoardIntegration',
    data() {
      return {
        jobBoards: [
          { id: 1, name: 'Indeed', description: 'The #1 job site worldwide.', active: true },
          { id: 2, name: 'LinkedIn', description: 'Your career starts here.', active: false },
          // More job boards...
        ] as JobBoard[],
      };
    },
    methods: {
      saveSettings() {
        // Logic to save the integration settings
        console.log('Saving settings:', this.jobBoards);
        // Here you would typically make an API call to your backend to save the settings
      },
    },
  });
  </script>
  
  <style scoped>
  /* Style your component here */
  </style>
  