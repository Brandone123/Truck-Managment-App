<script setup lang="ts">
import { ref } from 'vue';
import { VCard, VCardTitle, VCardText, VDataTable, VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VTextarea } from 'vuetify/components';

// Sample data for contract details, route maps, and instruction manuals
const contractDetails = ref([
  { key: 'Contract ID', value: '12345' },
  { key: 'Client', value: 'ABC Logistics' },
  { key: 'Start Date', value: '2024-06-01' },
  { key: 'End Date', value: '2025-06-01' },
  { key: 'Value', value: '$1,000,000' }
]);

const routeMaps = ref([
  { id: 1, name: 'Michigan to Ohio', url: 'https://example.com/map1' },
  { id: 2, name: 'Ohio to Pennsylvania', url: 'https://example.com/map2' }
]);

const instructionManuals = ref([
  { id: 1, name: 'Lane Operation Manual', url: 'https://example.com/manual1' },
  { id: 2, name: 'Safety Procedures', url: 'https://example.com/manual2' }
]);

// Define headers for the contract details table
const contractHeaders = [
  { title: 'Key', key: 'key' },
  { title: 'Value', key: 'value' }
];

// Define headers for route maps and instruction manuals
const documentHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Link', key: 'url' }
];
</script>

<template>
  <v-card>
    <v-card-title>Documentation</v-card-title>
    <v-card-text>
      <!-- Contract Details -->
      <v-card class="mb-4">
        <v-card-title>Contract Details</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="contractHeaders"
            :items="contractDetails"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
      </v-card>

      <!-- Route Maps -->
      <v-card class="mb-4">
        <v-card-title>Route Maps</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="documentHeaders"
            :items="routeMaps"
            class="elevation-1"
            item-value="url"
            :item-class="() => 'text-decoration-none'"
          >
            <template v-slot:item.url="{ item }">
              <a :href="item.url" target="_blank">{{ item.url }}</a>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Instruction Manuals -->
      <v-card>
        <v-card-title>Instruction Manuals</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="documentHeaders"
            :items="instructionManuals"
            class="elevation-1"
            item-value="url"
            :item-class="() => 'text-decoration-none'"
          >
            <template v-slot:item.url="{ item }">
              <a :href="item.url" target="_blank">{{ item.url }}</a>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
.text-decoration-none {
  text-decoration: none;
}
</style>
