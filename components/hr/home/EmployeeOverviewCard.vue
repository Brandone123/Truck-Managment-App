<template>

  <v-row>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-avatar size="56" color="blue lighten-2">
                <v-icon dark>mdi-account-group</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div class="text-h5 font-weight-bold">{{ totalEmployees }}</div>
              <div class="text-caption">Total Employees</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-avatar size="56" color="green lighten-2">
                <v-icon dark>mdi-account-plus</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div class="text-h5 font-weight-bold">{{ newHires }}</div>
              <div class="text-caption">New Hires</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-avatar size="56" color="red lighten-2">
                <v-icon dark>mdi-account-off</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div class="text-h5 font-weight-bold">{{ departures }}</div>
              <div class="text-caption">Departures</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Example data - replace with actual data fetching mechanism
const totalEmployees = ref(250); // Example value, replace with actual data
const newHires = ref(10); // Example value, replace with actual data
const departures = ref(5); // Example value, replace with actual data

// Here, you would fetch the actual data from your backend API
// and update these refs accordingly.
</script>

<style scoped>
/* Add styles specific to this component here */
</style>