<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Reports Generation</span>
      <v-btn color="primary" @click="openGenerateReportDialog">Generate Report</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-file-chart-outline</v-icon>
              <span>Total Reports</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reportSummary.totalReports }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
              <span>Reports Pending</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reportSummary.reportsPending }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Reports Completed</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reportSummary.reportsCompleted }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ReportsTable @view="viewReport" @edit="editReport" @delete="deleteReport" />
      </v-col>
    </v-row>

    <ReportDetailsDialog :modelValue="detailsDialog" :report="selectedReport"
      @update:modelValue="detailsDialog = $event" />
    <ReportEditDialog :modelValue="editDialog" :report="selectedReport" @update:modelValue="editDialog = $event"
      @save="saveReport" />
    <DeleteReportDialog :modelValue="deleteDialog" @confirm="confirmDeleteReport" />

    <!-- Reporting and Analytics Section -->
    <v-row>
      <v-col cols="12" md="6">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Report Generation</v-card-title>
        </div>
        <v-card>
          <v-card-text>
            <client-only>
              <apexchart type="line" height="350" :options="monthlyReportOptions"
                :series="monthlyReportOptions.series" />
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Report Type Distribution</v-card-title>
        </div>
        <v-card>
          <v-card-text>
            <client-only>
              <apexchart type="pie" height="350" :options="reportTypeDistributionOptions"
                :series="reportTypeDistributionSeries" />
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import ReportsTable from '@/components/maintenance/reports/report/ReportsTable.vue';
import ReportDetailsDialog from '@/components/maintenance/reports/report/ReportDetailsDialog.vue';
import ReportEditDialog from '@/components/maintenance/reports/report/ReportEditDialog.vue';
import DeleteReportDialog from '@/components/maintenance/reports/report/DeleteReportDialog.vue';
import { useReportsStore } from '@/stores/maintenance/reportsStore';
import type { Report } from '@/types/maintenance/reportTypes';
import 'apexcharts/dist/apexcharts.css';

const reportsStore = useReportsStore();
reportsStore.setInitialData()

const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedReport = ref<Report | null>(null);

const reportSummary = computed(() => reportsStore.reportSummary);
const chartData = computed(() => reportsStore.chartData);

onMounted(() => {
  reportsStore.fetchReports();
  reportsStore.fetchChartData();
});

const openGenerateReportDialog = () => {
  selectedReport.value = null;
  editDialog.value = true;
};

const viewReport = (report: Report) => {
  selectedReport.value = report;
  detailsDialog.value = true;
};

const editReport = (report: Report) => {
  selectedReport.value = report;
  editDialog.value = true;
};

const deleteReport = (report: Report) => {
  selectedReport.value = report;
  deleteDialog.value = true;
};

const saveReport = (report: Report) => {
  if (report.id) {
    reportsStore.updateReport(report);
  } else {
    reportsStore.createReport(report);
  }
  editDialog.value = false;
};

const confirmDeleteReport = () => {
  if (selectedReport.value) {
    reportsStore.deleteReport(selectedReport.value.id as number);
  }
  deleteDialog.value = false;
};

const monthlyReportOptions = computed(() => ({
  series: [
    {
      name: 'Reports Generated',
      data: chartData.value.monthlyReportGeneration.series,
    },
  ],
  chart: {
    type: 'line',
    height: 350,
    toolbar: {
      show: true,
    },
  },
  xaxis: {
    categories: chartData.value.monthlyReportGeneration.categories,
  },
  yaxis: {
    title: {
      text: 'Number of Reports',
    },
  },
  colors: ['#22a7f0'],
}));

const reportTypeDistributionOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.reportTypeDistribution.labels,
  colors: ['#1984c5', '#22a7f0', '#63bff0'],
}));

const reportTypeDistributionSeries = computed(() => chartData.value.reportTypeDistribution.series);
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #CE0053;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #424656;
}
</style>