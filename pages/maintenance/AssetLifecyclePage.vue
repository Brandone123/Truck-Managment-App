<template>
    <div>
      <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position:sticky;top: 48px;z-index:1;">
        <span class="text-primary text-h6">Asset Lifecycle Tracking</span>
      </div>
  
      <AssetDetailsDialog :modelValue="assetDetailsDialog" :asset="selectedAsset" @update:modelValue="assetDetailsDialog = $event" />
      <!-- <LifecycleStageTimeline :asset="selectedAsset" /> -->
  
    <div>
      <div style="position:sticky;top:102px;z-index:1;" class="pt-1 grey-background position-sticky">
        <v-tabs v-model="activeFilter" color="primary" density="compact">
          <v-tab value="all" class="text-none">All</v-tab>
          <v-tab value="active" class="text-none">
            <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Active
            <v-chip density="compact" class="ml-1 bg-primary">{{ activeCount }}</v-chip></v-tab>
          <v-tab value="inactive" class="text-none">
            <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Inactive
            <v-chip density="compact" class="ml-1 bg-secondary">{{ inactiveCount }}</v-chip></v-tab>
          <v-tab value="Out of Service" class="text-none"><span class="mr-1 bg-error"
              style="width: 8px; height: 8px; border-radius: 50%;"></span>Out of Service
            <v-chip density="compact" class="ml-1 bg-error">{{ maintenanceCount }}</v-chip></v-tab>
            <v-tab value="In Shop" class="text-none"><span class="mr-1 bg-brown"
              style="width: 8px; height: 8px; border-radius: 50%;"></span>In Shop
            <v-chip density="compact" class="ml-1 bg-brown">{{ inShopCount }}</v-chip></v-tab>
        </v-tabs>
        <v-divider></v-divider>
      </div>

      <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" :filters="filtersAssets" 
      :showFooterInHead="false" :headers="assetHeaders" :items="filteredAssets" :loading="loadingAssets">
        <!-- <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
        </template> -->
        <template v-slot:item.vehicle_id="{ item }">
          <div class="d-flex" style="justify-content: center; align-items: center;" >
            <div class="rounded position-relative mr-1"
              style="justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
              <span style="font-size:xx-small;" v-if="getVehicleName(item.vehicle_id)?.type">{{ getVehicleName(item.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
              <span v-else style="font-size:xx-small;">VHI</span>
            </div>
            <span style="cursor: pointer;" class="ml-auto text-primary font-weight-bold" dense
              @click="viewDetails(item.vehicle_id)">
              {{ getVehicleName(item.vehicle_id)?.name }}
            </span>
          </div>
        </template>
        <template v-slot:item.type="{ item }">
          {{ getVehicleName(item.vehicle_id)?.type }}
        </template>
        <template v-slot:item.vin="{ item }">
          {{ getVehicleName(item.vehicle_id)?.vin }}
        </template>
        <template v-slot:item.make_model="{ item }">
          {{ getVehicleName(item.vehicle_id)?.make }}
        </template>
        <template v-slot:item.year="{ item }">
          {{ getVehicleName(item.vehicle_id)?.year }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip density="compact" variant="flat" :color="getStatusClass(getVehicleName(item.vehicle_id)?.status)" size="small"
            style="text-transform: capitalize">
            {{ getVehicleName(item.vehicle_id)?.status }}
          </v-chip>
        </template>
      </SharedUiCustomTable>
    </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAssetLifecycleStore } from '@/stores/maintenance/assetLifecycleStore';
  import AssetDetailsDialog from '@/components/maintenance/assetManagement/lifeCycle/AssetDetailsDialog.vue';
  import LifecycleStageTimeline from '@/components/maintenance/assetManagement/lifeCycle/LifecycleStageTimeline.vue';
  import type { filterItem } from '~/types/layout/table';

  const assetLifecycleStore = useAssetLifecycleStore();
  const { assetCycleList, loading: loadingAssets } = storeToRefs(assetLifecycleStore);
  
 const router = useRouter();
  
  const stageOptions = ['Acquisition', 'Active Service', 'Maintenance', 'Decommissioning'];
  const filtersAssets = ref<filterItem[]>([])
  
  const assetDetailsDialog = ref(false);
  const selectedAsset = ref({
    id: null,
    vehicle_id: null,
    name: '',
    type: '',
    vin: '',
    make_model: '',
    year: null,
    status: '',
    current_lifecycle_stage: '',
    lifecycle_stages: [],
  });
  
 
  const viewDetails = (vehicleId: number) => {
    router.push(`AssetListPage/details/${vehicleId}`)
  }

  const assetStore = useAssetStore();
  const { assetList } = storeToRefs(assetStore);

  const getVehicleName = (vehicleId: any) => {
    const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
    return vehicleName
  }
  
  // const filteredAssets = computed(() => {
  //   return assetCycleList.value
  //     .filter(asset => asset.name.toLowerCase().includes(search.value.toLowerCase()) || asset.vin.toLowerCase().includes(search.value.toLowerCase()))
  //     .filter(asset => !filterStage.value || asset.current_lifecycle_stage === filterStage.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });

  const filteredAssetsCycle = computed(() => {
    return assetCycleList.value?.map(asset => {
      return { text: getVehicleName(asset.vehicle_id)?.name, value: getVehicleName(asset.vehicle_id)?.name }
    }) || []
  })
  
  const assetHeaders = [
    { title: 'Name', key: 'vehicle_id' },
    { title: 'Type', key: 'type' },
    { title: 'VIN', key: 'vin' },
    { title: 'Make/Model', key: 'make_model' },
    { title: 'Year', key: 'year' },
    { title: 'Current Lifecycle Stage', key: 'current_lifecycle_stage' },
    { title: 'Status', key: 'status' },
    // { title: 'Actions', key: 'actions' },
  ];

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Filter by vehicle name',
        key: 'name',
        items: filteredAssetsCycle.value as any,
        width: '300px',
      },
    ];
  }

  const getStatusClass = (asset: any) => {
  if (asset) {
    if (asset === "Out of Service") {
      return 'error';
    } else if (asset === "active") {
      return 'primary';
    } else if (asset === "inactive") {
      return 'secondary'
    } else if (asset === "In Shop") {
      return 'brown'
    } else {
      return 'grey'
    }
  }
  return '';
}

  const activeFilter = ref<string>('all')

const filteredAssets = computed(() => {
  if (activeFilter.value == 'all') {
    return assetCycleList.value
  }
  return assetCycleList.value.filter(item => getVehicleName(item.vehicle_id)?.status == activeFilter.value)
})

const activeCount = computed(() => {
  return assetCycleList.value?.filter(item => getVehicleName(item.vehicle_id)?.status == 'active')?.length || 0
})

const inactiveCount = computed(() => {
  return assetCycleList.value?.filter(item => getVehicleName(item.vehicle_id)?.status == 'inactive')?.length || 0
})

const maintenanceCount = computed(() => {
  return assetCycleList.value?.filter(item => getVehicleName(item.vehicle_id)?.status == 'Out of Service')?.length || 0
})

const inShopCount = computed(() => {
  return assetCycleList.value?.filter(item => getVehicleName(item.vehicle_id)?.status == 'In Shop')?.length || 0
})
  
  onMounted(() => {
    assetLifecycleStore.fetchAssets();
  });

  watchEffect(() => {
  if (assetCycleList.value) {
    initializeFilters();
  }
});
  </script>
  
  <style scoped>
  </style>
  