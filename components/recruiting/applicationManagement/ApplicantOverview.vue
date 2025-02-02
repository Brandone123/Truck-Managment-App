<template>
    <v-card>
        <v-card-title>
            <div class="d-flex">
                <span>Applicant Details</span>
            </div>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-account</v-icon>
                        <span> First Name: </span>
                        <span class="font-weight-bold">
                            {{ applicant?.first_name }}
                            {{ applicant?.middle_name }}
                            {{ applicant?.last_name }}
                        </span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-email</v-icon>
                        <span> Email: </span>
                        <span class="text-secondary"
                        style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                        {{ applicant?.email_address }}
                        </span>
                    </v-col>

                    <v-divider></v-divider>

                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-phone</v-icon>
                        <span> Primary Phone: </span>
                        <span class="font-weight-bold">{{ applicant?.primary_phone }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-cellphone</v-icon>
                        <span> Cell Phone: </span>
                        <span class="font-weight-bold">{{ applicant?.cell_phone }}</span>
                    </v-col>

                    <v-divider></v-divider>

                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-calendar</v-icon>
                        <span> Date of Birth: </span>
                        <span class="font-weight-bold">{{ applicant?.date_of_birth }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-map-marker</v-icon>
                        <span> Current Street Address: </span>
                        <span class="font-weight-bold">{{ applicant?.current_street_address }}</span>
                    </v-col>

                    <v-divider></v-divider>

                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-earth</v-icon>
                        <span> Country: </span>
                        <span class="font-weight-bold">{{ applicant?.country }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-map</v-icon>
                        <span> State: </span>
                        <span class="font-weight-bold">{{ applicant?.state }}</span>
                    </v-col>

                    <v-divider></v-divider>

                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-mailbox</v-icon>
                        <span> Zip: </span>
                        <span class="font-weight-bold">{{ applicant?.zip }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-icon color="primary" class="mr-1">mdi-account-check</v-icon>
                        <span> Applicant Type: </span>
                        <span class="font-weight-bold">{{ applicant?.applicant_type ? applicant?.applicant_type : '-----' }}</span>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { Applicant } from '@/types/recruiting/applicantApplication';

const props = defineProps({
    applicant: {
        type: Object as PropType<Partial<Applicant>>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const statusColor = (status: any) => {
    switch (status) {
        case 'Active':
            return 'green';
        case 'Inactive':
            return 'red';
        default:
            return 'grey';
    }
};

const applicationStats = ref({
    totalApplications: 0,
    jobTypes: [] as string[],
});

const calculateApplicationStats = () => {
    if (props.applicant?.applications) {
        applicationStats.value.totalApplications = props.applicant.applications.length;
        applicationStats.value.jobTypes = [...new Set(props.applicant.applications.map(app => app.job?.job_type as string))];
    }
};

watch(() => props.applicant, calculateApplicationStats, { immediate: true });
</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}
</style>