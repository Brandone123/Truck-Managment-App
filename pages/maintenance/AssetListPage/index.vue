<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Asset List</span>
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
        <v-btn color="primary" @click="openAddAssetDialog">Add Asset</v-btn>
      </div>
    </div>

    <AssetImportDialog :modelValue="importDialog" @update:modelValue="importDialog = $event" />
    <AssetEditDialog :modelValue="assetEditDialog" :asset="selectedAsset" @update:modelValue="assetEditDialog = $event"
      @save="saveAsset" />


    <v-row class="mt-5 mb-10">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
              <span>Total Inactive</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ getInactiveN }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
              <span>Total Maintenance</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ getMaintenanceN }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Total Active</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ getActiveN }}</span>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
        <template v-slot:item.actions="{ item }">
          <!-- <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon> -->
          <v-icon class="ml-2" color="primary" dense @click="editAsset(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="deleteAsset(item.id)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip density="compact" variant="flat" :color="getStatusClass(item)" size="small"
            style="text-transform: capitalize">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.current_meter="{ item }">
          {{ item.current_meter }} mi
        </template>
        <template v-slot:item.name="{ item }">
          <div class="d-flex" style="justify-content: center; align-items: center;">
            <div class="rounded position-relative mr-1"
              style="justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
              <span style="font-size:xx-small;" v-if="item.type">{{ item.type.slice(0, 3).toUpperCase() }}</span>
              <span v-else style="font-size:xx-small;">VHI</span>
            </div>
            <span style="cursor: pointer;" class="ml-auto text-primary font-weight-bold" dense
              @click="viewDetails(item.id)">
              {{ item.name }}
            </span>
          </div>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAssetStore } from '@/stores/maintenance/assetStore';
import AssetEditDialog from '@/components/maintenance/assetManagement/AssetEditDialog.vue';
import DeleteConfirmationDialog from '@/components/maintenance/assetManagement/DeleteConfirmationDialog.vue';
import AssetImportDialog from '@/components/maintenance/assetManagement/AssetImport.vue';
import type { filterItem } from '~/types/layout/table';
import type { Asset } from '~/types/maintenance/assetTypes';

const router = useRouter();
const layoutStore = useLayoutStore()

const assetStore = useAssetStore();
const { assetList, loading: loadingAssets } = storeToRefs(assetStore);

const filtersAssets = ref<filterItem[]>([]);

const assetDetailsDialog = ref(false);
const assetEditDialog = ref(false);
const importDialog = ref(false);
const deleteDialog = ref(false);

const viewDetails = (vehicleId: number) => {
  router.push(`AssetListPage/details/${vehicleId}`)
}

const selectedAsset = ref<Partial<Asset>>({} as Partial<Asset>);

const openAddAssetDialog = () => {
  selectedAsset.value = {} as Partial<Asset>;
  assetEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true;
};

const viewAsset = (asset: any) => {
  selectedAsset.value = asset;
  assetDetailsDialog.value = true;
};

const editAsset = (asset: any) => {
  selectedAsset.value = asset;
  assetEditDialog.value = true;
};

const confirmDelete = (id: any) => {
  selectedAsset.value = { ...id };
  deleteDialog.value = true;
};

const deleteAsset = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this vehicle ?")

  if (confirm) {
    await assetStore.deleteAsset(id);
  }
};

const saveAsset = async (asset: any) => {
  if (asset.id) {
    await assetStore.updateAsset(asset);
  } else {
    await assetStore.createAsset(asset);
  }
  assetEditDialog.value = false;
};

const getActiveN = computed(() => {
  const completeNomber = assetList.value.filter((asset) => asset.status === 'active')
  return completeNomber.length;
})

const getMaintenanceN = computed(() => {
  const progressNomber = assetList.value.filter((asset) => asset.status === 'maintenance')
  return progressNomber.length;
})

const getInactiveN = computed(() => {
  const pendingNomber = assetList.value.filter((asset) => asset.status === 'inactive')
  return pendingNomber.length;
})

const filteredAssetStatus = computed(() => {
  return assetList.value?.map(asset => {
    return { text: asset.name, value: asset.name }
  }) || []
})

const assetHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Year', key: 'year' },
  { title: 'Make', key: 'make' },
  { title: 'Type', key: 'type' },
  { title: 'VIN', key: 'vin' },
  { title: 'Make', key: 'make' },
  { title: 'Model', key: 'model' },
  { title: 'License Plate', key: 'license_plate' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' },
];

function initializeFilters() {
  filtersAssets.value = [
    {
      title: 'Filter by vehicle name',
      key: 'name',
      items: filteredAssetStatus.value as any,
      width: '300px',
    },
  ];
}

const getStatusClass = (asset: any) => {
  const assetData = assetList.value.find((data: any) => data.id === asset.id);
  if (assetData?.status) {
    if (assetData?.status === "Out of Service") {
      return 'error';
    } else if (assetData?.status === "active") {
      return 'primary';
    } else if (assetData?.status === "inactive") {
      return 'secondary'
    } else if (assetData?.status === "In Shop") {
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
    return assetList.value
  }
  return assetList.value.filter(item => item.status == activeFilter.value)
})

const activeCount = computed(() => {
  return assetList.value?.filter(item => item.status == 'active')?.length || 0
})

const inactiveCount = computed(() => {
  return assetList.value?.filter(item => item.status == 'inactive')?.length || 0
})

const maintenanceCount = computed(() => {
  return assetList.value?.filter(item => item.status == 'Out of Service')?.length || 0
})

const inShopCount = computed(() => {
  return assetList.value?.filter(item => item.status == 'In Shop')?.length || 0
})

onMounted(() => {
  assetStore.fetchAssets();
});

watchEffect(() => {
  if (assetList.value) {
    initializeFilters();
  }
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
</style>
