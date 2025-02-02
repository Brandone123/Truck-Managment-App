<template>
    <div>
        <WorkOrderEditDialog :modelValue="workOrderEditDialog" :workOrder="selectedWorkOrder"
            :vehicleId="(selectedWorkOrder.vehicle_id as number)" @update:modelValue="workOrderEditDialog = $event"
            @close="closeWorkOrderEditDialog" @save="saveWorkOrder" />
        <v-card class="mt-3" v-if="selectedAsset?.latest_incomplete_work_orders?.length > 0">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Incomplete WorkOrder</v-card-title>
                <v-btn variant="text" density="compact" color="primary" @click="addWorkOrder"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add WorkOrder
                </v-btn>
            </div>
            <v-card-text>
                <v-data-table :headers="tableHeaders" :items="selectedAsset.latest_incomplete_work_orders">
                    <template v-slot:item.id="{ item }">
                        #{{ item.id }}
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-chip class="text-capitalize" density="compact" variant="flat"
                            v-if="typeof item.status === 'string' && (item.status !== '1' && item.status !== '0')"
                            :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                    </template>

                    <template v-slot:item.priority="{ item }">
                        <v-chip class="text-capitalize" density="compact"
                            v-if="typeof item.priority === 'string' && (item.priority !== '1' && item.status !== '0')"
                            :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
                        <span v-else></span>
                    </template>

                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card height="170" v-else class="mt-3">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Incomplete WorkOrder</v-card-title>
                <v-btn variant="text" density="compact" color="primary" @click="addWorkOrder"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add WorkOrder
                </v-btn>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
                <p>There are no Work Orders active for this Vehicle</p>
            </div>
        </v-card>
    </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { WorkOrder } from '~/types/maintenance/workOrder';
import WorkOrderEditDialog from '../../management/workOrder/WorkOrderEditDialog.vue';
import moment from 'moment';

// const props = defineProps({
// });


const emit = defineEmits(['onSelection', 'update:workOrderIds'])

const workOrderStore = useWorkOrderStore();

const assetStore = useAssetStore();
const { selectedAsset, loading } = storeToRefs(assetStore);


const workOrderEditDialog = ref(false);

const selectedWorkOrder = ref<Partial<WorkOrder>>({} as Partial<WorkOrder>);

const saveWorkOrder = async (workOrder: any) => {
    workOrderEditDialog.value = false;
    await workOrderStore.createWorkOrder(workOrder);
    // await workOrderStore.fetchWorkOrders(searchQuery.value);
}

const closeWorkOrderEditDialog = () => {
    workOrderEditDialog.value = false;
};
const addWorkOrder = () => {
    selectedWorkOrder.value = {} as Partial<WorkOrder>;
    workOrderEditDialog.value = true;
}

const getRelativeDateTime = (dateString: any) => {
    return moment(dateString).from(moment());
}

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'open':
            return 'primary';
        case 'in progress':
            return 'secondary';
        case 'closed':
            return 'gray';
    }
}

const getPriorityColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'low':
            return 'grey';
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
    { title: 'WorkOrder ID', key: 'id' },
    { title: 'Status', key: 'status' },
    // { title: 'Assigned', key: 'assigned_to' },
    // { title: 'Vehicle', key: 'vehicle_id' },
    { title: 'Due date', key: 'expected_completion_date' },
];
</script>

<style scope></style>