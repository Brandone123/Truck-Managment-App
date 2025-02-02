<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Policy #{{ policy.id }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-card style="position:sticky; top: 0px;">
                            <v-card-title>Policy Details</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">Policy Name:</v-col>
                                    <v-col cols="6">{{ policy.policy_name }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Type:</v-col>
                                    <v-col cols="6">{{ policy.type }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Enforcement Level:</v-col>
                                    <v-col cols="6">{{ capitalize(policy.enforcement_level ?? '') }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Description:</v-col>
                                    <v-col cols="6">{{ policy.description }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Version:</v-col>
                                    <v-col cols="6">{{ policy.version }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Created At:</v-col>
                                    <v-col cols="6">{{ formatDate(policy?.created_at ?? null) }}</v-col>
                                </v-row>
                                <v-divider class="my-3"></v-divider>
                                <v-row>
                                    <v-col cols="6">Updated At:</v-col>
                                    <v-col cols="6">{{ formatDate(policy?.updated_at ?? null) }}</v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card>
                            <v-card-title>Audit Log</v-card-title>
                            <v-card-text>
                                <v-timeline align="start" side="end">
                                    <v-timeline-item v-for="(item, i) in policy.audit_logs || []" :key="i" size="small"
                                        :icon="getAuditIcon(item.action_type)" dot-color="primary" fill-dot>
                                        <template v-slot:opposite>
                                            <div>
                                                <SharedTableDynamicTechnicianItem :technician="item.employee" />
                                                <span>{{ formatDate(item.created_at) }}</span>
                                            </div>
                                        </template>
                                        <v-card class="elevation-2">
                                            <v-card-title>
                                                {{ item.action_type }}
                                            </v-card-title>
                                            <v-card-text>
                                                <!-- Check for Created Change Type -->
                                                <div v-if="item.action_type === 'Created'">
                                                    <div>
                                                        Policy Created: Name - {{ item.original_data?.policy_name }},
                                                        Type - {{ item.original_data?.type }},
                                                        Enforcement Level - {{ item.original_data?.enforcement_level }},
                                                        Description - {{ item.original_data?.description }},
                                                        Version - {{ item.original_data?.version }},
                                                        Status - {{ item.original_data?.status }}
                                                    </div>
                                                </div>

                                                <!-- Check for Update Change Type -->
                                                <div v-if="item.action_type === 'Update'">
                                                    <!-- Policy Name Change -->
                                                    <div
                                                        v-if="item.new_data?.policy_name !== item.original_data?.policy_name">
                                                        Policy Name Updated From
                                                        "{{ item.original_data?.policy_name }}" to "{{
                                                            item.new_data?.policy_name }}"
                                                    </div>

                                                    <!-- Type Change -->
                                                    <div v-if="item.new_data?.type !== item.original_data?.type">
                                                        Type Updated From
                                                        "{{ item.original_data?.type }}" to "{{ item.new_data?.type }}"
                                                    </div>

                                                    <!-- Enforcement Level Change -->
                                                    <div
                                                        v-if="item.new_data?.enforcement_level !== item.original_data?.enforcement_level">
                                                        Enforcement Level Updated From
                                                        "{{ item.original_data?.enforcement_level }}" to "{{
                                                            item.new_data?.enforcement_level }}"
                                                    </div>

                                                    <!-- Description Change -->
                                                    <div
                                                        v-if="item.new_data?.description !== item.original_data?.description">
                                                        Description Updated From
                                                        "{{ item.original_data?.description }}" to "{{
                                                            item.new_data?.description }}"
                                                    </div>

                                                    <!-- Version Change -->
                                                    <div v-if="item.new_data?.version !== item.original_data?.version">
                                                        Version Updated From
                                                        " {{ item.original_data?.version }}" to "{{
                                                            item.new_data?.version
                                                        }}"
                                                    </div>

                                                    <!-- Status Change -->
                                                    <div v-if="item.new_data?.status !== item.original_data?.status">
                                                        Status Updated From
                                                        "{{ item.original_data?.status }}" to "{{ item.new_data?.status
                                                        }}"
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import moment from 'moment';
import type { PolicyInfo } from '~/types/store/policy';

const props = defineProps({
    policy: {
        type: Object as PropType<Partial<PolicyInfo>>,
        required: true,
    },
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

// Dialog for modal visibility
const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

// Current policy record for tracking changes
const currentPolicyRecord = ref<Partial<PolicyInfo>>({ ...props.policy });

// Function to determine audit log icons
// const getAuditIcon = (action: string) => {
//     switch (action) {
//         case 'Created':
//             return 'mdi-plus-circle';
//         case 'Update':
//             return 'mdi-pencil-circle';
//         default:
//             return 'mdi-file';
//     }
// };

// Utility function to format dates
const formatDate = (dateString: string | null) => {
    return moment(dateString).format('dddd, MMM Do YYYY');
};

const getAuditIcon = (action: string) => {
    switch (action) {
        case 'Create':
            return 'mdi-plus-circle';
        case 'Update':
            return 'mdi-pencil-circle';
        case 'Delete':
            return 'mdi-minus-circle';
        default:
            return 'mdi-file';
    }
};

// Watch for policy updates and reset the current record
watch(
    () => props.policy,
    (newRecord) => {
        currentPolicyRecord.value = { ...newRecord };
    }
);

// Helper to capitalize text
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<style scoped></style>
