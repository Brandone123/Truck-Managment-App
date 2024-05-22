<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMarketingCampaignStore } from '@/stores/marketing/campaign';
import { ref, computed, watch } from 'vue';
import type { MarketingCampaignInfo } from '@/types/marketing/campaign';

const emit = defineEmits(['update:show', 'addCampaign', 'editCampaign']);

const props = defineProps({
    item: {
        type: Object as () => MarketingCampaignInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
});

const showCamapignButton = computed(() => {
  const currentPath = window.location.pathname;
  return currentPath === '/marketing/campaign';
});


const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const marketingCampaignForm = ref(null);

const marketingCampaignListStore = useMarketingCampaignStore();
const {campaignList} = storeToRefs(marketingCampaignListStore)


const defaultMeetingResolution = ref<MarketingCampaignInfo>({
  id: null,
  campaign_name: null,
  start_date: null,
  end_date: null,
  objective: null,
  description: null,
})

const marketingCampaignInfo = ref(defaultMeetingResolution.value);

const title = computed(() => {
  return props.updating ? 'Marketing Campaign Info' : 'Create Marketing Campaign';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Marketing Campaign';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    marketingCampaignListStore.updateCampaign(marketingCampaignInfo.value);
  } else {
    marketingCampaignListStore.createCampaign(marketingCampaignInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (marketingCampaignForm.value) {
    (marketingCampaignForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    marketingCampaignInfo.value = Object.assign({}, props.item as MarketingCampaignInfo)
  } else {
      resetForm()
  }
})

</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn v-if="showCamapignButton" density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          New Campaign
        </v-btn>
      </template>
    <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="marketingCampaignForm">

            <v-row class="my-4">

                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="marketingCampaignInfo.campaign_name" label="Campaign Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="marketingCampaignInfo.objective" label="Objectif of Campaign" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="marketingCampaignInfo.start_date" label="Start Date" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="marketingCampaignInfo.end_date" label="End Date" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="marketingCampaignInfo.description" variant="solo" flat density="compact" label="Description" rows="4" required></v-textarea>
                </v-col>
  
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
