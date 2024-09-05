<template>
  <div>
    <div class="d-flex justify-space-between mb-16">
      <span class="text-primary text-h5">Telematics Data Integration</span>
      <v-btn color="primary" @click="openAddTelematicsDeviceDialog">Add Telematics Device</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <OverviewCard title="Total Devices" icon="mdi-chip" :value="dashboardStats.totalDevices" color="primary" />
      </v-col>
      <v-col cols="12" md="4">
        <OverviewCard title="Active Vehicles" icon="mdi-truck" :value="dashboardStats.activeVehicles" color="green" />
      </v-col>
      <v-col cols="12" md="4">
        <OverviewCard title="Alerts" icon="mdi-alert-circle" :value="dashboardStats.alerts" color="red" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <TelematicsDataTable @view="viewTelematicsData" @edit="editTelematicsData" @delete="deleteTelematicsData" />
      </v-col>
    </v-row>

    <TelematicsDataDetailsModal :modelValue="detailsDialog" :data="selectedTelematicsData as TelematicsData"
      @update:modelValue="detailsDialog = $event" />
    <TelematicsDeviceForm :modelValue="editDialog" :data="selectedTelematicsData"
      @update:modelValue="editDialog = $event" @save="saveTelematicsData" />
    <DeleteTelematicsDataDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event" @confirm="confirmDeleteTelematicsData" />



    <v-row>
      <v-col cols="12" md="6">
        <TelematicsChart :options="fuelConsumptionChartOptions" />
      </v-col>
      <v-col cols="12" md="6">
        <TelematicsChart :options="engineStatusChartOptions" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import TelematicsDataTable from '@/components/maintenance/integrations/telematics/TelematicsDataTable.vue';
import TelematicsDataDetailsModal from '@/components/maintenance/integrations/telematics/TelematicsDataDetailsModal.vue';
import TelematicsDeviceForm from '@/components/maintenance/integrations/telematics/TelematicsDeviceForm.vue';
import DeleteTelematicsDataDialog from '@/components/maintenance/integrations/telematics/DeleteTelematicsDataDialog.vue';
import OverviewCard from '@/components/maintenance/integrations/telematics/OverviewCard.vue';
import TelematicsChart from '@/components/maintenance/integrations/telematics/TelematicsChart.vue';
import { useTelematicsStore } from '@/stores/maintenance/telematicsStore';
import type { TelematicsData } from '@/types/maintenance/telematicsTypes';

const telematicsStore = useTelematicsStore();
const assetStore = useAssetStore();

onMounted(()=>{
  assetStore.fetchAssets()
  telematicsStore.fetchTelematicsData()
  telematicsStore.fetchChartData()
})

const {telematicsDataList} = storeToRefs(telematicsStore)

const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedTelematicsData = ref<Partial<TelematicsData>>({ data_value: {}} as Partial<TelematicsData>);

const dashboardStats = ref({
  totalDevices: 100,
  activeVehicles: 80,
  alerts: 5,
});

// const dashboardStats = computed(()=>{
//   totalDevices: 100,
//   activeVehicles: 80,
//   alerts: 5,
// })

const fuelConsumptionChartOptions = {
  series: [{
    name: 'Fuel Consumption',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }],
  chart: {
    height: 350,
    type: 'line'
  },
  title: {
    text: 'Fuel Consumption Over Time'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  }
};

const engineStatusChartOptions = {
  series: [{
    name: 'Engine Status',
    data: [5, 6, 7, 8, 9, 10, 11, 12, 13]
  }],
  chart: {
    height: 350,
    type: 'line'
  },
  title: {
    text: 'Engine Status Over Time'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  }
};

const openAddTelematicsDeviceDialog = () => {
  selectedTelematicsData.value = {data_value:{}} as Partial<TelematicsData>;
  editDialog.value = true;
};

const viewTelematicsData = (data: TelematicsData) => {
  selectedTelematicsData.value = data;
  detailsDialog.value = true;
};

const editTelematicsData = (data: TelematicsData) => {
  selectedTelematicsData.value = data;
  editDialog.value = true;
};

const deleteTelematicsData = (data: TelematicsData) => {
  selectedTelematicsData.value = data;
  deleteDialog.value = true;
};

const saveTelematicsData = (data: TelematicsData) => {
  if (data.id) {
    telematicsStore.updateTelematicsData(data);
  } else {
    telematicsStore.createTelematicsData(data);
  }
  editDialog.value = false;
};

const confirmDeleteTelematicsData = () => {
  if (selectedTelematicsData.value) {
    telematicsStore.deleteTelematicsData(selectedTelematicsData.value.id as number);
  }
  deleteDialog.value = false;
};
</script>