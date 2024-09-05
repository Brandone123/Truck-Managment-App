<template>
    <div style="font-family:Arial, Helvetica, sans-serif;" class="mt-0">
        <v-card class="rounded-0 mx-n4" style="position:sticky;top:48px;z-index:1; margin-top: -16px;">
            <v-divider></v-divider>
            <div class="d-flex justify-space-between mt-1 mb-4 py-2 px-2">
                <span>
                    <span style="cursor:pointer" class="text-primary text-h6"
                        @click="router.push('/maintenance/PartSupplyTrackingPage')">
                        <v-icon>mdi-chevron-left</v-icon> Part List</span>
                    <span class="text-ht text-grey"> / {{ partDetail?.part_number }}</span>
                </span>
                <div>
                    <v-btn v-if="tab != 'overview'" class="text-none" variant="outlined" density="comfortable"
                        @click="exportToCSV">
                        Export CSV
                    </v-btn>
                </div>
            </div>
            <!-- <v-row class="ml-1">
                <v-col cols="12">
                    <span class="d-flex">
                        <div class="d-flex">
                            <v-col cols="3">
                                <v-card class="grey-background text-center" height="80">
                                    <span></span>

                                </v-card>
                            </v-col>

                            <v-col cols="12">
                                <div class="justify-space-between">
                                    <span><strong>{{ partDetail?.part_number }}</strong></span>

                                </div>
                                <div style="font-size:x-small; color:grey;">
                                    <v-row>
                                        <v-col>Category</v-col>
                                        <v-col>Manufacturer</v-col>
                                        <v-col>Mfr_Part_Number</v-col>
                                        <v-col>UPC</v-col>
                                        <v-col>Unit_Cost</v-col>
                                    </v-row>
                                </div>
                                
                                <div style="font-size:x-small;">
                                    <v-row>
                                         <v-col class="text-weight-bold text-black">
                                            {{ partDetail?.category }}
                                        </v-col>
                                        <v-col class=" text-weight-bold text-black">
                                            {{ partDetail?.manufacturer ?  partDetail?.manufacturer : '---'}} 
                                        </v-col>
                                        <v-col class=" text-weight-bold text-black">
                                            {{partDetail?.manufacturer_part_number ? partDetail?.manufacturer_part_number : '---' }}
                                        </v-col>
                                        <v-col class=" text-weight-bold text-black">
                                            {{ partDetail?.UPC || '---'}}
                                        </v-col>
                                        <v-col class=" text-weight-bold text-black">
                                            ${{ partDetail?.unit_cost ? partDetail?.unit_cost : '---' }} {{ partDetail?.measurement_unit ? '/' + partDetail?.measurement_unit : ''}}
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                        </div>
                        <span class="ml-auto mr-3">
                            <v-btn color="primary">Edit <v-icon>mdi-pencil</v-icon></v-btn>
                        </span>
                    </span>
                </v-col>
            </v-row> -->

            <v-row>
                <v-tabs density="compact" v-model="tab" center-active color="primary" class="mb-3">
                    <v-tab value="overview" density="compact" class="text-body ml-5" style="text-transform:initial;">
                        Overview
                    </v-tab>
                    <v-tab value="inventory_activity" density="compact" style="text-transform: initial;">
                        Inventory Activity
                    </v-tab>
                    <v-tab value="work_order" density="compact" style="text-transform: initial;">
                        Work Order Activity
                    </v-tab>
                    <v-tab value="purchase_history" density="compact" style="text-transform: initial;">
                        Purchase History
                    </v-tab>
                </v-tabs>
            </v-row>
        </v-card>

        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="overview">
                <v-row class="mt-1">
                    <PartOverview :partDetail="partDetail" />
                </v-row>
            </v-window-item>
            <v-window-item value="inventory_activity">
                <v-row class="mt-1">
                    <!-- <InventoryLevelsTable :inventoryItems="inventoryItem"/> -->
                    <InventoryActivities :partId="partNumber" :headers="InventoryActivitiesHeaders" />
                </v-row>
            </v-window-item>
            <v-window-item value="work_order">
                <v-row class="mt-1">
                    <WorkOrderHistoryTable :partId="partNumber" :headers="workOrderHistoryHeaders" />
                </v-row>
            </v-window-item>
            <v-window-item value="purchase_history">
                <v-row class="mt-1">
                    <PurchaseHistoryTable :partId="partNumber" :headers="purchaseHistoryHeaders" />
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
import PartOverview from '@/components/maintenance/inventory/parts/PartOverview.vue'
import InventoryLevelsTable from '~/components/maintenance/inventory/levels/InventoryLevelsTable.vue';
import PurchaseHistoryTable from '~/components/maintenance/inventory/levels/PurchaseHistoryTable.vue';
import WorkOrderHistoryTable from '~/components/maintenance/inventory/levels/WorkOrderHistoryTable.vue';
import InventoryActivities from '~/components/maintenance/inventory/levels/InventoryActivities.vue';
import { convertToCSV, downloadCSVFile } from "~/composables/exportCSV";

