<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Meter History</span>
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
        <v-btn color="primary" @click="openAddHistoryDialog">Add Meter Entry</v-btn>
      </div>
    </div>

    <AssetDetailsDialog :modelValue="meterHistoryDetailsDialog" :asset="selectedMeterHistory"
      @update:modelValue="meterHistoryDetailsDialog = $event" />
    <MeterEditDialog :modelValue="meterEditDialog" :asset="selectedMeterHistory"
      @update:modelValue="meterEditDialog = $event" @save="saveMeterHistory" />
    <ImportMeterHistoryDialog :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <!-- Rest of the code remains the same -->
    <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteMeterHistory" @update:modelValue="deleteDialog = $event" /> -->

    <div>
      <div style="position:sticky;top:102px;z-index:1;" class="pt-1 grey-background position-sticky">
        <v-tabs v-model="activeFilter" color="primary" density="compact">
          <v-tab value="all" class="text-none">All</v-tab>
          <v-tab value="not voided" class="text-none"><span class="mr-1 bg-primary"
              style="width: 8px; height: 8px; border-radius: 50%;"></span>Not Voided
            <v-chip density="compact" class="ml-1 bg-primary">{{ notVoidedCount }}</v-chip></v-tab>
          <v-tab value="manually voided" class="text-none">
            <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span> Manually Voided
            <v-chip density="compact" class="ml-1 bg-orange">{{ mVoidedCount }}</v-chip></v-tab>
          <v-tab value="auto voided" class="text-none">
            <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Auto Voided
            <v-chip density="compact" class="ml-1 bg-secondary">{{ autoVoidedCount }}</v-chip></v-tab>
         
        </v-tabs>
        <v-divider></v-divider>
      </div>

      <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" :filters="filtersAssets" :showFooterInHead="false" :headers="assetHeaders"
        :items="filteredMeterHistory" :loading="loadingMeterHistories">
        <template v-slot:item.vehicle_id="{ item }">
          <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
            :close-on-content-click="true" class="rounded" open-on-hover>
            <template v-slot:activator="{ props }">
              <div class="d-flex">
                <div>
                  <div class="rounded position-relative"
                    style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                    <span style="font-size:xx-small;" v-if="getVehicleName(item.vehicle_id)?.type">{{
                      getVehicleName(item.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                    <span v-else style="font-size:xx-small;">VHI</span>
                    <div v-if="getVehicleName(item.vehicle_id)?.status"
                      :class="`${'bg-' + getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)}`"
                      style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                    </div>
                  </div>
                </div>
                <div class="ml-auto">
                  <span class="text-secondary ml-2" v-bind="props"
                    style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                    {{ getVehicleName(item.vehicle_id)?.name }}
                  </span>
                </div>
              </div>
            </template>
            <v-row no-gutters>
              <v-col cols="12">
                <v-card class="rounded-lg">
                  <v-card-text>
                    <div class="mb-3">
                      <div class="d-flex" style=" align-items: center;">
                        <div>
                          <div class="rounded position-relative"
                            style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                            <span style="font-size: large;">{{ getVehicleName(item.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                          </div>
                        </div>
                        <div class="ml-2">
                          <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">
                            {{ getVehicleName(item.vehicle_id)?.name }}
                          </span>
                        </div>
                      </div>
                      <v-row class="mt-2">
                        <v-col cols="12" md="6">Status</v-col>
                        <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.status">
                          <v-chip density="compact" variant="flat" class="text-capitalize"
                            :color="getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)">
                            {{ getVehicleName(item.vehicle_id)?.status }}
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">Operator</v-col>
                        <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.odometer }}</v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">Type</v-col>
                        <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.type }}</v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">Year Make Model</v-col>
                        <v-col cols="12" md="6">
                          {{ getVehicleName(item.vehicle_id)?.year }}
                          {{ getVehicleName(item.vehicle_id)?.make }}
                          {{ getVehicleName(item.vehicle_id)?.model }}
                        </v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">Group</v-col>
                        <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.dimensions">{{
                          getVehicleName(item.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">VIN/SN</v-col>
                        <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.vin }}</v-col>
                      </v-row>
                      <v-divider class="my-2"></v-divider>
                      <v-row>
                        <v-col cols="12" md="6">Current Meter</v-col>
                        <v-col cols="12" md="6">{{ }}</v-col>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-menu>
        </template>
        <template v-slot:item.auto_void_reason="{ item }">
          <v-chip v-if="item.auto_void_reason" size="small" dark color="secondary">
            {{ item.auto_void_reason }}
          </v-chip>
          <span v-else>N/A</span>
        </template>
        <template v-slot:item.void="{ item }">
          <v-icon v-if="item.void" size="small">mdi-check</v-icon>
          <v-icon v-else size="small">mdi-close</v-icon>
        </template>
        <template v-slot:item.meter_value="{ item }">
          <span v-if="item.void" class="text-secondary text-decoration-line-through"><v-icon class="mr-1"
              small>mdi-lightning-bolt-circle</v-icon>0
            mi</span>
          <span v-else>{{ item.meter_value }} mi</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="!item.void" class="ml-2" color="primary" dense
            @click="editMeterHistory(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="deleteMeterHistory(item.id)">mdi-delete</v-icon>
          <VoidMeterEntry :voidStatus="item.void" @confirmVoid="voidMeterHistory(item.id)"
            @confirmUnVoid="unVoidMeterHistory(item.id)" />
        </template>
        <template v-slot:item.void_status="{ item }">
          <v-chip density="compact" variant="flat" :color="getStatusClass(item)" size="small"
            style="text-transform: capitalize">
            {{ item.void_status }}
          </v-chip>
        </template>
        <template v-slot:item.source="{ item }">
          <span style="border-bottom: 1px dotted">{{ item.source }}</span>
          <v-tooltip activator="parent" location="top" v-if="item.source === 'Samsara'">
            <pre style="font-size: x-small">This Meter Entry was created from a nightly import</pre>
          </v-tooltip>
        </template>
        <template v-slot:item.meter_type="{ item }">
          <span>{{ item.meter_type.charAt(0).toUpperCase() + item.meter_type.slice(1) }}</span>
        </template>
        <template v-slot:item.meter_date="{ item }">
          <span style="border-bottom: 1px dotted; cursor: pointer">
            {{item.meter_date}}
            <v-tooltip activator="parent" location="top" location-strategy="connected">
              {{ getRelativeDateTime(item.meter_date) }}
            </v-tooltip>
          </span>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useMeterHistoryStore } from '@/stores/maintenance/meterHistoryStore';
