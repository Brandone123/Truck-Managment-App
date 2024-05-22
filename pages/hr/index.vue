<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Dashboard</span>
    </div>
    <v-row>
      <!-- Employee Overview Card -->
      <v-col cols="12" md="12">
        <EmployeeOverviewCard />
      </v-col>

      <!-- Payroll Summary Card -->
      <v-col cols="12" md="6">
        <PayrollSummaryCard />
      </v-col>

      <!-- Training & Development Card -->
      <v-col cols="12" md="6">
        <TrainingDevelopmentCard />
      </v-col>

      <!-- HR Notifications Center -->
      <v-col cols="12" md="6">
        <HRNotificationsCenter />
      </v-col>

      <!-- HR Tasks & Reminders -->
      <v-col cols="12" md="6">
        <HRTasksReminders />
      </v-col>

      <!-- Leave Requests Card -->
      <v-col cols="12" md="12">
        <LeaveRequestsCard />
      </v-col>

      <!-- Performance Reviews Card -->
      <v-col cols="12" md="12">
        <PerformanceReviewsCard />
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
// Import Vue and Vuetify components
import { defineComponent } from 'vue';

// Import custom HR components
import EmployeeOverviewCard from '@/components/hr/home/EmployeeOverviewCard.vue';
import PayrollSummaryCard from '@/components/hr/home/PayrollSummaryCard.vue';
import TrainingDevelopmentCard from '@/components/hr/home/TrainingDevelopmentCard.vue';
import LeaveRequestsCard from '@/components/hr/home/LeaveRequestsCard.vue';
import PerformanceReviewsCard from '@/components/hr/home/PerformanceReviewsCard.vue';
import HRNotificationsCenter from '@/components/hr/home/HRNotificationsCenter.vue';
import HRTasksReminders from '@/components/hr/home/HRTasksReminders.vue';
</script>