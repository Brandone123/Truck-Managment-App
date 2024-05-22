<script setup lang="ts">
// Import necessary Vuetify components and any other dependencies
import { ref } from 'vue';
import { VCard, VCardTitle, VCardText, VRow, VCol, VTextField, VTextarea } from 'vuetify/components';

// Define the reactive data for the component
const repoweringInstructions = ref('');
const contactPoints = ref('');
const repoweringSchedule = ref('');
</script>

<template>
  <v-card>
    <v-card-title>Repowering Instructions</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Instructions"
            v-model="repoweringInstructions"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Contact Points"
            v-model="contactPoints"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Schedule"
            v-model="repoweringSchedule"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
