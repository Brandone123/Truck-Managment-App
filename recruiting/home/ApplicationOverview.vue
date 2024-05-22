<template>
  
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary"> Statistique of Application</span>
    </div>
    <v-row >
        <v-col
        v-for="(metric, index) in applications"
        :key="index"
        cols="12" sm="6" md="4" 
      >
        <v-card class="pa-2 text-center" elevation="2">
          <v-card-title class="justify-space-between mb-2">
            <v-icon class="mr-2" color="primary">{{ metric.icon }}</v-icon>
            <span>{{ metric.name }}</span>
            
          </v-card-title>
          <v-card-text class="text-center">
            <div style="font-size: 20px;font-weight: bold;" class="mb-2">{{ metric.value }}</div>
            
          </v-card-text>
        </v-card>
      </v-col>
   
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface MarketingMetric {
  name: string;
  value: string | number;
  icon: string;
}

const applicationListStore = useApplicationStore()
const {applicationList} = storeToRefs(applicationListStore)

const leadListStore = useLeadGenerationStore()
const { leadGenerationList } = storeToRefs(leadListStore)

const customerSatisfactionStores = useCustomerSatisfactionStore();
const { feedbackList } = customerSatisfactionStores;

const filterFeedback = computed(() => {
  return feedbackList.filter((feedback) => feedback.feedback_type === 'Suggestion').length
})

const applications = ref<MarketingMetric[]>([
  {
    name: 'Total Applications',
    value: applicationList.value.length,
    icon: 'mdi-chart-bubble',
  },
  {
    name: 'Under Review',
    value: applicationList.value.map((application) => application.application_status === "Under Review").length,
    icon: 'mdi-account-cash',
  },
  {
    name: 'New This Week',
    value: '2',
    icon: 'mdi-thumb-up',
  },
  // Add more metrics as necessary
]);

</script>

<style scoped>
/* Style adjustments as needed */
</style>
