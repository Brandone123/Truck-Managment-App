<template>
    <div style="font-family:Arial, Helvetica, sans-serif;" class="mt-0">
        <v-card class="rounded-0 mx-n4" style="position:sticky;top:48px;z-index:1; margin-top: -16px;">
            <v-divider></v-divider>
            <div class="d-flex justify-space-between mt-1 mb-4">
                <span>
                    <span style="cursor:pointer" class="text-primary text-h6"
                        @click="router.push('/maintenance/ServicePrograms')">
                        <v-icon>mdi-chevron-left</v-icon> Part List</span>
                    <span class="text-ht text-grey"> / {{ programDetail?.id }}</span>
                </span>
                <div>

                </div>
            </div>
            <v-row class="ml-1">
                <v-col cols="12">
                    <div class="d-flex" style="align-items: center;">
                        <div>
                        <div class="rounded position-relative"
                            style="display: flex; justify-content: center; align-items: center; width: 70px; height: 70px; background-color: grey; color: white; text-align: center; position: relative;">
                            <span style="font-size:large;" v-if="programDetail?.program_name">{{
                            programDetail?.program_name.slice(0, 3).toUpperCase() }}</span>
                            <span v-else style="font-size:xx-small;">PRO</span>
                        </div>
                        </div>
                        <div>
                        <span class=" ml-2"
                            style="justify-content: center; align-items: center;text-align: center;">
                            {{ programDetail?.program_name }}
                        </span>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-tabs density="compact" v-model="tab" center-active color="primary" class="mb-3 ml-5">
                    <v-tab value="vehicle" density="compact" style="text-transform: initial;">
                        Vehicles
                        <v-chip density="compact" class="ml-1 bg-secondary"> {{ programDetail?.subscribed_vehicles.length }}</v-chip>
                    </v-tab>
                    <v-tab value="overview" density="compact" class="text-body ml-5" style="text-transform:initial;">
                        Service Schedules
                        <v-chip density="compact" class="ml-1 bg-secondary">{{ programDetail?.subscribed_tasks.length }}</v-chip>
                    </v-tab>
                    
                </v-tabs>
            </v-row>
        </v-card>

        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="vehicle">
                <v-row class="mt-1">
                    <SharedUiCustomTable :showFooterInHead="false" :headers="assetHeaders" :items="getMatchingVehicles">
                        <template v-slot:item.name="{ item }">
                            <div class="d-flex" style="justify-content: center; align-items: center;">
                                <div class="rounded position-relative mr-1"
                                style="justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                <span style="font-size:xx-small;" v-if="item.type">{{ item.type.slice(0, 3).toUpperCase() }}</span>
                                <span v-else style="font-size:xx-small;">VHI</span>
                                </div>
                                <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="viewVehicleDetails(item.name)">
                                {{ item.name }}
                                </span>
                            </div>
                        </template>
                        <template v-slot:item.subscription_date="{ item }">
                            <span v-if="programDetail?.subscribed_vehicles" v-for="(date) in programDetail?.subscribed_vehicles">
                                {{ date.subscription_date }}</span>
                        </template>
                    </SharedUiCustomTable>
                </v-row>
            </v-window-item>
            <v-window-item value="overview">
                <v-row class="mt-1">
                    <SharedUiCustomTable :showFooterInHead="false" :headers="serviceTaskHeaders" :items="getMatchingTask"> 
                        <template v-slot:item.intervals="{ item }"> 
                            <span v-if="programDetail?.subscribed_tasks" v-for="(meter) in programDetail?.subscribed_tasks"> 
                                <span v-if="meter.time_interval && meter.primary_meter_due_soon_threshhold"> 
                                    Every {{ meter.time_interval }} 
                                    {{ meter.time_interval_duration }} or 
                                    {{ meter.primary_meter_due_soon_threshhold * meter.time_interval }} miles
                                    </span>
                            </span> 
                        </template> 
                    </SharedUiCustomTable>
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
import Specs from '@/components/maintenance/assetManagement/vehicle/Specs.vue'
import Financial from '@/components/maintenance/assetManagement/vehicle/Financial.vue'
import Telematic from '@/components/maintenance/assetManagement/vehicle/Telematic.vue'
import Sensor from '@/components/maintenance/assetManagement/vehicle/Sensor.vue'
import InventoryLevelsTable from '~/components/maintenance/inventory/levels/InventoryLevelsTable.vue';
import type { Asset } from '~/types/maintenance/assetTypes';

const router = useRouter();
const route = useRoute()

const tab = ref(route.query.tab || 0)

const serviceProgramStore = useServiceProgramStore();
const { servicePrograms } = storeToRefs(serviceProgramStore);

const assetStore = useAssetStore();
const { assetList} = storeToRefs(assetStore);

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const programDetail = computed(() => {
    return servicePrograms.value.find((part) => part.id == parseInt(route.params.programId as string))
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

const updatePartData = async (data: any) => {
    if (!programDetail.value?.id) {
        return
    }
    let payload = data
    payload.id = programDetail.value.id
    await serviceProgramStore.updateServiceProgram(payload)
}

const assetHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Year', key: 'year' },
  { title: 'Make', key: 'make' },
  { title: 'Type', key: 'type' },
  { title: 'VIN', key: 'vin' },
  { title: 'Make', key: 'make' },
  { title: 'Model', key: 'model' },
  { title: 'Date Added', key: 'subscription_date' },
];

const serviceTaskHeaders = [
  { title: 'Intervals', key: 'intervals' },
  { title: 'Service Task', key: 'name' },
];

const viewVehicleDetails = (vehicleId: number) => {
  router.push(`/maintenance/AssetListPage/details/${vehicleId}`)
}

const getMatchingVehicles = computed(() => {
  if (!assetList.value || !programDetail.value?.subscribed_vehicles) {
    return [];
  }

  const subscribed_vehicle_ids = programDetail.value?.subscribed_vehicles.map(v => v.id);
  const matchingVehicles = assetList.value.filter(vehicle => subscribed_vehicle_ids.includes(vehicle.id));

  return matchingVehicles;
})

const getMatchingTask = computed(() => {
  if (!serviceTaskList.value || !programDetail.value?.subscribed_tasks) {
    return [];
  }

  const subscribed_task_ids = programDetail.value?.subscribed_tasks.map(v => v.service_tasks[0]);
  const matchingTask = serviceTaskList.value.filter(task => subscribed_task_ids.includes(task.id as number));

  return matchingTask;
})

</script>