<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Perfomance Metrics</span>
      <div>
          <MarketingPerformanceMetricDialog :updating="updatingMetric" @update:show="updateMaterialDialog" 
          :show="performanceMetricDialog" :item="editedMetric" />
      </div>
    </div>

    <div class="mt-16">
        <v-card-text>
          <div class="d-flex align-center mb-5">
            <v-btn color="primary" variant="tonal" density="compact"
              @click="updateToCurrentMonth" class="mr-1">Current Year</v-btn>
            <v-icon color="primary" @click="previousYear">mdi-chevron-left</v-icon>
            <span class="text-primary text-h5 ml-5 mr-5">{{ currentYear }}</span>
            <v-icon color="primary" @click="nextYear">mdi-chevron-right</v-icon>
          </div>
          <v-row>
            <v-col cols="12" md="6">
                <v-autocomplete v-model="selectedCampaignId" :items="campaignList" item-title="campaign_name" item-value="id" label="Select Campaign" flat density="compact"
                  variant="solo">
                </v-autocomplete>
              <div>
                <v-card class="pa-4" elevation="2">
                <ApexChart
                  type="bar"
                  :options="chartOptions"
                  :series="chartSeries"
                  height="350"
                />
              </v-card>
              </div>
              
            </v-col>
            <v-col cols="12" md="6">
              <v-data-table :headers="metricheaders" :items="filteredMetrics" :loading="LoadingMetric" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <div>
                    <v-icon  dense color="green" @click="editMetric(item)">mdi-pencil</v-icon>
                    <v-icon  color="red" dense @click="deleteMetric(item.id)">mdi-delete</v-icon>
                  </div>
                </template>
                <template v-slot:item.campaign_id="{ item }">
                  {{ getCampaignName(item.campaign_id) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
    </div>
  </div>
  </template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import ApexChart from 'vue3-apexcharts';
import type { PerformanceMetricInfo } from '~/types/marketing/performance_metric';
  
interface ChannelData {
  name: string;
  data: number[];
}

const currentYear = ref(new Date().getFullYear());
const filteredMetrics = ref<PerformanceMetricInfo[]>([]);

const campaignListStore = useMarketingCampaignStore()
const {campaignList} = storeToRefs(campaignListStore)

const metricListStore = usePerformanceMetricStore()
const {metricList, loading: LoadingMetric} = storeToRefs(metricListStore)

const selectedCampaignId = ref(null);

const chartSeries = ref([] as ChannelData[]);
  
  const chartOptions = ref({
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Performance Metrics',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " interactions";
        },
      },
    },
  });

  const monthlyMetrics = ref([] as ChannelData[]);
  const impressionTypes = ['Impressions', 'Clicks', 'Conversions'];

function calculateMonthlyMetrics() {
  monthlyMetrics.value = [];

  impressionTypes.forEach((type, index) => {
    const monthMetrics = {
      name: type,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Initial values for 12 months
    };

    filteredMetrics.value.forEach(metric => {
      if (metric.date) {
        const dateParts = metric.date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        const metricYear = date.getFullYear();
        if (
          metricYear === currentYear.value &&
          metric.metric_value &&
          metric.metric_type === type
        ) {
          monthMetrics.data[month] += metric.metric_value;
        }
      }
    });
    monthlyMetrics.value.push(monthMetrics);
    chartSeries.value = monthlyMetrics.value;
  });
}

const emit = defineEmits(['editMetric', 'deleteMetric'])

const performanceMetricDialog = ref(false)
const updatingMetric = ref(false)

const defaultPerformanceMetric: Ref<PerformanceMetricInfo> = ref({
    id: null,
    campaign_id: null,
    date: null,
    metric_type: null,
    metric_value: null,
});

const editedMetric = ref(defaultPerformanceMetric.value)

const editMetric = (performanceMetric: PerformanceMetricInfo) => {
    editedMetric.value = Object.assign({}, performanceMetric)
    updatingMetric.value = true
    performanceMetricDialog.value = true
}

const updateMaterialDialog = (value: boolean) => {
    performanceMetricDialog.value = value
    editedMetric.value = defaultPerformanceMetric.value as PerformanceMetricInfo
    updatingMetric.value = false
}

const deleteMetric = (id: any) => {
  metricListStore.deleteMetric(id)
}

const getCampaignName = (campaignId: any) => {
  const campaign = campaignList.value.find((campaign) => campaign.id === campaignId);
  return campaign ? campaign.campaign_name : '';
};

const metricheaders = ref([
  { title: 'CAMPAIGN NAME', key: 'campaign_id', class: 'no-wrap' },
  { title: 'DATE', key: 'date', class: 'no-wrap' },
  { title: 'METRIC TYPE', key: 'metric_type', class: 'no-wrap' },
  { title: 'METRIC VALUE', key: 'metric_value', class: 'no-wrap' },
  { title: 'Actions', key: 'actions', sortable: false, class: 'no-wrap' },
]);

function updateToCurrentMonth() {
  currentYear.value = new Date().getFullYear();
  filterMetricsByYear();
  calculateMonthlyMetrics();
  selectedCampaignId.value = null
}
  
function filterMetricsByYear() {
  filteredMetrics.value = metricList.value.filter(metric => {
    if (metric.date && metric.campaign_id) {
      const dateParts = metric.date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; 
      const day = parseInt(dateParts[2]);
      const date = new Date(year, month, day);
      const metricYear = date.getFullYear();
      return metricYear === currentYear.value &&  (selectedCampaignId.value ? metric.campaign_id === selectedCampaignId.value : true)
    }
  });
}

function previousYear(): void {
  currentYear.value--;
  filterMetricsByYear();
  calculateMonthlyMetrics();
}

function nextYear(): void {
  currentYear.value++;
  filterMetricsByYear();
  calculateMonthlyMetrics();
}

watch(currentYear, filterMetricsByYear, { immediate: true });

watch(filteredMetrics, calculateMonthlyMetrics, { immediate: true });

watch(selectedCampaignId, () => {
  filterMetricsByYear();
  calculateMonthlyMetrics();
});

</script>