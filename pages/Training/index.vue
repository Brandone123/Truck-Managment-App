<template>
  <div>
    <v-col cols="12">
      <!-- Quick Access Menu and Search -->
      <QuickAccessMenu />
    </v-col>

    <v-row>
      <v-spacer></v-spacer>
      <v-col lg="4" md="6" sm="12" cols="12">
        <v-text-field variant="solo" density="compact" v-model="searchQuery" prepend-inner-icon="mdi-magnify"
          placeholder="Search..." hide-details></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Progress Bars and Cards -->
        <TrainingProgress />
      </v-col>

      <!-- Recent Activity Feed -->
      <!-- <v-col cols="12" md="4">  

    </v-col> -->

      <v-col cols="12" md="8">
        <SummaryCharts />

        <RecentActivityFeed class="mt-2"/>
      </v-col>

      <!-- Alerts and Notifications -->
      <v-col cols="12" md="4">
        <AlertsNotifications />

        <UpcomingAssignments class="mt-2" />
      </v-col>

      <!-- Upcoming Assignments and Deadlines -->
      <v-col cols="12" md="4">
     
      </v-col>

      <!-- Recent Feedback and Summary Charts -->
      <!-- <v-col cols="12">
      <RecentFeedbackOverview />
      </v-col> -->

    </v-row>
  </div>



</template>

<script setup lang="ts">
import QuickAccessMenu from '@/components/training/QuickAccessMenu.vue';
import TrainingProgress from '@/components/training/TrainingProgress.vue';
import RecentActivityFeed from '@/components/training/RecentActivityFeed.vue';
import UpcomingAssignments from '@/components/training/UpcomingAssignments.vue';
import AlertsNotifications from '@/components/training/AlertsNotifications.vue';
import RecentFeedbackOverview from '@/components/training/RecentFeedbackOverview.vue';
import SummaryCharts from '@/components/training/SummaryCharts.vue';
import { ref } from 'vue';

const searchQuery = ref('');
</script>