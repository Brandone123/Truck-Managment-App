<template>
  <v-container>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Department Overview</span>
    </div>
    <!-- Department Name and Details -->
    <v-row align="center" justify="space-between" class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-col>
              <div>
                <span class="text-caption text-grey">Department: </span><br>
                <span class="font-weight-bold text-body">{{ department.name }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div>
                <span class="text-caption text-grey">Location: </span><br>
                <span class="font-weight-bold text-body">{{ department.location }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div>
                <span class="text-caption text-grey">Role: </span><br>
                <span class="font-weight-bold text-body">{{ department.role }}</span>
              </div>
            </v-col>
          </v-card-text>
        </v-card>

      </v-col>
      <v-col cols="12" md="4">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Key Contacts</span>
        </div>
        <v-card>
          <v-list density="compact">
            <v-list-item v-for="(contact, index) in department.contacts" :key="index">
              <v-list-item-title>{{ contact.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ contact.email }}</v-list-item-subtitle>
              <v-divider class="mt-3" v-if="index < department.contacts.length - 1"></v-divider>
            </v-list-item>
          </v-list>
        </v-card>

      </v-col>


      <!-- Department Goals and Objectives -->

      <v-col cols="12" md="8">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Goals and Objectives</span>
        </div>
        <v-card >
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-for="(goal, index) in department.goals" :key="index">
                <v-list-item-content>
                  {{ goal }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>


      <!-- Organizational Chart -->

      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Organizational Chart</span>
        </div>
        <v-card >
          <v-card-text class="text-center">
            <!-- Assuming the chart is an image -->
            <!-- <v-img :src="department.orgChart" aspect-ratio="1.7"></v-img> -->
            <OrganizationalChart />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import OrganizationalChart from "@/components/employeeInformationAndOperation/DepartmentOverview/OrganizationalChart"

// Sample data - replace with dynamic data from your backend
const department = ref({
  name: 'Information Technology',
  location: 'Headquarters - Building C',
  role: 'Supports all technological needs and innovations',
  contacts: [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' }
  ],
  goals: [
    'Implement new internal communication tool by Q3',
    'Reduce system downtime by 20% before the end of the year'
  ],
  orgChart: '/organizational_chart.jpg' // Placeholder path
});
</script>