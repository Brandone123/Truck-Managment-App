<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Industry Networking</span>
    </div>
    <div class="mt-16">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedCompetitor"
            :items="competitors"
            item-title="name"
            item-value="id"
            label="Select Competitor for Comparison"
            return-object
            variant="solo"
            flat
            density="compact"
            @change="fetchMetricData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              Performance Comparison
            </v-card-title>
            <v-card-text v-if="selectedCompetitor">
              <apexchart type="bar" :options="comparisonChartOptions" :series="getComparisonChartData(selectedCompetitor)"></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              SWOT Analysis
            </v-card-title>
            <v-card-text v-if="selectedCompetitor">
              <div class="swot-template">
                <div class="swot-content">
                <div class="swot-section">
                  <h3>Strengths</h3>
                  <ul>
                    <li v-for="(item, index) in getSWOTAnalysis(selectedCompetitor).strengths" :key="index">{{ item }}</li>
                  </ul>
                </div>
                <div class="swot-section">
                  <h3>Weaknesses</h3>
                  <ul>
                    <li v-for="(item, index) in getSWOTAnalysis(selectedCompetitor).weaknesses" :key="index">{{ item }}</li>
                  </ul>
                </div>
                <div class="swot-section">
                  <h3>Opportunities</h3>
                  <ul>
                    <li v-for="(item, index) in getSWOTAnalysis(selectedCompetitor).opportunities" :key="index">{{ item }}</li>
                  </ul>
                </div>
                <div class="swot-section">
                  <h3>Threats</h3>
                  <ul>
                    <li v-for="(item, index) in getSWOTAnalysis(selectedCompetitor).threats" :key="index">{{ item }}</li>
                  </ul>
                </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApexCharts from 'vue3-apexcharts';

interface Competitor {
  id: string;
  name: string;
  comparisonData: number[];
  swotData: SWOTData;
}

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

const competitors = ref<Competitor[]>([
  {
    id: '1',
    name: 'Competitor A',
    comparisonData: [45, 30, 60], // Sample comparison data for Competitor A
    swotData: {
      strengths: ['Strong logistics network', 'Excellent customer service'],
      weaknesses: ['Limited global reach', 'Lack of innovation'],
      opportunities: ['Expanding e-commerce market', 'Growing demand for sustainable products'],
      threats: ['Rising fuel costs', 'Intense competition'],
    },
  },
  {
    id: '2',
    name: 'Competitor B',
    comparisonData: [60, 40, 70], // Sample comparison data for Competitor B
    swotData: {
      strengths: ['Advanced technology', 'Strong brand reputation'],
      weaknesses: ['High product prices', 'Complex supply chain'],
      opportunities: ['Growing customer base', 'Emerging markets'],
      threats: ['Intense competition', 'Economic downturn'],
    },
  },
  {
    id: '3',
    name: 'Competitor C',
    comparisonData: [45, 50, 65], // Sample comparison data for Competitor C
    swotData: {
        strengths: ['Wide product range', 'Efficient distribution network'],
        weaknesses: ['Lack of brand recognition', 'Limited online presence'],
        opportunities: ['Emerging markets', 'Partnership opportunities'],
        threats: ['Regulatory changes', 'Competitor expansion'],
      },
    },
]);

const selectedCompetitor = ref<Competitor | null>(null);

const comparisonChartOptions = ref({
  chart: {
    type: 'bar',
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Revenue', 'Market Share', 'Customer Satisfaction'],
  },
});

const getComparisonChartData = (competitor: Competitor) => {
  const seriesData = [
    {
      name: 'Your Company',
      data: [50, 30, 80], // Sample data for Your Company
    },
    {
      name: competitor.name,
      data: competitor.comparisonData,
    },
  ];
  return seriesData;
};

const getSWOTAnalysis = (competitor: Competitor) => {
  return competitor.swotData || {};
};

const fetchMetricData = () => {
  if (selectedCompetitor.value) {
    // Simulate fetching data for the selected competitor
    comparisonChartOptions.value = {
      ...comparisonChartOptions.value,
      xaxis: {
        ...comparisonChartOptions.value.xaxis,
        categories: ['Revenue', 'Market Share', 'Customer Satisfaction'],
      },
    };
  }
};
</script>

<style scoped>
.swot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.swot-item {
  flex-basis: 50%;
}

.swot-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.swot-list {
  padding: 0;
  margin: 0;
  list-style-type: disc;
}

.swot-list li {
  margin-bottom: 5px;
}



.swot-template {
  font-family: Arial, sans-serif;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.swot-header {
  text-align: center;
  margin-bottom: 20px;
}

.swot-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.swot-section {
  width: 48%;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

h3 {
  font-size: 16px;
  color: #333;
  margin-top: 0;
  margin-bottom: 10px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 0;
}

li {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}
</style>