<template>
    <v-row>
        <v-col :cols="showSidePanel ? 12 : 5">
            <v-card>
                <v-card-title class="font-weight-bold">Details</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Vehicle</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicVehicleItem :vehicle="serviceReminder.vehicle" />
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <!-- 
                    <v-row>
                        <v-col cols="12" md="6">Operator</v-col>
                        <v-col cols="12" md="6">
                            {{ serviceReminder.operator ? serviceReminder.operator : '---' }}
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider> -->

                    <v-row>
                        <v-col cols="12" md="6">Status</v-col>
                        <v-col cols="12" md="6"><v-chip density="comfortable"
                                :color="getStatusColor(serviceReminder?.status)">{{
                                    serviceReminder.status }}</v-chip>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Service Task</v-col>
                        <v-col cols="12" md="6">
                            <span style="cursor: pointer; border-bottom: 1px dotted;">{{ serviceReminder.service_task ?
                                serviceReminder.service_task.name : '---' }}</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Service Program</v-col>
                        <v-col
                            @click="router.push(`/maintenance/ServicePrograms/${serviceReminder.service_program?.id}`)"
                            cols="12" md="6">
                            <span class="text-secondary font-weight-bold" v-if="serviceReminder.service_program"> {{
                                serviceReminder.service_program.program_name }}</span>
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Next Due</v-col>
                        <v-col>
                            <span style="cursor: pointer; color: red;border-bottom: 1px dotted;" cols="12" md="6">{{
                                getRelativeDateTime(serviceReminder.next_due_schedule?.due_date) }}</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Last Completed</v-col>
                        <v-col cols="12" md="6">{{
                            getRelativeDateTime(serviceReminder.last_completed_schedule?.completion_date) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <!-- <v-row>
                        <v-col cols="12" md="6">Work Order</v-col>
                        <v-col cols="12" md="6">{{ serviceReminder.work_order ? serviceReminder.work_order : '---'
                            }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider> -->
                    <v-row>
                        <v-col cols="12" md="6">Time Interval</v-col>
                        <v-col cols="12" md="6">
                            <div class="d-flex flex-column">
                                <span class="font-weight-bold"> Every {{ serviceReminder.time_interval }} {{
                                    serviceReminder.time_due_soon_threshhold_duration }}</span>
                                <span>{{ serviceReminder.time_due_soon_threshhold ? ` Due Soon threshold
                                    ${serviceReminder.time_due_soon_threshhold}
                                    ${serviceReminder.time_due_soon_threshhold_duration}` : '' }}</span>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Meter Interval</v-col>
                        <v-col cols="12" md="6">{{ serviceReminder.primary_meter_interval ?
                            `${serviceReminder.primary_meter_interval} mi` :
                            '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <!-- <v-row>
                        <v-col>
                            <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small" cols="12"
                                md="6">Manually Set Next Due</span>
                        </v-col>
                        <v-col cols="12" md="6">{{ serviceReminder.meter_interval ? serviceReminder.meter_interval :
                            '---' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider> -->
                    <v-row>
                        <v-col cols="12" md="6">Notifications</v-col>
                        <v-chip density="comfortable" :color="serviceReminder.notifications ? 'primary' : 'red'"
                            class="mt-2" cols="12" md="6">{{ serviceReminder.notifications ? 'Active' : 'InActive'
                            }}</v-chip>
                    </v-row>
                    <v-divider class="my-3"></v-divider>

                </v-card-text>
            </v-card>
        </v-col>

        <v-col :cols="showSidePanel ? 12 : 7">
            <v-card>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6" class="py-1">
                            <div class="d-flex">
                                <span class="text-h6 mr-2 font-weight-bold">Next Due</span>
                                <v-chip density="comfortable" v-if="serviceReminder.next_due_schedule" color="white"
                                    class="bg-red py-0">{{
                                        getRelativeDateTime(serviceReminder.next_due_schedule?.due_date)
                                    }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="py-1">
                            <!-- <div class="d-flex align-center">
                                <span>{{ 'Improve Compliance With Forecasting' }}</span>
                                <span class="text-body ml-2 text-secondary font-weight-bold">
                                    {{ ' Learn More' }}
                                    <v-icon small>mdi-open-in-new</v-icon>
                                </span>
                            </div> -->
                        </v-col>
                    </v-row>

                    <v-divider class="my-2"></v-divider>

                    <div class="justify-start ga-1">
                        <v-col cols="12" md="6" class="py-1">
                            <span class="d-flex align-center">
                                <v-icon small class="mr-1">mdi-calendar-minus</v-icon>
                                <span>{{ formatDate(serviceReminder.next_due_schedule?.due_date) }}</span>
                            </span>
                        </v-col>
                        <!-- <v-col v-if="serviceReminder.last_completed_schedule" class="font-weight-bold py-2 text-body" cols="12"
                            md="6">
                            {{ serviceReminder.last_completed_schedule?.completion_date }}
                        </v-col>
                        <v-col cols="12" md="6" class="py-1">
                            <v-chip density="comfortable" :color="getStatusColor(serviceReminder?.status)">{{
                                serviceReminder.status
                            }}</v-chip>
                        </v-col> -->
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="mt-5">
                <v-card-text>
                    <v-row align="center">
                        <v-col cols="12" md="6" class="text-h6 font-weight-bold">
                            History
                        </v-col>
                        <v-col @click="router.push('/maintenance/ServiceHistory')" cols="12" md="6"
                            class="text-right text-body text-secondary font-weight-bold">
                            {{ 'View History' }}
                        </v-col>
                    </v-row>

                    <v-row class="mt-4">
                        <v-sheet width="33%" :elevation="1" class="mx-auto" height="100">
                            <v-col>Completed</v-col>
                            <v-col class="text-h6">{{ completedServices }}</v-col>
                        </v-sheet>
                        <v-sheet width="33%" :elevation="1" class="mx-auto" height="100">
                            <v-col>Late</v-col>
                            <v-col class="text-h6">{{ lateServices }}</v-col>
                        </v-sheet>
                        <v-sheet width="33%" :elevation="1" class="mx-auto" height="100">
                            <v-col>One Time Compliance</v-col>
                            <v-col class="text-h5 font-weight-bold">{{ serviceReminder.compliance }}</v-col>
                        </v-sheet>
                    </v-row>
                    <!-- <v-table class="mt-4">
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Due
                                </th>
                                <th class="text-left">
                                    Completed
                                </th>
                                <th class="text-left">
                                    Compliance
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ formatDate(serviceReminder?.created_at) }}</td>
                                <td class="text-secondary">{{ formatDate(serviceReminder?.created_at) }}</td>
                                <td>
                                    <v-chip color="primary" class="mt-1" density="comfortable">On-Time</v-chip>
                                    <div class="d-flex flex-column">
                                        <span>5 months, 3 weeks ahead {{ serviceReminder.compliance }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table> -->
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>

</template>

<script lang="ts" setup>
import moment from "moment";
import { defineProps } from "vue";
import { useRouter } from 'vue-router';
import type { ServiceReminder } from "~/types/maintenance/serviceReminders";

const props = defineProps({
    serviceReminder: {
        type: Object as PropType<Partial<ServiceReminder>>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    },
    showSidePanel: {
        type: Boolean,
        required: false,
        default: false
    }
});

const router = useRouter();
const getRelativeDateTime = (dateString: any) => {
    return moment(dateString).from(moment());
};

function formatDate(dateString: string) {
    return moment(dateString).format('MM/DD/YY');
}

const getStatusColor = (status: any) => {
    switch (status) {
        case "Due Soon":
            return "secondary";
        case "Overdue":
            return "red";
        case "Completed":
            return "primary";
        default:
            return "";
    }
};


const completedServices = computed(() => {
    return props.serviceReminder.schedules?.filter(schedule =>
        schedule.due_date &&
        schedule.completion_date &&
        new Date(schedule.completion_date) <= new Date(schedule.due_date)
    )?.length ?? 0;
})

const lateServices = computed(() => {
    return props.serviceReminder.schedules?.filter(schedule =>
        schedule.due_date &&
        schedule.completion_date &&
        new Date(schedule.completion_date) > new Date(schedule.due_date)
    )?.length ?? 0;
})
</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}


.side-button {
    height: 50px;
    cursor: pointer;
}

.side-button:hover {
    background-color: #eeeeee;
}

#side-panel {
    height: 100%;
    width: 50px;
    min-width: 50px;
    border-left: 1px solid grey;
}
</style>
