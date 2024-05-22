<template>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">Lead Generation </span>
        <div>
            <MarketingLeadGenerationDialog :updating="updatingLead" @update:show="updateLeadDialog" 
            :show="leadGenerationDialog" :item="editedLead" />
        </div>
      </div>
      <v-row class="mt-5">
        <v-spacer></v-spacer>
        <v-col lg="4" md="6" sm="12" cols="12">
          <v-text-field variant="solo" density="compact" v-model="search" prepend-inner-icon="mdi-magnify"
            placeholder="Search..." hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-3">
        <v-col cols="12">
          <v-data-table :headers="leadheaders" :items="leadGenerationList" class="elevation-1"
            show-expand v-model:expanded="expandedRows">
            <template v-slot:item.actions="{ item }">
              <v-icon color="primary">mdi-account-plus</v-icon>
              <v-icon class="ml-4" dense color="green" @click="editLead(item)">mdi-pencil</v-icon>
              <v-icon class="ml-4" color="red" dense @click="deleteLead(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:item.campaign_id="{ item }">
              {{ getCampaignName(item.campaign_id) }}
            </template>
            <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
              <tr>
                <td :colspan="columns.length" style="height:100px;">
                  <v-card flat>
                      <v-card-text>
                        <div class=" ">
                          <div class=" mt-2 ">
                              <h3>{{ item.lead_source }}</h3>
                            <span>
                               Date of the lead generation: {{ item.date }}
                            </span>
                           
                            <v-divider class="my-4"></v-divider>
                            <div class="content" v-html="item.lead_details"></div>
                          </div>
                        </div>
                      </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import {useLeadGenerationStore} from '@/stores/marketing/lead_generation'
  import type {LeadGenerationInfo} from '@/types/marketing/lead_generation'

  const leadGenerationStores = useLeadGenerationStore()
  const {leadGenerationList} = storeToRefs(leadGenerationStores)

  const campaignStores = useMarketingCampaignStore()
  const {campaignList} = storeToRefs(campaignStores)

  function findNewArrayIndex(arr1: any[], arr2: any[]) {
    for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            return leadGenerationList.value.indexOf(arr1[i])
        }
    }
    return -1
}

const getCampaignName = (campaignId: any) => {
  const campaign = campaignList.value.find(campaign => campaign.id === campaignId);
  return campaign ? campaign.campaign_name : '';
};
  
const leadGenerationDialog = ref(false)
const updatingLead = ref(false)
const emit = defineEmits(['editLead', 'deleteLead'])

const defaultLead: Ref<LeadGenerationInfo> = ref({
    id: null,
    campaign_id: null,
    date: null,
    lead_source: null,
    lead_details: null,
});

const editedLead = ref(defaultLead.value)

const editLead = (lead_generation: LeadGenerationInfo) => {
    editedLead.value = Object.assign({}, lead_generation)
    updatingLead.value = true
    leadGenerationDialog.value = true
}

const updateLeadDialog = (value: boolean) => {
    leadGenerationDialog.value = value
    editedLead.value = defaultLead.value as LeadGenerationInfo
    updatingLead.value = false
}

const deleteLead = (id: any) => {
  leadGenerationStores.deleteLeadGeneration(id)
}
  
  const leadheaders = ref([
  { title: 'CAMPAIGN NAME', key: 'campaign_id',class:"no-wrap" },
    { title: 'LEAD NAME', key: 'lead_source',class:"no-wrap" },
    { title: 'DATE', key: 'date',class:"no-wrap" },
    { title: 'LEAD SOURCE', key: 'lead_source',class:"no-wrap" },
    { title: 'LEAD DETAILS', key: 'lead_details',class:"no-wrap" },
    { title: 'Actions', key: 'actions', sortable: false ,class:"no-wrap"},
  ])
  
  const search = ref('');

  const expandedRows = ref([])
  watch(expandedRows, (newVal, oldVal) => {
    if (newVal.length > oldVal.length) {
        let index = findNewArrayIndex(newVal, oldVal)
    }
  })
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  