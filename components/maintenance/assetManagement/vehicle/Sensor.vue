<template>
    <v-col cols="12" sm="3"> 
        <div>
            <v-card height="300">
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Snapshots</v-card-title>
                    </span>
                    <div class="text-primary ml-auto mr-2 mt-3" style="font-size: 24px; cursor:pointer;"><v-icon>mdi-plus</v-icon></div>
                </div>
                <v-divider></v-divider>
                <div class="pa-4" style="font-size:small; color:grey; text-align: center;">
                    <p>No Sensor Data Snapshots found</p>
                </div>
            </v-card>
        </div>
    </v-col>

    <v-col cols="12" sm="9">
        <v-card height="200" style="overflow-y:auto;">
            <div class="pa-4">
                <p style="font-size:small; color:grey; text-align: center;">
                    Select Sensor Data Snapshot To View
                </p>
            </div>
           
        </v-card>
    </v-col>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import 'apexcharts/dist/apexcharts.css';
  

  </script>