const router = useRouter();
const route = useRoute()

const employeeStore = useEmployeeStore();

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore);

const partHistoryStore = usePartHistoryStore();
const { purchaseHistory } = storeToRefs(partHistoryStore);

const { workOrderHistory } = storeToRefs(partHistoryStore);

const { inventoryActivity } = storeToRefs(partHistoryStore);

onMounted(() => {
    employeeStore.fetchEmployeeList();
})

const tab = ref('overview')

const purchaseHistoryHeaders = ref([
    { title: 'Purchase Id', key: 'id' },
    { title: 'Quantity Ordered', key: 'quantity_ordered' },
    { title: 'Unit Cost', key: 'unit_cost' },
    { title: 'Subtotal', key: 'subtotal' },
    { title: 'Status', key: 'status' },
    { title: 'Created At', key: 'created_at' },
    // { title: 'Created by', key: 'created_by' }
]);

const workOrderHistoryHeaders = ref([
    { title: 'Work Order ID', key: 'id' },
    { title: 'Quantity Ordered', key: 'qte' },
    { title: 'Unit Cost', key: 'unit_cost' },
    { title: 'Subtotal', key: 'subtotal' },
    // { title: 'Status', key: 'status' },
    // { title: 'Created At', key: 'created_at' }
]);

const InventoryActivitiesHeaders = ref([
    // { title: 'Activity ID', key: 'id' },
    { title: 'Activity Type', key: 'reason' },
    { title: 'Quantity', key: 'quantity' },
    { title: 'Total Quantity', key: 'total_quantity' },
    { title: 'Part Location', key: 'location_id' },
    { title: 'Created By', key: 'created_by' },
    // { title: 'Unit Cost', key: 'unit_cost' },
    // { title: 'Subtotal', key: 'subtotal' },
    // { title: 'Part ID', key: 'part_id' },
    { title: 'Created At', key: 'created_at' }
]);



const partDetail = computed(() => {
    return partSupplies.value.find((part) => part.id == parseInt(route.params.partId as string))
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

const partNumber = computed(() => {
    return partDetail.value?.id as number;
});

const exportWorkOrderActivity = () => {
    const csvData = convertToCSV(workOrderHistory.value, workOrderHistoryHeaders.value, false);
    let timestamp = new Date().toISOString();
    downloadCSVFile(csvData, `workorder_histoty_${timestamp}` + ".csv");
}

const exportPurchaseActivity = () => {
    const csvData = convertToCSV(purchaseHistory.value, purchaseHistoryHeaders.value, false);
    let timestamp = new Date().toISOString();
    downloadCSVFile(csvData, `purchase_histoty_${timestamp}` + ".csv");

}

const exportInventoryActivity = () => {
    const csvData = convertToCSV(inventoryActivity.value, InventoryActivitiesHeaders.value, false);
    let timestamp = new Date().toISOString();
    downloadCSVFile(csvData, `inventory_histoty_${timestamp}` + ".csv");

}

const exportToCSV = () => {
    switch (tab.value) {
        case 'inventory_activity':
            exportInventoryActivity();
            break;
        case 'work_order':
            exportWorkOrderActivity();
            break;
        case 'purchase_history':
            exportPurchaseActivity();
            break;

    }
}

const updatePartData = async (data: any) => {
    if (!partDetail.value?.id) {
        return
    }
    let payload = data
    payload.id = partDetail.value.id
    await partsAndSuppliesStore.updatePartSupply(payload)
}
</script>