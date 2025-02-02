<template>
    <v-row>
        <v-col :cols="showSidePanel ? 12 : 6">
            <v-card>
                <v-card-title class="font-weight-bold text-primary"> Details</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Issue </v-col>
                        <v-col cols="12" md="6">#{{ issue.id }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Status</v-col>
                        <v-col cols="12" md="6">
                            <v-chip class="text-capitalize"
                                v-if="typeof issue.status === 'string' && (issue.status !== '1' && issue.status !== '0')"
                                density="compact" variant="flat" :color="getStatusColor(issue.status as string)">{{
                                    issue.status }}
                            </v-chip>
                            <span v-else></span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Vehicle</v-col>
                        <v-col cols="12" md="6" class="text-secondary">
                            <SharedTableDynamicVehicleItem :vehicle="issue.asset" v-if="issue.asset" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Summary</v-col>
                        <v-col cols="12" md="6">{{ issue.summary }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Reported Date</v-col>
                        <v-col cols="12" md="6">
                            <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                                {{ formatReportedDate(issue.reported_date) }}
                                <v-tooltip activator="parent" location="top" location-strategy="connected">
                                    {{ getRelativeDateTime(issue.reported_date) }}
                                </v-tooltip>
                            </span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Reported By</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicTechnicianItem v-if="issue.reported_by_user"
                                :technician="issue.reported_by_user" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Odometer</v-col>
                        <v-col cols="12" md="6">{{ issue.meter ? issue.meter : "N/A"
                            }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Priority</v-col>
                        <v-col cols="12" md="6"><v-chip density="compact" v-if="issue.priority"
                                :color="getPriorityColor(issue.priority as string)">{{
                                    issue.priority
                                }}</v-chip>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Source</v-col>
                        <v-col cols="12" md="6">{{ issue.source ? issue.source : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Assigned To</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicTechnicianItem v-if="issue.assigned_to_user"
                                :technician="issue.assigned_to_user"
                                style="cursor: pointer; border-bottom: 1px dotted;" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Due Date</v-col>
                        <v-col cols="12" md="6">{{ issue.due_date ? issue.due_date : "N/A" }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">Due Odometer</v-col>
                        <v-col cols="12" md="6">{{ issue.due_meter ? issue.due_meter + '/mi' : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Decription</v-col>
                        <v-col cols="12" md="6">{{ issue.description ? issue.description : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Watchers</v-col>
                        <v-col cols="12" md="6">
                            <span v-if="issue.watching_employees && issue.watching_employees?.length > 0"
                                v-for="(watcher, index) in issue.watching_employees" :key="index" class="pb-2">
                                <SharedTableDynamicTechnicianItem :technician="watcher" class="mb-1" />
                            </span>
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
            <v-card>
                <v-card-title class="d-flex justify-space-between">
                    <span class="text-h7 font-weight-bold text-primary">Resolution Details</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Resolved Date</v-col>
                        <v-col cols="12" md="6">{{ issue.resolved_on ?new Date(issue.resolved_on).toLocaleDateString('en-US') : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Resolved By</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicTechnicianItem v-if="issue.resolved_by_user"
                                :technician="issue.resolved_by_user" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Time to Resolve</v-col>
                        <v-col cols="12" md="6">{{ issue.due_date ? new Date(issue.due_date).toLocaleDateString('en-US') : 'N/A' }}</v-col>
                    </v-row>
                    <!-- <v-divider class="my-3"></v-divider> -->
                    <!-- <v-row>
                        <v-col cols="12" md="6">Miles to Resolve</v-col>
                        <v-col cols="12" md="6">
                            {{ issue.resolved_meter_variance ? issue.resolved_meter_variance + '/'
                                + issue.resolved_meter_variance_unit : 'N/A' }}
                        </v-col>
                    </v-row> -->
                </v-card-text>
            </v-card>
            <v-card v-if="issue?.timeline?.length > 0" class="mt-3">
                <v-card-title class="text-h7 font-weight-bold text-primary">Timeline</v-card-title>
                <v-card-text>
                    <v-timeline v-for="item in issue.timeline" :key="item.id" class="custom-timeline" density="compact"
                        side="end">
                        <v-timeline-item class="mb-12" dot-color="grey" size="large" fill-dot>
                            <template v-slot:icon>
                                <span>{{ gettInitials(item?.employee?.full_name) }}</span>
                            </template>
                            <span class="font-weight-bold mr-2">{{ item?.employee?.full_name }}</span><span
                                class="text-caption">{{
                                    item?.description }}</span>
                            <div class="text-primary mt-2">{{ item.activity_type }}</div>
                        </v-timeline-item>
                        <!--  
                        <v-timeline-item class="mb-12" dot-color="#e69120" size="small" fill-dot>
                            <template v-slot:icon>
                                <v-icon size="small">mdi-alert-outline</v-icon>
                            </template>
                            <div class="d-flex justify-space-between fill-width">
                                <span class="flex-grow-1">
                                    <span class="font-weight-bold mr-2">Issue Opened</span><span class="text-caption">by
                                        Samara
                                        DVIR</span>
                                </span>
                                <span class="text-caption">29d</span>
                            </div>
                        </v-timeline-item> -->
                    </v-timeline>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import type { Issues, ActivityLog } from '@/types/maintenance/issue';

const props = defineProps({
    issue: {
        type: Object as PropType<Partial<Issues>>,
        required: true,
        default: {} as Issues
    },
    vehicleId: {
        type: Number,
        required: true,
    },
    loadingDetails: {
        type: Boolean
    },
    showSidePanel: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'save']);

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

function gettInitials(str: string) {
    if (!str) return '';

    // Split the string into words
    const words = str.trim().split(/\s+/);

    // Get the first initial of the first two words
    const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());

    // Join the initials together
    return initials.join('');
}
const localIssueActivityLog = ref<Partial<ActivityLog>>(JSON.parse(JSON.stringify(props.issue.activityLog || {})) as Partial<ActivityLog>)

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'open':
            return 'primary';
        case 'in progress':
            return 'secondary';
        case 'closed':
            return 'cyan';
        case 'resolved':
            return 'green';
        default:
            return '';
    }
};

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
const formatReportedDate = (date: any) => {
    const reportedDate = new Date(date);
    return `${reportedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} 
  ${reportedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

watch(props.issue, (newVal, oldVal) => {
    localIssueActivityLog.value = newVal.activityLog || {} as ActivityLog
})

</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}

.custom-timeline :deep(.v-timeline--item__body) {
    width: 100%;
}

.custom-tr :deep() td {
    border-bottom: transparent !important;
}
</style>