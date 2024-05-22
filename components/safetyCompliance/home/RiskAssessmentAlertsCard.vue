<template>
    <v-card outlined color="warning" class="mb-3">
      <v-card-title class="white--text">
        <v-icon left>mdi-alert</v-icon>
        High-Risk Assessments
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item 
            v-for="assessment in highRiskAssessments" 
            :key="assessment.id"
            @click="goToAssessmentDetails(assessment.id)"
          >
            <v-list-item-icon>
              <v-icon color="white">mdi-alert-octagon</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">{{ assessment.assessmentType }}</v-list-item-title>
              <v-list-item-subtitle class="white--text">{{ assessment.riskLevel }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon class="white--text">mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="white" text @click="navigateToRiskAssessments">View All Risks</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const highRiskAssessments = ref([
    {
      id: 1,
      assessmentType: 'Cargo Load Security',
      riskLevel: 'High - Immediate Action Required',
    },
    {
      id: 2,
      assessmentType: 'Driver Fatigue Management',
      riskLevel: 'High - Immediate Action Required',
    },
    // Additional high-risk assessments
  ]);
  
  const router = useRouter();
  
  const goToAssessmentDetails = (id) => {
    // Navigate to the risk assessment detail page
    router.push({ name: 'risk-assessment-details', params: { id } });
  };
  
  const navigateToRiskAssessments = () => {
    // Navigate to the overview page of all risk assessments
    router.push({ name: 'risk-assessments' });
  };
  </script>
  
  <style scoped>
  /* Styling for high-risk alerts */
  .v-card {
    background-color: #FF5252 !important; /* Red color for high alert */
  }
  </style>
  