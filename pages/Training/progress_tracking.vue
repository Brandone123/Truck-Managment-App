<template>
  <div>
    <!-- Page Title -->
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Training Progress and Reports</span>
    </div>

    <!-- Filters for Selecting Employees/Drivers or Training Programs -->
    <TrainingProgressFilters class="mt-4" />

    <!-- Analytics Dashboard -->
    <!-- Summarizes key metrics such as overall completion rates, average scores, etc. -->
    <TrainingAnalyticsDashboard class="mt-4"/>

    <!-- Completion Certificates Status -->
    <!-- Shows which employees/drivers have completed the training and received certificates -->
    <CompletionCertificatesStatus class="mt-4"/>

    <!-- Detailed Progress Reports -->
    <!-- Tables or lists showing individual or group progress, with filters to narrow down views -->
    <DetailedProgressReports class="mt-4" />

    <!-- Time Tracking -->
    <!-- If applicable, displays time spent on training for each program/module -->
    <TrainingTimeTracking class="mt-4"/>
  </div>
</template>

<script setup lang="ts">
import TrainingProgressFilters from '@/components/training/tracking/TrainingProgressFilter.vue';
import TrainingAnalyticsDashboard from '@/components/training/tracking/TrainingAnalyticsDashboard.vue';
import DetailedProgressReports from '@/components/training/tracking/DetailedProgressReport.vue';
import TrainingTimeTracking from '@/components/training/tracking/TrainingTimeTracking.vue';
import CompletionCertificatesStatus from '@/components/training/tracking/CompletionCertificatesStatus.vue';
</script>