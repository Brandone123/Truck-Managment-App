<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Dashboard</span>
      <!-- <v-btn color="primary">Create Inspection Form</v-btn> -->
      <div class="d-flex justify-space-between margin-10">
        <ActiveWidgetSelector />
      </div>
    </div>



    <v-row>
      <v-col cols="12" md="6">
        <RepairPriorityClassTrends />
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="6">
            <ServiceReminders />
          </v-col>
          <v-col cols="12" md="6">
            <TimeToResolve />
          </v-col>
          <v-col cols="12" md="6">
            <OpenIssues />
          </v-col>
          <v-col cols="12" md="6">
            <VehicleRenewalReminders />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="3">
        <ActiveWorkOrders />
      </v-col>
      <v-col cols="12" md="3">
        <ContactRenewalReminders />
      </v-col>
      <v-col cols="12" md="3">
        <VehicleAssignments />
      </v-col>
      <v-col cols="12" md="3">
        <VehicleStatus />
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="6">
            <VehicleLocations />
          </v-col>
          <v-col cols="12" md="6">
            <CriticalFaults />
          </v-col>
          <v-col cols="12" md="6">
            <FuelCosts />
          </v-col>
          <v-col cols="12" md="6">
            <ServiceCosts />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <RecentComments />
      </v-col>
      <v-col cols="12" md="3">
        <OtherCosts />
      </v-col>
      <v-col cols="12" md="3">
        <TotalCosts />
      </v-col>
      <v-col cols="12" md="3">
        <CostPerMeter />
      </v-col>
      <v-col cols="12" md="3">
        <AllFaults />
      </v-col>


      <v-col cols="12" md="6">
        <LatestMeterReadings />
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="6">
            <OverdueInspections />
          </v-col>
          <v-col cols="12" md="6">
            <InspectionItemFailureRate />
          </v-col>
          <v-col cols="12" md="6">
            <InspectionSubmissions />
          </v-col>
          <v-col cols="12" md="6">
            <InspectionsSummary />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="3">
        <OnTimeServiceCompliance />
      </v-col>
    </v-row>

  </div>
</template>

<script setup lang="ts">
import RepairPriorityClassTrends from '~/components/maintenance/dashboard/widgets/RepairPriorityClassTrends.vue';
import ServiceReminders from '~/components/maintenance/dashboard/widgets/ServiceReminders.vue';
import TimeToResolve from '~/components/maintenance/dashboard/widgets/TimeToResolve.vue';
import OpenIssues from '~/components/maintenance/dashboard/widgets/OpenIssues.vue';
import VehicleRenewalReminders from '~/components/maintenance/dashboard/widgets/VehicleRenewalReminders.vue';
import ActiveWorkOrders from '~/components/maintenance/dashboard/widgets/ActiveWorkOrders.vue';
import ContactRenewalReminders from '~/components/maintenance/dashboard/widgets/ContactRenewalReminders.vue';
import VehicleAssignments from '~/components/maintenance/dashboard/widgets/VehicleAssignments.vue';
import VehicleStatus from '~/components/maintenance/dashboard/widgets/VehicleStatus.vue';
import VehicleLocations from '~/components/maintenance/dashboard/widgets/VehicleLocations.vue';
import CriticalFaults from '~/components/maintenance/dashboard/widgets/CriticalFaults.vue';
import RecentComments from '~/components/maintenance/dashboard/widgets/RecentComments.vue';
import FuelCosts from '~/components/maintenance/dashboard/widgets/FuelCosts.vue';
import ServiceCosts from '~/components/maintenance/dashboard/widgets/ServiceCosts.vue';
import OtherCosts from '~/components/maintenance/dashboard/widgets/OtherCosts.vue';
import TotalCosts from '~/components/maintenance/dashboard/widgets/TotalCosts.vue';
import CostPerMeter from '~/components/maintenance/dashboard/widgets/CostPerMeter.vue';
import AllFaults from '~/components/maintenance/dashboard/widgets/AllFaults.vue';
import LatestMeterReadings from '~/components/maintenance/dashboard/widgets/LatestMeterReadings.vue';
import OverdueInspections from '~/components/maintenance/dashboard/widgets/OverdueInspections.vue';
import InspectionItemFailureRate from '~/components/maintenance/dashboard/widgets/InspectionItemFailureRate.vue';
import InspectionSubmissions from '~/components/maintenance/dashboard/widgets/InspectionSubmissions.vue';
import InspectionsSummary from '~/components/maintenance/dashboard/widgets/InspectionsSummary.vue';
import OnTimeServiceCompliance from '~/components/maintenance/dashboard/widgets/OnTimeServiceCompliance.vue';

import ActiveWidgetSelector from '~/components/maintenance/dashboard/ActiveWidgetSelector.vue';
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>