<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Training & Development Overview</span>
    </div>

    <v-card>
      <v-card-text>
        <v-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Program Name</th>
                <th class="text-left font-weight-bold">Start Date</th>
                <th class="text-left font-weight-bold">End Date</th>
                <th class="text-left font-weight-bold">Participants</th>
                <th class="text-center font-weight-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="program in trainingPrograms" :key="program.id">
                <td>{{ program.name }}</td>
                <td>{{ formatDate(program.startDate) }}</td>
                <td>{{ formatDate(program.endDate) }}</td>
                <td>{{ program.participants }}</td>
                <td class="text-center">
                  <v-chip :color="getChipColor(program.status)" density="comfortable">
                    {{ program.status }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" density="comfortable" class="text-none" color="primary" @click="navigateToTrainingPrograms">View All Programs</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Sample data, replace with actual API call
const trainingPrograms = ref([
  { id: 1, name: 'Defensive Driving', startDate: new Date(2024, 3, 15), endDate: new Date(2024, 3, 20), participants: 15, status: 'Upcoming' },
  { id: 2, name: 'Hazardous Material Handling', startDate: new Date(2024, 4, 5), endDate: new Date(2024, 4, 7), participants: 8, status: 'Ongoing' },
  // Add more programs as needed
]);

// Helper functions
const formatDate = (date : Date) => {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const getChipColor = (status : string) => {
  switch (status) {
    case 'Upcoming': return 'blue';
    case 'Ongoing': return 'green';
    case 'Completed': return 'grey';
    default: return 'grey';
  }
};

const router = useRouter();

// Navigation function
function navigateToTrainingPrograms() {
  router.push({ name: 'training-programs' });
}
</script>

<style scoped>
.text-left {
  text-align: left;
}
</style>