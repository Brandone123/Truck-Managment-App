<template>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Recent Movements
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item
                v-for="movement in recentMovements"
                :key="movement.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ movement.description }}</v-list-item-title>
                  <v-list-item-subtitle>{{ movement.time }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" md="12">
        <v-card >
          <v-card-title>Maintenance Schedule</v-card-title>
          <v-card-text>
            <v-calendar></v-calendar>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </template>
  
  <script setup lang="ts">
   import OccupancyGraph from '@/components/yardCheck/occupancyGraph.vue'
 

  </script>
  