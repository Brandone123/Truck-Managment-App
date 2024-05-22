<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Dashboard</span>
    </div>

    <v-row>
    <v-col cols="12" md="12">
      <WelcomeOverview />
    </v-col>

    <v-col cols="12" md="12">
      <QuickAccessLinks />
    </v-col>
    
    <v-col cols="12">
      <QuickStats />
    </v-col>
    <v-col cols="12" md="6">
      <NotificationsAlerts />
      <RecentUpdates class="mt-2" />
    </v-col>
    <v-col cols="12" md="6">
      <UpcomingEvents />
    </v-col>
    <v-col cols="12">
      <MyScheduleDuties />
    </v-col>
  </v-row>
  </v-container>

</template>

<script setup lang="ts">
// Import components
import WelcomeOverview from '@/components/employeeInformationAndOperation/home/WelcomeOverview.vue';
import QuickAccessLinks from '@/components/employeeInformationAndOperation/home/QuickAccessLinks.vue';
import NotificationsAlerts from '@/components/employeeInformationAndOperation/home/NotificationAlert.vue';
import MyScheduleDuties from '@/components/employeeInformationAndOperation/home/MyScheduleDuties.vue';
import RecentUpdates from '@/components/employeeInformationAndOperation/home/RecentUpdates.vue';
import QuickStats from '@/components/employeeInformationAndOperation/home/QuickStats.vue';
import UpcomingEvents from '@/components/employeeInformationAndOperation/home/UpcomingEvents.vue';
</script>