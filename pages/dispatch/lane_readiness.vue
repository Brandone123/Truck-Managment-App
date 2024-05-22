<script setup lang="ts">
// Import the components
import LaneOverview from '@/components/dispatch/LaneReadiness/LaneOverview.vue';
import AssetAssignment from '@/components/dispatch/LaneReadiness/AssetAssignment.vue';
import PersonnelAssignment from '@/components/dispatch/LaneReadiness/PersonnelAssignment.vue';
import RepoweringInstructions from '@/components/dispatch/LaneReadiness/RepoweringInstructions.vue';
import ScheduleComponent from '@/components/dispatch/LaneReadiness/ScheduleComponent.vue';
import FinancialSection from '@/components/dispatch/LaneReadiness/FinancialSection.vue';
import PerformanceMetrics from '@/components/dispatch/LaneReadiness/PerformanceMetrics.vue';
import ComplianceAndSafety from '@/components/dispatch/LaneReadiness/ComplianceAndSafety.vue';
import Documentation from '@/components/dispatch/LaneReadiness/Documentation.vue';
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="12">
          <LaneOverview />
        </v-col>
        <v-col cols="12" md="12">
          <AssetAssignment />
        </v-col>
        <v-col cols="12" md="6">
          <PersonnelAssignment />
        </v-col>
        <v-col cols="12" md="6">
          <RepoweringInstructions />
        </v-col>
        <v-col cols="12">
          <ScheduleComponent />
        </v-col>
        <v-col cols="12">
          <FinancialSection />
        </v-col>
        <v-col cols="12">
          <PerformanceMetrics />
        </v-col>
        <v-col cols="12">
          <ComplianceAndSafety />
        </v-col>
        <v-col cols="12">
          <Documentation />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
