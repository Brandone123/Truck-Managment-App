<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Detailed Progress Report</span>
    </div>
    <v-card>
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Module</th>
              <th class="text-left">Completion Status</th>
              <th class="text-left">Score</th>
              <th class="text-left">Time Spent (hrs)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(module, index) in reportData.modules" :key="index">
              <td>{{ module.name }}</td>
              <td>{{ module.status }}</td>
              <td>{{ module.score ? `${module.score}%` : 'N/A' }}</td>
              <td>{{ module.timeSpent }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ModuleReport {
  id: number;
  name: string;
  status: string;
  score: number | null;
  timeSpent: number;
}

interface ProgressReport {
  employeeName: string;
  totalModules: number;
  modulesCompleted: number;
  modules: ModuleReport[];
}

// Sample progress report data
const reportData = ref<ProgressReport>({
  employeeName: 'John Doe',
  totalModules: 5,
  modulesCompleted: 3,
  modules: [
    { id: 1, name: 'Safety Training Introduction', status: 'Completed', score: 95, timeSpent: 1.5 },
    { id: 2, name: 'Equipment Operation', status: 'In Progress', score: null, timeSpent: 1 },
    // More module reports...
  ],
});
</script>