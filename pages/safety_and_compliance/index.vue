<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ComplianceStatusCard />
        </v-col>
        <v-col cols="12" md="6">
          <RecentIncidentsCard />
        </v-col>
        <v-col cols="12" md="6">
          <TrainingOverviewCard />
        </v-col>
        <v-col cols="12" md="4">
          <UpcomingDocumentExpiriesCard />
        </v-col>
        <v-col cols="12" md="4">
          <SafetyMeetingsScheduleCard />
        </v-col>
        <v-col cols="12" md="4">
          <RiskAssessmentAlertsCard />
        </v-col>
        <v-col cols="12">
          <VehicleInspectionStatusCard />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  // Import Vue and Vuetify components
  import { defineComponent } from 'vue';
  
  // Import custom components for the dashboard
  import ComplianceStatusCard from '@/components/safetyCompliance/home/ComplianceStatusCard.vue';
  import RecentIncidentsCard from '@/components/safetyCompliance/home/RecentIncidentsCard.vue';
  import TrainingOverviewCard from '@/components/safetyCompliance/home/TrainingOverview.vue';
  import UpcomingDocumentExpiriesCard from '@/components/safetyCompliance/home/UpcomingDocumentExpiriesCard.vue';
  import SafetyMeetingsScheduleCard from '@/components/safetyCompliance/home/SafetyMeetingsScheduleCard.vue';
  import RiskAssessmentAlertsCard from '@/components/safetyCompliance/home/RiskAssessmentAlertsCard.vue';
  import VehicleInspectionStatusCard from '@/components/safetyCompliance/home/VehicleInspectionStatusCard.vue';
  </script>
  