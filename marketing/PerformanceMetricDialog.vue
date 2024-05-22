<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMarketingCampaignStore } from '@/stores/marketing/campaign';
import { ref, computed, watch } from 'vue';
import type { PerformanceMetricInfo } from '@/types/marketing/performance_metric';

const emit = defineEmits(['update:show', 'addMetric', 'editMetric']);

const props = defineProps({
    item: {
        type: Object as () => PerformanceMetricInfo,
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

const metricForm = ref(null);

const marketingCampaignListStore = useMarketingCampaignStore();
const {campaignList} = storeToRefs(marketingCampaignListStore)

const metricListStore = usePerformanceMetricStore()
const {metricList} = storeToRefs(metricListStore)


const defaultPerformanceMetric = ref<PerformanceMetricInfo>({
    id: null,
    campaign_id: null,
    date: null,
    metric_type: null,
    metric_value: null,
})

const metricInfo = ref(defaultPerformanceMetric.value);

const title = computed(() => {
  return props.updating ? 'Performance Metric Info' : 'Create Performance Metric';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Performance Metric';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    metricListStore.updateMetric(metricInfo.value);
  } else {
    metricListStore.createMetric(metricInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (metricForm.value) {
    (metricForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    metricInfo.value = Object.assign({}, props.item as PerformanceMetricInfo)
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
          New Metric
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
          <v-form ref="metricForm">

            <v-row class="my-4">

                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="metricInfo.campaign_id" :items="campaignList" label="Campaign Name" item-value="id" item-title="campaign_name" 
                    variant="solo" flat density="compact" :rules="[rules.required]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="metricInfo.date" label="Date of recorded" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-select v-model="metricInfo.metric_type" :items="['Clicks', 'Conversions', 'Impressions']" label="Type of Metric" variant="solo" 
                    flat density="compact" :rules="[rules.required]"></v-select>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="number" v-model="metricInfo.metric_value" label="Metric value" variant="solo" flat density="compact" :rules="[rules.number]"></v-text-field>
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
