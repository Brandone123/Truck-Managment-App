<template>
    <div>
        <div class="grey-background mx-n4 px-4 mt-0 mb-3"
            style="position:sticky;top:48px;z-index:1; margin-top: -16px;font-family:Arial, Helvetica, sans-serif;">
            <div class="d-flex justify-space-between mb-4">

                <span>
                    <span @click="goToAssetList()" style="cursor:pointer" class="text-primary text-h6">
                        <v-icon>mdi-chevron-left</v-icon>Asset List</span>
                    <span class="text-ht text-grey"> / {{ assetDetail?.name }}</span>
                </span>
                <div>
                    <!-- <v-btn color="primary" @click="openAddAssetDialog">Add Asset</v-btn>
        <v-btn color="secondary" @click="openImportDialog">Import Assets</v-btn> -->
                </div>
            </div>

            <v-row>
                <v-tabs density="compact" v-model="tab" center-active color="primary" class="mb-3">
                    <v-tab value="overview" density="compact" class="text-body ml-5" style="text-transform:initial;">
                        Overview
                    </v-tab>
                    <v-tab value="specs" density="compact" style="text-transform: initial;">
                        Specs
                    </v-tab>
                    <v-tab value="financial" density="compact" style="text-transform: initial;">
                        Financial
                    </v-tab>
                    <v-tab value="telematics" density="compact" style="text-transform: initial;">
                        Telematics
                    </v-tab>
                    <v-tab value="sensor" density="compact" style="text-transform: initial;">
                        Sensor Data Snapshots
                    </v-tab>
                    <!-- <v-tab value="service_history" density="compact" style="text-transform: initial;">
                        Service History
                    </v-tab>
                    <v-tab value="inspection_history" density="compact" style="text-transform: initial;">
                        Inspection
                    </v-tab>
                    <v-tab value="work_orders" density="compact" style="text-transform: initial;">
                        Work Orders
                    </v-tab>
                    <v-tab value="service_reminder" density="compact" style="text-transform: initial;">
                        Service Reminders
                    </v-tab> -->
                    <v-tab value="tire_management" density="compact" style="text-transform: initial;">
                        Tire Management
                    </v-tab>
                </v-tabs>
            </v-row>
        </div>




        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="overview">
                <v-row class="mt-1">
                    <CostofOwnership />
                </v-row>
            </v-window-item>
            <v-window-item value="specs">
                <v-row class="mt-1">
                    <Specs :item="assetDetail" @save="updateVehicleData" />
                </v-row>
            </v-window-item>
            <v-window-item value="financial">
                <v-row class="mt-1">
                    <Financial :item="assetDetail" @save="updateVehicleData" />
                </v-row>
            </v-window-item>
            <v-window-item value="telematics">
                <v-row class="mt-1">
                    <Telematic />
                </v-row>
            </v-window-item>
            <v-window-item value="sensor">
                <v-row class="mt-1">
                    <Sensor />
                </v-row>
            </v-window-item>
            <!-- <v-window-item value="service_history">
                <v-row class="mt-1">
                    <ServiceHistory />
                </v-row>
            </v-window-item>
            <v-window-item value="inspection_history">
                <v-row class="mt-1">
                    <InspectionHistory />
                </v-row>
            </v-window-item>
            <v-window-item value="work_orders">
                <v-row class="mt-1">
                    <WorkOrders />
                </v-row>
            </v-window-item>
            <v-window-item value="service_reminder">
                <v-row class="mt-1">
                    <ServiceReminder />
                </v-row>
            </v-window-item> -->
            <v-window-item value="tire_management">
                <v-row class="mt-1">
                    <TireManagement />
                </v-row>
            </v-window-item>
        </v-window>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from '@/stores/maintenance/assetStore';
import CostofOwnership from '@/components/maintenance/assetManagement/vehicle/CostofOwnership.vue'
import Specs from '@/components/maintenance/assetManagement/vehicle/Specs.vue'
import Financial from '@/components/maintenance/assetManagement/vehicle/Financial.vue'
import Telematic from '@/components/maintenance/assetManagement/vehicle/Telematic.vue'
import Sensor from '@/components/maintenance/assetManagement/vehicle/Sensor.vue'
import ServiceHistory from '@/components/maintenance/assetManagement/vehicle/ServiceHistory.vue'
import InspectionHistory from '@/components/maintenance/assetManagement/vehicle/InspectionHistory.vue'
import WorkOrders from '@/components/maintenance/assetManagement/vehicle/WorkOrders.vue'
import ServiceReminder from '@/components/maintenance/assetManagement/vehicle/ServiceReminder.vue'
import TireManagement from '@/components/maintenance/assetManagement/vehicle/TireManagement.vue'

const router = useRouter();
const route = useRoute()

const tab = ref(0)

const goToAssetList = () => {
    router.push('/maintenance/AssetListPage')
}


const assetStore = useAssetStore();
const { assetList, loading: loadingAssets } = storeToRefs(assetStore);

const assetDetail = computed(() => {
    return assetList.value.find((asset) => asset.id == parseInt(route.params.vehicleId as string))
})

const getStatusClass = (status: any) => {
    if (status === "Maintenance") {
        return 'green';
    } else if (status === "Active") {
        return 'primary';
    } else if (status === "Inactive") {
        return 'error';
    }
    return '';
}

const updateVehicleData = async (data: any) => {
    if (!assetDetail.value?.id) {
        return
    }
    let payload = data
    payload.id = assetDetail.value.id
    await assetStore.updateAsset(payload)
}
</script>