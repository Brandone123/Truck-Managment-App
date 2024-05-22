<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6"> Performance Reviews Overview</span>
    </div>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="performanceReviews" density="compact">
          <template v-slot:item.actions="{ item }">
            <v-btn variant="tonal" density="comfortable" class="text-none" color="primary" @click="viewDetails(item)">
              View Details
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Sample data, replace with actual data fetching logic
const performanceReviews = ref([
  { id: 1, employeeName: 'John Doe', reviewDate: '2024-03-15', reviewer: 'Jane Smith', performanceRating: 'Excellent' },
  { id: 2, employeeName: 'Emily Johnson', reviewDate: '2024-03-20', reviewer: 'Mark Brown', performanceRating: 'Good' },
  // Add more reviews as needed
]);

const headers = [
  { title: 'Employee Name', align: 'start', value: 'employeeName' },
  { title: 'Review Date', value: 'reviewDate' },
  { title: 'Reviewer', value: 'reviewer' },
  { title: 'Performance Rating', value: 'performanceRating' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Method to view detailed performance review (to be implemented)
const viewDetails = (item) => {
  // Implement functionality to navigate to the detailed review page
  console.log(`Viewing details for ${item.employeeName}`);
};
</script>