import MeterEditDialog from '~/components/maintenance/meterHistory/MeterEditDialog.vue';
import VoidMeterEntry from '~/components/maintenance/meterHistory/VoidMeterEntry.vue';
import DeleteConfirmationDialog from '@/components/maintenance/assetManagement/DeleteConfirmationDialog.vue';
//import ImportMeterHistoryDialog from '~/components/maintenance/meterHistory/ImportMeterDialog.vue';
import ImportMeterHistoryDialog from '~/components/maintenance/meterHistory/MeterHistory.vue';
import type { filterItem } from '~/types/layout/table';
import type { MeterHistory } from '~/types/maintenance/meterHistoryTypes';

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const meterHistoryStore = useMeterHistoryStore();
const { meterHistoryList, loading: loadingMeterHistories } = storeToRefs(meterHistoryStore);

const router = useRouter();
const filtersAssets = ref<filterItem[]>([]);

const meterHistoryDetailsDialog = ref(false);
const meterEditDialog = ref(false);
const importDialog = ref(false);
const deleteDialog = ref(false);

const selectedMeterHistory = ref({} as Partial<MeterHistory>);

const openAddHistoryDialog = () => {
  selectedMeterHistory.value = {
    meter_date: new Date().toISOString().substring(0, 10),
    meter_type: 'primary', //default value
    source: 'user entry', //default value
    void_status: 'not voided', //default value
    void: false, //default value
  } as Partial<MeterHistory>;
  meterEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true;
};

const editMeterHistory = (asset: any) => {
  selectedMeterHistory.value = asset;
  meterEditDialog.value = true;
};

const confirmDelete = (id: any) => {
  selectedMeterHistory.value = { ...id };
  deleteDialog.value = true;
};

const viewDetails = (vehicleId: number) => {
  router.push(`AssetListPage/details/${vehicleId}`)
}

const layoutStore = useLayoutStore()
const deleteMeterHistory = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this meter history ?")

  if (confirm) {
    await meterHistoryStore.deleteMeterHistory(id);
  }
};

const voidMeterHistory = async (id: number) => {
  await meterHistoryStore.updateMeterHistory({ id, void: true, void_status: 'manually voided' });
};

const unVoidMeterHistory = async (id: number) => {
  await meterHistoryStore.updateMeterHistory({ id, void: false, void_status: 'not voided' });
};

const saveMeterHistory = async (asset: any) => {
  if (asset.id) {
    await meterHistoryStore.updateMeterHistory(asset);
  } else {
    await meterHistoryStore.createMeterHistory(asset);
  }
  meterEditDialog.value = false;
};

const assetHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Meter Date', key: 'meter_date' },
  { title: 'Meter Value', key: 'meter_value' },
  { title: 'Meter Type', key: 'meter_type' },
  { title: 'Void', key: 'void' },
  { title: 'Source', key: 'source' },
  { title: 'Auto-Void Reason', key: 'auto_void_reason' },
  { title: 'Void Status', key: 'void_status' },
  { title: 'Actions', key: 'actions' },
];

  const getVehicleName = (vehicleId: any) => {
    const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
    return vehicleName
  }

const getStatusClass = (asset: any) => {
  const assetData = meterHistoryList.value.find((data: any) => data.id === asset.id);
  if (assetData?.void_status) {
    if (assetData?.void_status === "manually voided") {
      return 'orange';
    } else if (assetData?.void_status === "auto voided") {
      return 'secondary';
    } else if (assetData?.void_status === "not voided") {
      return 'primary'
    }
  }
  return '';
}

function initializeFilters() {
  filtersAssets.value = [
    {
      title: 'Filter by meter type',
      key: 'meter_type',
      items: [
        { text: 'Primary Meter', value: 'primary' },
        { text: 'Secondary Meter', value: 'secondary' },
        { text: 'Odometer', value: 'Odometer' }
      ],
      width: '300px',
    },
  ];
}

const getVehicleStatusColor = (status: any) => {
  switch ((status || '')) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}

const activeFilter = ref<string>('all')

const filteredMeterHistory = computed(() => {
  if (activeFilter.value == 'all') {
    return meterHistoryList.value
  }
  return meterHistoryList.value.filter(item => item.void_status == activeFilter.value)
})

const mVoidedCount = computed(() => {
  return meterHistoryList.value.filter(item => item.void_status == 'manually voided')?.length || 0
})

const autoVoidedCount = computed(() => {
  return meterHistoryList.value?.filter(item => item.void_status == 'auto voided')?.length || 0
})

const notVoidedCount = computed(() => {
  return meterHistoryList.value.filter(item => item.void_status == 'not voided')?.length || 0
})

const getRelativeDateTime = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString.replace(/\//g, '-'));
  const diff = now.getTime() - createdAt.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

onMounted(() => {
  assetStore.fetchAssets();
  meterHistoryStore.fetchMeterHistories();
});

watchEffect(() => {
  if (meterHistoryList.value) {
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
