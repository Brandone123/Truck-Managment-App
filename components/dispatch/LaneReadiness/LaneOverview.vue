<script setup lang="ts">
// Import necessary Vuetify components and any other dependencies
import { ref } from 'vue';
import { VCard, VCardTitle, VCardText, VRow, VCol, VTextField, VSelect, VSwitch } from 'vuetify/components';

// Define the reactive data for the component
const laneName = ref('');
const routeDetails = ref('');
const operationalDays = ref([]);

// Options for the operational days
const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
</script>

<template>
  <v-card>
    <v-card-title>Lane Overview</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Lane Name/ID" v-model="laneName" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Route Details" v-model="routeDetails" />
        </v-col>
        <v-col cols="12" md="12">
          <v-select
            label="Operational Days"
            v-model="operationalDays"
            :items="daysOptions"
            multiple
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
