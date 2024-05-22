<script setup lang="ts">
import { ref, computed } from 'vue';
import { VCard, VCardTitle, VCardText, VRow, VCol, VDataTable, VDivider, VTextField } from 'vuetify/components';

// Sample data for projected and actual expenses
const projectedExpenses = ref([
  { type: 'Driver’s Pay', amount: 5000 },
  { type: 'Fuel Charges', amount: 1500 },
  { type: 'Toll Charges', amount: 300 },
  { type: 'Truck and Trailer Charges', amount: 2000 },
  { type: 'Other Charges', amount: 800 },
]);

const actualExpenses = ref([
  { type: 'Driver’s Pay', amount: 5200 },
  { type: 'Fuel Charges', amount: 1600 },
  { type: 'Toll Charges', amount: 350 },
  { type: 'Truck and Trailer Charges', amount: 2100 },
  { type: 'Other Charges', amount: 750 },
]);

// Computed properties for financial summary
const totalProjectedCosts = computed(() => projectedExpenses.value.reduce((sum, expense) => sum + expense.amount, 0));
const totalActualCosts = computed(() => actualExpenses.value.reduce((sum, expense) => sum + expense.amount, 0));
const variance = computed(() => totalActualCosts.value - totalProjectedCosts.value);

// Define headers for the tables
const headers = [
  { title: 'Expense Type', key: 'type' },
  { title: 'Amount ($)', key: 'amount' }
];
</script>

<template>
  <v-card>
    <v-card-title>Financial Section</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Projected Expenses -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Projected Expenses</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="projectedExpenses"
                class="elevation-1"
              ></v-data-table>
              <v-divider></v-divider>
              <v-text-field
                label="Total Projected Costs ($)"
                :value="totalProjectedCosts"
                readonly
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Actual Expenses -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Actual Expenses</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="actualExpenses"
                class="elevation-1"
              ></v-data-table>
              <v-divider></v-divider>
              <v-text-field
                label="Total Actual Costs ($)"
                :value="totalActualCosts"
                readonly
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Financial Summary -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Financial Summary</v-card-title>
            <v-card-text>
              <v-text-field
                label="Total Projected Costs ($)"
                :value="totalProjectedCosts"
                readonly
              ></v-text-field>
              <v-text-field
                label="Total Actual Costs ($)"
                :value="totalActualCosts"
                readonly
              ></v-text-field>
              <v-text-field
                label="Variance ($)"
                :value="variance"
                readonly
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
