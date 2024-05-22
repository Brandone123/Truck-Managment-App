<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Payroll Summary</span>
    </div>

    <v-card>
      <v-card-text>
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>Next Payroll Date</v-list-item-title>
            <v-list-item-subtitle>{{ nextPayrollDate }}</v-list-item-subtitle>
            <v-divider class="mt-4"></v-divider>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Total Payroll Amount</v-list-item-title>
            <v-list-item-subtitle>{{ formattedTotalAmount }}</v-list-item-subtitle>
            <v-divider class="mt-4"></v-divider>
          </v-list-item>
          <v-list-item @click="navigateToIssues" class="clickable">
            <v-list-item-title>Unresolved Issues</v-list-item-title>
            <v-list-item-subtitle>{{ unresolvedIssuesCount }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-icon color="red">mdi-alert-circle</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn  class="text-none" variant="tonal" density="comfortable" color="primary" @click="navigateToPayrollDetails">View
          Details</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Sample data, replace with actual data fetching logic
const nextPayrollDate = ref('April 30, 2024');
const totalAmount = ref(120000); // This should be dynamically fetched
const unresolvedIssuesCount = ref(3); // Dynamically fetch this count

// Formatter for currency display
const formattedTotalAmount = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(totalAmount.value);

const router = useRouter();

// Function to navigate to payroll details page
function navigateToPayrollDetails() {
  router.push({ name: 'payroll-details' });
}

// Function to navigate to the unresolved issues page
function navigateToIssues() {
  router.push({ name: 'payroll-issues' });
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
  color: var(--v-primary-base);
}
</style>