<template>
    <div>
        <IssueEditDialog :modelValue="issueEditDialog" :issue="selectedIssue"
            @update:modelValue="issueEditDialog = $event" @close="closeIssueEditDialog" @save="saveIssue" />

        <v-card v-if="selectedAsset?.latest_open_issues?.length > 0">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Issues</v-card-title>
                <v-btn color="primary" density="compact" variant="text" @click="AddIssue"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Issue
                </v-btn>
            </div>
            <v-card-text>
                <div>

                    <v-data-table :headers="tableHeaders" :items="selectedAsset.latest_open_issues">
                        <template v-slot:item.id="{ item }">
                            #{{ item.id }}
                        </template>

                        <template v-slot:item.source="{ item }">
                            {{ item.source }}
                        </template>


                        <template v-slot:item.status="{ item }">
                            <v-chip class="text-capitalize" density="compact" variant="flat"
                                v-if="typeof item.status === 'string' && (item.status !== '1' && item.status !== '0')"
                                :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:item.issue="{ item }">
                            <span>{{ item.issue ? `#${item.issue}` : 'N/A' }}</span>
                        </template>

                        <template v-slot:item.priority="{ item }">
                            <v-chip class="text-capitalize" density="compact"
                                v-if="typeof item.priority === 'string' && (item.priority !== '1' && item.status !== '0')"
                                :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
                            <span v-else></span>
                        </template>

                        <!-- Assignment -->
                        <template v-slot:item.assigned_to="{ item }">
                            <div v-for="(technician, index) in item.assigned_to_user" :key="index"
                                v-if="item.assigned_to_user">
                                <SharedTableDynamicTechnicianItem v-if="item.technician" :technician="technician" />
                                <span v-else>N/A</span>
                            </div>
                            <span v-else>N/A</span>
                        </template>

                        <template v-slot:item.reported_date="{ item }">
                            <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                                {{ new Date(item.reported_date).toLocaleDateString('en-US') }}
                                <v-tooltip activator="parent" location="top" location-strategy="connected">
                                    {{ getRelativeDateTime(item.reported_date) }}
                                </v-tooltip>
                            </span>
                        </template>
                    </v-data-table>
                </div>
            </v-card-text>
        </v-card>
        <v-card v-else height="160">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Issues</v-card-title>
                <v-btn color="primary" density="compact" variant="text" @click="AddIssue"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Issue
                </v-btn>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
                <p> There are no Open Issues for this Vehiclesss</p>
            </div>
        </v-card>
    </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import IssueEditDialog from '../../issue/issueManagement/IssueEditDialog.vue';
import moment from 'moment';

const props = defineProps({
    vehicleName: {
        type: String,
        required: true,
    },
    vehicleId: {
        type: Number,
        required: true,
    },
    issueIds: {
        type: Array<Number>,
        required: false
    }
});

const assetStore = useAssetStore();
const { selectedAsset, loading } = storeToRefs(assetStore);

const emit = defineEmits(['onSelection', 'update:issueIds'])

const issueStore = useIssueStore();

const issueEditDialog = ref(false);

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);

const closeIssueEditDialog = () => {
    issueEditDialog.value = false;
};

const saveIssue = async (issue: any) => {
    issueEditDialog.value = false;
    await issueStore.createIssue(issue);
    // await issueStore.fetchIssues(searchQuery.value);
}

const AddIssue = () => {
    selectedIssue.value = {} as Partial<Issues>;
    issueEditDialog.value = true;
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
    { title: 'Priority', key: 'priority' },
    { title: 'Issue ID', key: 'id' },
    { title: 'Status', key: 'status' },
    { title: 'Assigned', key: 'assigned_to' },
    { title: 'Due date', key: 'reported_date' },
];
</script>

<style scope></style>