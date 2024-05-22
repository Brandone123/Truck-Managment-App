<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMarketingCampaignStore } from '@/stores/marketing/campaign';
import { ref, computed, watch } from 'vue';
import type { LeadGenerationInfo } from '@/types/marketing/lead_generation';
import {useLeadGenerationStore} from '@/stores/marketing/lead_generation'

const emit = defineEmits(['update:show', 'addLead', 'editLead']);

const props = defineProps({
    item: {
        type: Object as () => LeadGenerationInfo,
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


const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const leadForm = ref(null);

const marketingCampaignListStore = useMarketingCampaignStore();
const {campaignList} = storeToRefs(marketingCampaignListStore)

const leadGenerationListStore = useLeadGenerationStore();


const defaultLead = ref<LeadGenerationInfo>({
    id: null,
    campaign_id: null,
    date: null,
    lead_source: null,
    lead_details: null,
})

const leadInfo = ref(defaultLead.value);

const title = computed(() => {
  return props.updating ? 'Lead Generation Info' : 'Create Lead Generation';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Lead Generation';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    leadGenerationListStore.updateLeadGeneration(leadInfo.value);
  } else {
    leadGenerationListStore.createLeadGeneration(leadInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (leadForm.value) {
    (leadForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    leadInfo.value = Object.assign({}, props.item as LeadGenerationInfo)
  } else {
      resetForm()
  }
})

</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          New Lead Generation
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
          <v-form ref="leadForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="leadInfo.campaign_id" :items="campaignList" label="Select Campaign" item-title="campaign_name" item-value="id" variant="solo" flat density="compact" :rules="[rules.required]"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="leadInfo.date" label="Date" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="leadInfo.lead_source" label="Lead Source" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="leadInfo.lead_details" variant="solo" flat density="compact" label="Lead Details" rows="4" required></v-textarea>
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
