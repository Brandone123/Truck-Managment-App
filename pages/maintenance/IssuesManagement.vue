<template>
  <div class="mt-n4">
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Issues</span>
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="primary" class="mr-3">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="openImportDialog">
              <template v-slot:append>
                <v-icon>mdi-cloud-upload-outline</v-icon>
              </template>
              <v-list-item-title>
                Import
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <template v-slot:append>
                <v-icon>mdi-cloud-download-outline</v-icon>
              </template>
              <v-list-item-title>
                Export
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="primary" @click="openCreateIssueDialog">Report Issue</v-btn>
      </div>
    </div>

    <IssueDetailsDialog :modelValue="issueDetailsDialog" :issue="selectedIssue" @save="saveIssue"
      @update:modelValue="issueDetailsDialog = $event" @close="closeIssueDetailsDialog" :vehicleId="parseInt(selectedIssue.asset_name as string)"/>
    <IssueEditDialog :modelValue="issueEditDialog" :issue="selectedIssue" :vehicleId="parseInt(selectedIssue.asset_name as string)"
      @update:modelValue="issueEditDialog = $event" @close="closeIssueEditDialog" @save="saveIssue"/>
    <IssuesUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-alert-circle-outline</v-icon>
              <span>Total Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ issueSummary.total }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-alert</v-icon>
              <span>Open Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ issueSummary.open }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Closed Issues</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ issueSummary.closed }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#a4d0ee">mdi-clock-outline</v-icon>
              <span>Avg. Resolution Time</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ issueSummary.avgResolutionTime }} hrs</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <IssueList :issues="issueList" :loading="loadingIssues" @view="viewIssue" @edit="editIssue"
          @delete="deleteIssue" @convert="convertToWorkOrder"/>
      </v-col>
    </v-row>

    <v-row>
      <!-- Notifications and Alerts Section -->
      <v-col cols="12" md="5">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Notifications and Alerts</v-card-title>
        </div>
        <v-row>
          <v-col cols="12">
            <v-card class="px-0">
              <v-card-text>
                <v-alert density="compact" class="mb-2" dense type="info" v-for="alert in notifications" :key="alert.id">
                  {{ alert.message }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div>
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Issue Status Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="issueStatusOptions" :series="issueStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->
      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Issue Reports</v-card-title>
        </div>
        <v-card>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyIssuesOptions" :series="monthlyIssuesOptions.series" />
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
// import { useIssueStore } from '@/stores/maintenance/issue';
import IssueList from '@/components/maintenance/issue/issueManagement/IssueList.vue';
import IssueDetailsDialog from '@/components/maintenance/issue/issueManagement/IssueDetailsDialog.vue';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import IssuesUpload from '@/components/maintenance/issue/issueManagement/IssuesUpload.vue'; // Import the IssuesUpload component
import 'apexcharts/dist/apexcharts.css';
import type { Issues } from '@/types/maintenance/issue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const issueStore = useIssueStore();
issueStore.setInitialData()


const { issueList, loading: loadingIssues, issueSummary, notifications, chartData } = storeToRefs(issueStore);

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const issueDetailsDialog = ref(false);
const issueEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);

const monthlyIssuesOptions = computed(() => {
  return {
    series: [
      {
        name: 'Issues Reported',
        data: chartData.value.monthly.series
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: chartData.value.monthly.categories
    },
    yaxis: {
      title: {
        text: 'Number of Issues'
      }
    },
    colors: ['#22a7f0']
  }
});

const issueStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.issueStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const issueStatusSeries = computed(() => chartData.value.issueStatus.series);

const openCreateIssueDialog = () => {
  selectedIssue.value = {} as Partial<Issues>;
  issueEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewIssue = (issue: any) => {
  selectedIssue.value = issue;
  issueDetailsDialog.value = true;
};

const editIssue = (issue: any) => {
  selectedIssue.value = issue;
  issueEditDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteIssue = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this issue ?")

  if (confirm) {
    await issueStore.deleteIssue(id);
  }
};

const convertToWorkOrder = (issue: any) => {
  // Implement the convert to work order logic
};

const closeIssueDetailsDialog = () => {
  issueDetailsDialog.value = false;
};

const closeIssueEditDialog = () => {
  issueEditDialog.value = false;
};

const saveIssue = async (issue: any) => {
  if (issue.id) {
    await issueStore.updateIssue(issue);
  } else {
    await issueStore.createIssue(issue);
  }
  issueEditDialog.value = false;
}
 

onMounted(() => {
  switch(route.query.action){
    case 'createIssue':
      console.log(route.query.vehicleName)
      if(selectedIssue.value){
        selectedIssue.value = {asset_name: route.query.vehicleName, reported_date: route.query.reported_date} 
      }
      issueEditDialog.value = true;
      break;
    default:
      break;
  }
  issueStore.fetchIssues();
  issueStore.fetchNotifications();
  issueStore.fetchChartData();
});
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
.card-4 {
    border-left: 8px solid #a4d0ee;
}
</style>
