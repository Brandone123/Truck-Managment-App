<template>
    <div class="flex-grow-1" style="overflow-y: auto; position: relative; height: 100vh;">
        <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-2">
                <v-card>
                    <v-card-title class="font-weight-bold">Fault Details</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">Date Reported</v-col>
                            <v-col cols="12" md="6">
                                <span style="cursor: pointer; border-bottom: 1px dotted;">
                                    {{ fault.date_reported }}
                                    <v-tooltip activator="parent" location="top" location-strategy="connected">
                                        {{ getRelativeDateTime(fault.date_reported) }}
                                    </v-tooltip>
                                </span>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Name</v-col>
                            <v-col cols="12" md="6">
                                {{ fault.name }}
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Vehicle</v-col>
                            <v-col cols="12" md="6">
                                <SharedTableDynamicVehicleItem :vehicle="fault.vehicle"
                                    v-if="fault.vehicle_id && fault.vehicle" />
                                <span v-else>N/A</span>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Fault Code</v-col>
                            <v-col cols="12" md="6">{{ fault.fault_code }}</v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Priority</v-col>
                            <v-col cols="12" md="6">
                                <v-chip density="compact" variant="flat" :color="getPriorityColor(fault.priority)">
                                    {{ fault.priority }}</v-chip>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Critical</v-col>
                            <v-col cols="12" md="6">{{ fault.critical ? 'Yes' : 'No' }}</v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Status</v-col>
                            <v-col cols="12" md="6">
                                <v-chip density="compact" variant="flat" :color="getStatusColor(fault.status)">
                                    {{ fault.status }}</v-chip>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
                <v-card>
                    <v-card-title class="font-weight-bold">Other Details</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">Issue</v-col>
                            <v-col cols="12" md="6">
                                <span v-if="fault.issue" @click="viewIssue(fault.issue_id as number)"
                                    style="cursor: pointer; border-bottom: 1px dotted;">
                                    <IssueMenu :issue="fault.issue" />
                                </span>
                                <span v-else>N/A</span>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Work Order</v-col>
                            <v-col cols="12" md="6">
                                <span class="text-secondary" v-if="(fault.issue?.work_order_id as number)"
                                    style="cursor: pointer; border-bottom: 1px dotted;"
                                    @click="viewWorkOrder(fault.issue?.work_order_id as number)">
                                    #{{ (fault.issue?.work_order_id as number) }}
                                </span>
                                <span v-else>N/A</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import type { Fault } from '@/types/maintenance/fault';
import { useRouter } from 'vue-router';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';

const router = useRouter();

const props = defineProps({
    fault: {
        type: Object as PropType<Fault>,
        required: true,
    },
    loadingDetails: {
        type: Boolean
    }
});

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open':
            return 'secondary';
        case 'resolved':
            return 'primary';
        case 'pending':
            return 'yellow';
        case 'ignored':
            return 'purple';
    }
}

const getPriorityColor = (status: string) => {
    switch (status) {
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
const getRelativeDateTime = (dateString: any) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diff = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}
const viewIssue = (issueId: number) => {
    router.push(`/maintenance/IssuesManagement/${issueId}`)
};

const viewWorkOrder = (workOrderId: number) => {
    router.push(`/maintenance/WorkOrders/${workOrderId}`)
};


</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}

.spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>