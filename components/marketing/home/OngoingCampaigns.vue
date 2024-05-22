<template>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Recent Campaign</span>
    </div>
    <v-card >
      <v-data-table :headers="headers" :items="campaignList.slice(0,6)" return-object>
        <template v-slot:item.action="{ item }">

          <v-icon color="primary" dense @click="editCampaign(item)">mdi-pencil</v-icon>
          <v-icon color="error" dense @click="editCampaign(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </template>
  
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  
  
  const headers = ref([
    { title: 'Campaign Name', key: 'campaign_name',class:"no-wrap text-bold" },
    { title: 'Start Date', key: 'start_date',class:"no-wrap" },
    { title: 'End Date', key: 'end_date',class:"no-wrap" },
    { title: 'Objective', key: 'objective',class:"no-wrap" },
    // { title: 'Actions', key: 'action', sortable: false,class:"no-wrap" },
  ])


  const campaignListStore = useMarketingCampaignStore()
  const {campaignList} = storeToRefs(campaignListStore)

//   const filterCampaigns = computed(() => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   return campaignList.value.filter(campaign => {
//     if (campaign.start_date) {
//       const startDateParts = campaign.start_date.split('-');
//       const startYear = parseInt(startDateParts[0]);
//       const startMonth = parseInt(startDateParts[1]);

//       if (startYear > currentYear) {
//         return true;
//       } else if (startYear === currentYear && startMonth >= currentMonth) {
//         return true;
//       } else {
//         return false;
//       }
//     }

//     return false;
//   });
// });
    

  
  onMounted(() => {
    // Placeholder for fetching campaigns data
    // Replace this with your actual API call
    // filterCampaigns();
  });
  
  
  function editCampaign(campaign: any) {
    // Implementation for editing a campaign
    console.log(`Editing campaign: ${campaign.name}`);
  }
  
  function deleteCampaign(campaign: any) {
    // Implementation for deleting a campaign
    console.log(`Deleting campaign: ${campaign.name}`);
  }
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  