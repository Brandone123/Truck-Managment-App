<template>
    <div>
        <div class="d-flex justify-center">
            <div style="max-width: 1200px" class="d-flex justify-end">
                <WorkflowBuilder :item="selectedWorkflow" @add="addWorkflow" @saveEdit="saveWorkflowEdit"
                    v-model="workflowBuildDialog" :inspectionItems="inspectionItems" :inspectionWorkflows="inspectionWorkflows"/>
            </div>
        </div>
        <div class="d-flex justify-center">
            <v-row class="mt-4" style="max-width: 1200px">
                <v-col cols="12" v-for="(workflow, i) in workflows" :key="i">
                    <v-card class="ma-1">
                        <v-card-text>
                            <div class="mb-4">{{ workflow.active ? 'Enabled' : 'Disabled' }}</div>
                            <v-row>
                                <v-col cols="5">
                                    <div class="mb-4">
                                        <v-icon class="mr-4" color="grey">
                                            {{ getTrigerIcon(workflow.trigger.selected) }}
                                        </v-icon>
                                        {{ getTriggerText(workflow.trigger.selected) }}
                                    </div>
                                    <div class="ml-10"><span class="text-grey">Description: </span> {{
                                        workflow.description
                                        }}</div>
                                </v-col>
                                <v-col cols="7">
                                    <div class="d-flex">
                                        <v-icon>mdi-arrow-right</v-icon>

                                        <div class="ml-8 flex-grow-1">
                                            <!-- <div v-if="workflow.actions.change_vehicle_status.active">
                                                <v-icon color="grey" class="mr-3">mdi-car</v-icon>
                                                Change vehicle status
                                            </div>
                                            <div v-if="workflow.actions.send_an_email.active" class="mt-3">
                                                <v-icon color="grey" class="mr-3">mdi-email-outline</v-icon>
                                                Send an email
                                            </div>
                                            <div v-if="workflow.actions.create_an_issue.active" class="mt-3">
                                                <v-icon color="grey" class="mr-3">mdi-alert-outline</v-icon>
                                                Create an issue
                                            </div> -->
                                            <template v-for="(key, i) in activeActions(workflow.actions)" :key="i">
                                                <div :class="{ 'mt-3': i > 0 }">
                                                    <v-icon color="grey" class="mr-3">{{ getActionIcon(key) }}</v-icon>
                                                    {{ getActionText(key) }}
                                                </div>
                                            </template>
                                        </div>
                                        <div class="d-inline-flex align-center">
                                            <v-chip v-if="!workflow.active" class="mr-1" density="comfortable">
                                                <v-icon class="mr-1">mdi-lock-outline</v-icon>Disabled
                                            </v-chip>
                                            <v-menu open-on-hover>
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-bind="props" variant="text">
                                                        <v-icon>mdi-dots-horizontal</v-icon>
                                                    </v-btn>
                                                </template>

                                                <v-list width="150px">
                                                    <v-list-item @click="editWorkflow(workflow)">
                                                        <v-list-item-title class="d-flex">
                                                            <span class="flex-grow-1">Edit </span>
                                                            <v-icon>mdi-pencil-outline</v-icon>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="updateWorkflowStatus(i)">
                                                        <v-list-item-title class="d-flex">
                                                            <span class="flex-grow-1">{{ workflow.active ? 'Disable' :
                                                                'Enable' }} </span>
                                                            <v-icon>mdi-lock-outline</v-icon>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="deleteWorkflow(i)">
                                                        <v-list-item-title class="d-flex">
                                                            <span class="flex-grow-1">Delete</span>
                                                            <v-icon>mdi-trash-can-outline</v-icon>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import WorkflowBuilder from './components/WorkflowBuilder.vue';
import type { Workflow } from '~/types/maintenance/inspectionForm';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
    modelValue: {
        type: Array as PropType<Workflow[]>,
        required: true,
        default: [] as Workflow[]
    },

    inspectionItems: {
        type: Array as PropType<any>,
        required: true,
    },

    inspectionWorkflows:{
        type: Array as PropType<any>,
        required: true,
    }
})

const defaultWorkflow = {
    id: null,
    trigger: {
        selected: '',
        inspection_items: [],
    },
    actions: {
        change_vehicle_status: {
            active: false,
            status: '',
        },
        send_an_email: {
            active: false,
            send_to_vehicle_watchers: false,
            users: []
        },
        create_an_issue: {
            active: false,
        }
    },

    description: '',
    active: true
}

const emits = defineEmits(['update:modelValue'])

const workflows = ref<Workflow[]>(props.modelValue)

watch(workflows, (newValue, oldValue) => {
    emits('update:modelValue', newValue)
})

const selectedWorkflow = ref<Workflow>(JSON.parse(JSON.stringify(defaultWorkflow)) as Workflow)

const workflowBuildDialog = ref<boolean>(false)

watch(workflowBuildDialog, (newVal, oldVal) => {
    if (newVal == false) {
        selectedWorkflow.value = JSON.parse(JSON.stringify(defaultWorkflow));
    }
})

const activeActions = (actions: any) => {
    let result = [];
    if (actions.change_vehicle_status.active) {
        result.push('change_vehicle_status')
    }
    if (actions.send_an_email.active) {
        result.push('send_an_email')
    }
    if (actions.create_an_issue.active) {
        result.push('create_an_issue')
    }
    return result
}

const getTrigerIcon = (trigger: string) => {
    switch (trigger) {
        case 'item_pass':
            return 'mdi-check-circle-outline'
        case 'item_fail':
            return 'mdi-close-circle-outline'
        case 'form_submitted':
            return 'mdi-clipboard-check-outline'
    }
}

const getTriggerText = (trigger: string) => {
    switch (trigger) {
        case 'item_pass':
            return 'If an item passes'
        case 'item_fail':
            return 'If an item fails'
        case 'form_submitted':
            return 'If form is submitted'
    }
}

const getActionIcon = (action: string) => {
    switch (action) {
        case 'change_vehicle_status':
            return 'mdi-car'
        case 'send_an_email':
            return 'mdi-email-outline'
        case 'create_an_issue':
            return 'mdi-alert-outline'
    }
}

const getActionText = (action: string) => {
    switch (action) {
        case 'change_vehicle_status':
            return 'Change vehicle status'
        case 'send_an_email':
            return 'Send an email'
        case 'create_an_issue':
            return 'Create an issue'
    }
}

const addWorkflow = (workflow: Workflow) => {
    workflow.id = uuidv4()
    workflows.value.push(workflow)
}
const editWorkflow = (workflow: Workflow) => {
    selectedWorkflow.value = JSON.parse(JSON.stringify(workflow));
    workflowBuildDialog.value = true
}

const saveWorkflowEdit = (workflow: Workflow) => {
    let index = workflows.value.findIndex(item => item.id == workflow.id)
    if (index > -1) {
        workflows.value.splice(index, 1, workflow);
    }
}

const deleteWorkflow = (index: number) => {
    workflows.value.splice(index, 1)
}

const updateWorkflowStatus = (index: number) => {
    let workflow = workflows.value[index]
    workflow.active = !workflow.active
}
</script>