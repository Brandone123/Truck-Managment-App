<template>
    <div>
        <FaultEditDialog :modelValue="faultEditDialog" :fault="selectedFault"
            @update:modelValue="faultEditDialog = $event" @close="closeFaultEditDialog" @save="saveFault" />

        <v-card v-if="selectedAsset?.latest_critical_faults?.length > 0" class="mt-3">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary"> Critical Faults</v-card-title>
                <v-btn density="compact" variant="text" color="primary" @click="addFault"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Fault
                </v-btn>
            </div>
            <v-card-text>
                <v-data-table color="primary" :headers="tableHeaders" :items="selectedAsset!.latest_critical_faults"
                    :loading="loading">
                    <template v-slot:item.id="{ item }">
                        #{{ item.id }}
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getStatusColor(item.status)"> {{ item.status }} </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card height="170" v-else class="mt-3">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary"> Critical Faults</v-card-title>
                <v-btn density="compact" variant="text" color="primary" @click="addFault"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Fault
                </v-btn>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
                <p>There are no Critical Faults for this Vehicle</p>
            </div>
        </v-card>
    </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import FaultEditDialog from '../../issue/fault/FaultEditDialog.vue';
import moment from 'moment';
import type { Fault } from '~/types/maintenance/fault';

// const props = defineProps({
// });


const emit = defineEmits(['onSelection', 'update:faultIds'])
const faultStore = useFaultStore();
// const { faults, loading, pagination: faultPagination, total_items, faultSummary, notifications, chartData } = storeToRefs(faultStore);

const assetStore = useAssetStore();
const { selectedAsset, loading } = storeToRefs(assetStore);
const hoveredRow = ref<number | null>(null)

const faultEditDialog = ref(false);

const selectedFault = ref<Partial<Fault>>({} as Partial<Fault>);

const saveFault = async (fault: any) => {
    faultEditDialog.value = false;
    await faultStore.createFault(fault);
}

const closeFaultEditDialog = () => {
    faultEditDialog.value = false;
};

const addFault = () => {
    selectedFault.value = {} as Partial<Fault>;
    faultEditDialog.value = true;
}

const getRelativeDateTime = (dateString: any) => {
    return moment(dateString).from(moment());
}

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'passed':
            return 'primary';
        case 'medium':
            return 'orange';
        case 'high':
            return 'error';
        case 'no priority':
            return 'gray';
        default:
            return 'gray';
    }
}

const tableHeaders = [
    { title: 'Code', key: 'fault_code' },
    { title: 'Critical', key: 'critical' },
    { title: 'Name', key: 'name' },
    { title: 'Description', key: 'description' },
    { title: 'Last Occured Date', key: 'date_reported' },
    // { title: 'Status', key: 'status' },
    { title: 'Issue', key: 'issue_id' },
];
</script>

<style scope></style>