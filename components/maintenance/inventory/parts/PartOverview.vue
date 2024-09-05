<template>
    <v-col cols="12" sm="6">
        <div>
            <v-card>
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Details</v-card-title>
                    </span>
                </div>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Part Number</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.part_number ? partDetail?.part_number : '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Category</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.category ? partDetail?.category : '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Manufacturer</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.manufacturer ? partDetail?.manufacturer : '---'
                            }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Manufacturer Part Number</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.manufacturer_part_number ?
                            partDetail?.manufacturer_part_number : '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">UPC</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.UPC ? partDetail?.UPC : '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Unit Cost</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.unit_cost ? '$' + partDetail?.unit_cost : '---'
                            }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Measurement Unit</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.measurement_unit ? partDetail?.measurement_unit :
                            '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Description</v-col>
                        <v-col cols="12" md="6">{{ partDetail?.description ? partDetail?.description : '---' }}</v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- <v-card height="300" class="mt-5">
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Purchase History</v-card-title>
                    </span>
                    <div class="ml-auto mr-1 mt-3">
                        <v-btn color="primary" density="comfortable" variant="tonal">Add Vendor</v-btn>
                        <v-btn class="ml-1" color="primary" density="comfortable" variant="tonal">View All</v-btn>
                    </div>
                </div>
                <div>
                    <v-table v-if="partDetail?.purchase_history">
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Price</th>
                                <th>Date Ordered</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ven, i) in partDetail?.purchase_history" :key="i">
                                <td>{{ ven.name }}</td>
                                <td>${{ ven.price }}</td>
                                <td>{{ ven.date_ordered }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card> -->
<!-- 
            <v-card height="300" class="mt-5">
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Inventory Activity</v-card-title>
                    </span>
                    <div class="ml-auto mr-1 mt-3">
                        <v-btn color="primary" density="comfortable" variant="tonal">View All</v-btn>
                    </div>
                </div>
            </v-card>

            <v-card height="300" class="mt-5">
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Work Order Activity</v-card-title>
                    </span>
                    <div class="ml-auto mr-1 mt-3">
                        <v-btn color="primary" density="comfortable" variant="tonal">View All</v-btn>
                    </div>
                </div>
            </v-card> -->
        </div>
    </v-col>

    <v-col cols="12" sm="6">
        <v-card style="overflow-y:auto;">
            <div class="d-flex">
                <span>
                    <v-card-title class="text-h7 font-weight-bold text-primary">Location</v-card-title>
                </span>
                <div class="ml-auto mr-1 mt-3">
                    <v-btn color="primary" density="comfortable" variant="tonal">Manage</v-btn>
                </div>
            </div>
            <v-card-text>
                <div class="rounded pa-2" style="border: 1px solid silver;"
                    v-for="(location, index) in partDetail?.locations">

                    <div class="d-flex mt-1">
                        <div>
                            <span class="text-secondary font-weight-bold text-h6">{{
                                getLocationName(location.location_id) }}</span>
                        </div>
                        <div class="d-flex ml-auto">
                            <span class="rounded pa-1 watch" style="border: 1px solid silver;cursor: pointer;">
                                <v-icon style="font-size:medium">mdi-bell-outline</v-icon> Watch
                            </span>
                            <span class="clickable-block rounded d-flex align-center ml-2">
                                <span class="icon-container add-to-cart">
                                    <v-icon style="font-size:medium" class="hover-add-to-cart">mdi-cart-plus</v-icon>
                                </span>
                                <span class="separator"></span>
                                <span class="icon-container show-options">
                                    <v-icon style="font-size:medium"
                                        class="hover-show-options">mdi-dots-horizontal</v-icon>
                                </span>
                            </span>
                        </div>
                    </div>

                    <v-row class="mt-5">
                        <v-col cols="12" sm="3">
                            <span
                                style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                Current Qte</span>
                            <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity ? location.quantity : '0' }}
                            </div>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <span
                                style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                Reoder Point</span>
                            <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.reorder_point ?
                                location.reorder_point : '---' }}</div>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <span
                                style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                Pending PO Qte</span>
                            <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity_PO ? location.quantity_PO :
                                'N/A' }}</div>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <span
                                style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                WO Current Qte</span>
                            <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity_WO ? location.quantity_WO :
                                'N/A' }}</div>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PartSupply } from '@/types/maintenance/partSupplyTypes';
import 'apexcharts/dist/apexcharts.css';

const props = defineProps({
    partDetail: {
        type: Object as PropType<Partial<PartSupply>>,
        require: true,
    }
})

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const getLocationName = (locationId: number) => {
    return partLocations.value?.find(location => location.id == locationId)?.name
}

</script>

<style scoped>
.clickable-block {
    border: 1px solid silver;
    cursor: pointer;
    transition: background-color 0.3s;
}

.separator {
    width: 1px;
    height: 32px;
    background-color: silver;
}

.icon-container {
    display: flex;
    align-items: center;
    padding: 8px 8px;
    transition: background-color 0.3s; 
}


.icon-container.add-to-cart:hover {
    background-color: #e2e4e2;
}

.watch:hover {
    background-color: #f2f5f2;
}

.icon-container.show-options:hover {
    background-color: #e2e4e2;
}
</style>