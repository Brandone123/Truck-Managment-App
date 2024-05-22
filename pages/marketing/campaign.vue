<template>
   <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Marketing Campaign</span>
      <div>
          <MarketingCampaignDialog :show="campaignDialog" @update:show="updateCampaignDialog"
                    :updating="updatingCampaign" :item="editedCampaign" />
      </div>
    </div>
    <SharedUiCustomTable return-object show-select :loading="loadingCampaign" :headers="campaignHeaders" :items="campaignList">
      <template v-slot:item.actions="{ item }">
          <div class="d-flex align-items-center pt-3 pb-2">
              <div class="mr-2">
                  <v-icon color="primary" dense @click="editCampaign(item)">mdi-pencil</v-icon>
              </div>
              <div class="mr-2">
                  <v-icon color="red" dense @click="deleteCampaign(item.id)">mdi-delete</v-icon>
              </div>
          </div>
      </template>
      <template v-slot:item.publish="{ item }">
        <div class="flex-grow-1 pt-3 pb-2">
          <v-select label="Select Ads" variant="outlined" flat density="compact" :items="['Facebook', 'Twitter']" class="select-ads"></v-select>
          <v-btn dense color="#89EB84" class="publish-btn">Publish</v-btn>
        </div>
      </template>
    </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type {MarketingCampaignInfo} from '@/types/marketing/campaign'
import {useMarketingCampaignStore} from '@/stores/marketing/campaign'

const campaignDialog = ref(false)
const updatingCampaign = ref(false)

const layoutStore = useLayoutStore()

const marketingCampaignListStore = useMarketingCampaignStore()
const {campaignList, loading: loadingCampaign } = storeToRefs(marketingCampaignListStore)

onMounted(() => {
  marketingCampaignListStore.fetchCampaignList();
})

const campaignHeaders = ref([
    { title: 'CAMPAIGN ID', key: 'id' ,class:"no-wrap" },
    { title: 'CAMPAIGN NAME ', key: 'campaign_name' ,class:"no-wrap" },
    { title: 'OBJECTIVE', key: 'objective',class:"no-wrap"},
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"},
    { title: 'START DATE', key: 'start_date',class:"no-wrap"  },
    { title: 'END DATE', key: 'end_date',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions' },
    { title: '', key: 'publish' },
])


const defaultCampaign: Ref<MarketingCampaignInfo> = ref({
  id: null,
  campaign_name: null,
  start_date: null,
  end_date: null,
  objective: null,
  description: null,
});

const editedCampaign = ref(defaultCampaign.value)

const editCampaign = (campaign: MarketingCampaignInfo) => {
    editedCampaign.value = Object.assign({}, campaign)
    updatingCampaign.value = true
    campaignDialog.value = true
}

const deleteCampaign = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")
    if (confirm) {
      marketingCampaignListStore.deleteCampaign(id)
    }
}

const updateCampaignDialog = (value: boolean) => {
    campaignDialog.value = value
    editedCampaign.value = defaultCampaign.value as MarketingCampaignInfo
    updatingCampaign.value = false
}

</script>

<style scoped>

.select-ads {
    width: 150px; 
}

.publish-btn {
    padding: 2px 4px; 
    font-size: 11px; 
}
</style>