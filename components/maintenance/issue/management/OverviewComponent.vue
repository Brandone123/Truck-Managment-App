<template>
    <v-row class="mt-5 mb-16">
      <v-col cols="12" md="4">
        <v-card class="text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-file-document-outline</v-icon>
              <span>Total Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ overviewData.totalIssues }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
  
      <v-col cols="12" md="4">
        <v-card class="text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-check-circle-outline</v-icon>
              <span>Open Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ overviewData.openIssues }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
  
      <v-col cols="12" md="4">
        <v-card class="text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-currency-usd-off</v-icon>
              <span>Resolved Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ overviewData.resolvedIssues }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts" setup>
  // import { useIssueStore } from '@/stores/maintenance/issueStore';
  const store = useIssueTypeStore();
  const { overviewData } = storeToRefs(store);
  </script>
  
  <style scoped>
  </style>
  