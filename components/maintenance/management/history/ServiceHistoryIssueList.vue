<template>
    <div>

        <v-tabs v-model="selectedTab" background-color="transparent">
            <v-tab v-for="tab in tabs" :value="tab.value" density="compact">
                {{ tab.title }}
            </v-tab>
        </v-tabs>

        <v-window v-model="selectedTab" style="overflow:visible;">
            <v-window-item v-for="tab in tabs" :value="tab.value">
                <v-card-text>
                    <v-data-table color="primary" :item-selectable="isItemSelectable" v-model="selectedIssues"
                        item-value="id" :show-select="tab.value == 'open'" :headers="tableHeaders"
                        :items="getFilteredIssueServiceHistory(tab.value)" :loading="loading">
                        <template v-slot:item.status="{ item }">
                            <v-chip :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:item.priority="{ item }">
                            <v-chip :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
                        </template>
                        <template v-slot:item.assigned_to="{ item }">
                            <span>{{ item.assigned_to ? getTechnicianName(item.assigned_to) : 'N/A' }}</span>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-window-item>
        </v-window>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import type { filterItem } from '~/types/layout/table';
import { FALSE } from 'sass';


const props = defineProps({
    vehicleId: {
        type: Number,
        required: true,
    },
    selected: {
        type: Array<Number>,
        reqired: false,
        default: () => []
    },
    serviceHistoryId: {
        type: Number,
        required: true,
    }
});

const emit = defineEmits(['onSelection'])

// const techniciansStore = useTechniciansStore();
// const technicians = computed(() => techniciansStore.technicians);
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const issueStore = useIssueStore();
const { issueList, loading } = storeToRefs(issueStore)

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);


const getIssueServiceHistory = computed(() => {
    const issues = issueList.value

    return issues;
})

const getVehicleName = (vehicleId: any) => {
    const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
    return vehicleName ? vehicleName.name : ''
}

const isItemSelectable = (item: any) => {
    return item.work_order_id == null || item.work_order_id == props.serviceHistoryId
}

const selectedTab = ref('Open');
const tabs = [
    { title: 'Open', value: 'open' },
    { title: 'Resolved', value: 'resolved'},
    { title: 'Closed', value: 'closed' }
];


const selectedIssues = ref<Number[]>(props.selected)

watch(selectedIssues, (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.selected)) {
        emit('onSelection', newVal)
    }
})

watch(() => props.selected, (newVal) => {
    selectedIssues.value = newVal
})

const getFilteredIssueServiceHistory = (tab: string) => {
    return getIssueServiceHistory.value.filter((issue) => issue.status === tab && issue.asset_name === getVehicleName(props.vehicleId));
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open':
            return 'primary';
        case 'Overdue':
            return 'secondary';
        case 'Closed':
            return 'gray';
        case 'Resolved':
            return 'green';
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
    { title: 'Issue ID', key: 'id' },
    // { title: 'Vehicle', key: 'asset_name' },
    { title: 'Priority', key: 'priority' },
    { title: 'Date Reported', key: 'reported_date' },
    { title: 'Source', key: 'source' },
    { title: 'Status', key: 'status' },
    { title: 'Assigned Technician', key: 'assigned_to' },
];

const getTechnicianName = (technicianId: any) => {
    const technicianName = technicians.value.find((technician) => technician.id === technicianId)
    return technicianName ? technicianName.full_name : '';
}

</script>

<style scope>
.watchers-tooltip-trigger {
    cursor: pointer;
}

.watchers-tooltip-divider {
    border-bottom: 1px dotted #ccc;
    margin-top: 8px;
}

.v-data-table .v-input--selection-controls__ripple {
    color: var(--v-primary-base);
}
</style>