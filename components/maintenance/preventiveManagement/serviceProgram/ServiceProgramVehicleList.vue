<template>
    <SharedUiCustomTable show-select v-model="selectedVehicleIds" :showFooterInHead="false" :headers="assetHeaders"
        :items="getMatchingVehicles" :loading="loadingDetail" @hoveredRow="hoveredRow = $event;">
        <template v-slot:bulkActions="{ selectedItems }">
            <div class="d-inline-flex">
                <v-btn density="comfortable" color="error" prepend-icon="mdi-delete"
                    @click="bulkDeleteVehicles">Delete</v-btn>
            </div>
        </template>
        <template v-slot:item.name="{ item }">
            <div class="d-flex align-center">
                <div class="rounded position-relative mr-1 justify-center align-center text-center"
                    style="width: 28px; height: 28px; background-color: grey; color: white;position: relative;">
                    <span style="font-size:xx-small;" v-if="item.type">{{ item.type.slice(0,
                        3).toUpperCase() }}</span>
                    <span v-else style="font-size:xx-small;">VHI</span>
                </div>
                <span style="cursor: pointer;" class="text-primary font-weight-bold" dense
                    @click="viewVehicleDetails(item.name)">
                    {{ item.name }}
                </span>
            </div>
        </template>
        <template v-slot:item.pivot.subscribed_date="{ item }">
            {{ formatDate(item.pivot.subscribed_date) }}
        </template>
        <template v-slot:item.last_service_mileage="{ item }">
            {{ item.pivot.last_service_mileage }} {{ selectedProgram.primary_meter_utilization }}
        </template>
        <template v-slot:item.actions="{ item, index }">
            <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
                <v-list-item @click="detachProgramVehicle(item)" color="red" append-icon="mdi-eye">Detach</v-list-item>
            </SharedTableActionMenu>
        </template>
    </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const props = defineProps({
    getMatchingVehicles: {
        type: Array as PropType<any>,
        required: true,
    },
    loadingDetail: {
        type: Boolean,
        default: false,
    },
    currentProgramId: {
        type: Object as any,
        required: true
    },
    selectedProgram: {
        type: Object as any,
        required: true
    },
});
const serviceProgramStore = useServiceProgramStore();
const layoutStore = useLayoutStore();
const hoveredRow = ref<number | null>(null)

const selectedVehicleIds = ref<number[]>([]);

watch(() => selectedVehicleIds.value, (newVal) => {
    console.log(newVal)
})

const viewVehicleDetails = (vehicleId: number) => {
    router.push(`/maintenance/AssetListPage/${vehicleId}`)
}

const bulkDeleteVehicles = async () => {
    const { confirm } = await layoutStore.showConfirmDialog("Proceed to delete selected vehicles from this service program ?");
    if (confirm) {
        const payload = { vehicle_ids: selectedVehicleIds.value }
        selectedVehicleIds.value = []
        await serviceProgramStore.bulkDetachVehicles(props.currentProgramId as number, payload);
        serviceProgramStore.fetchProgramId(props.currentProgramId as number);
    }
}

const detachProgramVehicle = async (item: any) => {
    const { confirm } = await layoutStore.showConfirmDialog("Proceed to detach this vehicle ?");
    if (confirm) {
        await serviceProgramStore.detachVehicle(props.currentProgramId as number, item.id);
        serviceProgramStore.fetchProgramId(props.currentProgramId as number);
    }
};

const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};
const assetHeaders = [
    { title: 'Name', key: 'name' },
    { title: 'Year', key: 'year' },
    { title: 'Make', key: 'make' },
    { title: 'Type', key: 'type' },
    { title: 'VIN', key: 'vin' },
    { title: 'Make', key: 'make' },
    { title: 'Model', key: 'model' },
    { title: 'Date Added', key: 'pivot.subscribed_date' },
    { title: 'Last Service Date', key: 'pivot.last_service_date' },
    { title: 'Last Mileage', key: 'pivot.last_service_mileage' },
    { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

</script>