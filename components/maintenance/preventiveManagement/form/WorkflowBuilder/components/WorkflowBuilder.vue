<template>
    <v-dialog max-width="900px" v-model="show" scrollable>
        <template v-slot:activator="{ props }">
            <v-btn color="primary" density="comfortable" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add Workflow
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="workflowForm" :fast-fail="false" @submit.prevent>
                    <v-card>
                        <v-card-title>Select Trigger</v-card-title>
                        <v-card-text>
                            <div>When do you want to trigger this workflow?</div>
                            <v-row>
                                <v-col cols="12" v-if="!triggerSelected && triggerSelectionErrorMessage">
                                    <div class="text-error">{{ triggerSelectionErrorMessage }}</div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-tooltip location="bottom" :disabled="!passWorkflowAdded"
                                        text="A workflow with this trigger is present">
                                        <template v-slot:activator="{ props }">
                                            <v-card v-bind="props"
                                                :style="{ cursor: passWorkflowAdded ? 'not-allowed' : 'pointer' }"
                                                @click="updateTrigger('item_pass')" variant="outlined"
                                                :color="editedWorkflow.trigger.selected == 'item_pass' ? 'primary' : 'grey'">
                                                <v-card-text>
                                                    <div class="d-flex justify-space-between">
                                                        <v-icon
                                                            :color="editedWorkflow.trigger.selected == 'item_pass' ? 'primary' : 'grey'">mdi-check-circle-outline</v-icon>
                                                        <v-icon color="primary"
                                                            v-if="editedWorkflow.trigger.selected == 'item_pass'">mdi-check-circle</v-icon>
                                                    </div>
                                                    <span class="font-weight-bold mt-3">If an item passes</span>
                                                </v-card-text>
                                            </v-card>
                                        </template>
                                    </v-tooltip>

                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-tooltip location="bottom" :disabled="!failWorkflowAdded"
                                        text="A workflow with this trigger is present">
                                        <template v-slot:activator="{ props }">
                                            <v-card v-bind="props"
                                                :style="{ cursor: failWorkflowAdded ? 'not-allowed' : 'pointer' }"
                                                @click="updateTrigger('item_fail')" variant="outlined"
                                                :color="editedWorkflow.trigger.selected == 'item_fail' ? 'primary' : 'grey'">
                                                <v-card-text>
                                                    <div class="d-flex justify-space-between">
                                                        <v-icon
                                                            :color="editedWorkflow.trigger.selected == 'item_fail' ? 'primary' : 'grey'">mdi-close-circle-outline</v-icon>
                                                        <v-icon color="primary"
                                                            v-if="editedWorkflow.trigger.selected == 'item_fail'">mdi-check-circle</v-icon>
                                                    </div>
                                                    <span class="font-weight-bold mt-3">If an item fails</span>
                                                </v-card-text>
                                            </v-card>
                                        </template>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-tooltip location="bottom" :disabled="!formSubmittedWorkflowAdded"
                                        text="A workflow with this trigger is present">
                                        <template v-slot:activator="{ props }">
                                            <v-card v-bind="props"
                                                :style="{ cursor: formSubmittedWorkflowAdded ? 'not-allowed' : 'pointer' }"
                                                @click="updateTrigger('form_submitted')" variant="outlined"
                                                :color="editedWorkflow.trigger.selected == 'form_submitted' ? 'primary' : 'grey'">
                                                <v-card-text>
                                                    <div class="d-flex justify-space-between">
                                                        <v-icon
                                                            :color="editedWorkflow.trigger.selected == 'form_submitted' ? 'primary' : 'grey'">mdi-clipboard-check-outline</v-icon>
                                                        <v-icon color="primary"
                                                            v-if="editedWorkflow.trigger.selected == 'form_submitted'">mdi-check-circle</v-icon>
                                                    </div>
                                                    <span class="font-weight-bold mt-3">If form is submitted</span>
                                                </v-card-text>
                                            </v-card>
                                        </template>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="12"
                                    v-if="editedWorkflow.trigger.selected && editedWorkflow.trigger.selected != 'form_submitted'">
                                    <v-autocomplete v-model="editedWorkflow.trigger.inspection_items" multiple
                                        density="comfortable" variant="outlined" label="Which inspection Items"
                                        item-title="title" item-value="id" :items="trigggerItems" chips closable-chips
                                        :custom-filter="customFilter" :rules="[validation.required]">
                                        <template v-slot:item="{ props, item }">
                                            <template v-if="(item.raw as any).id == 'all'">
                                                <v-list-item
                                                    :class="{ 'text-primary': editedWorkflow.trigger.inspection_items.includes('all') }"
                                                    v-bind="props" :title="item.raw.title"></v-list-item>
                                                <v-divider class="my-2"></v-divider>
                                            </template>
                                            <v-list-item v-else v-bind="props" :title="item.raw.title"></v-list-item>
                                        </template>

                                        <template v-slot:chip="{ props, item }">
                                            <v-chip v-if="item.raw.id != 'all'" v-bind="props" :text="item.raw.title"
                                                color="primary"></v-chip>
                                            <span v-else>{{ item.raw.title }}</span>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card class="mt-3">
                        <v-card-title>Configure Actions</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" v-if="!actionSelected && actionSelectionErrorMessage">
                                    <div class="text-error">{{ actionSelectionErrorMessage }}</div>
                                </v-col>
                                <v-col cols="12">
                                    <v-card variant="outlined"
                                        :color="editedWorkflow.actions.change_vehicle_status.active ? 'primary' : 'grey'">
                                        <div class="py-4 px-4" @click="toggleVehicleStatus">
                                            <div class="d-flex justify-space-between">
                                                <span>
                                                    <v-icon class="mr-2">mdi-car</v-icon>
                                                    Change vehicle status
                                                </span>

                                                <v-icon color="primary"
                                                    v-if="editedWorkflow.actions.change_vehicle_status.active">mdi-check-circle-outline</v-icon>
                                            </div>

                                        </div>
                                        <v-expand-transition>
                                            <v-card-text v-if="editedWorkflow.actions.change_vehicle_status.active">
                                                <v-row class="ml-5 text-grey">
                                                    <v-col cols="12">
                                                        <v-select
                                                            v-model="editedWorkflow.actions.change_vehicle_status.status"
                                                            density="compact" variant="outlined" label="Please select"
                                                            base-color="grey" :items="vehicleStatuses"
                                                            item-value="value" item-title="title" color="primary"
                                                            :rules="[validation.required]"></v-select>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-expand-transition>

                                    </v-card>
                                </v-col>
                                <v-col cols="12">
                                    <v-card variant="outlined"
                                        :color="editedWorkflow.actions.send_an_email.active ? 'primary' : 'grey'">
                                        <div class="py-4 px-4" @click="toggleSendEmailActionStatus">
                                            <div class="d-flex justify-space-between">
                                                <span>
                                                    <v-icon class="mr-2">mdi-email-outline</v-icon>
                                                    Send an email
                                                </span>

                                                <v-icon color="primary"
                                                    v-if="editedWorkflow.actions.send_an_email.active">mdi-check-circle-outline</v-icon>
                                            </div>

                                        </div>
                                        <v-expand-transition>
                                            <v-card-text v-if="editedWorkflow.actions.send_an_email.active">
                                                <v-row class="ml-5 text-grey">
                                                    <v-col cols="12">
                                                        <v-checkbox base-color="grey" color="primary" density="compact"
                                                            hide-details>
                                                            <template v-slot:label>
                                                                <span class="text-black">Send to vehicle watchers</span>
                                                            </template>
                                                        </v-checkbox>
                                                    </v-col>
                                                    <v-col cols="12" class="mt-0">
                                                        <v-autocomplete base-color="grey" color="primary"
                                                            v-model="editedWorkflow.actions.send_an_email.users"
                                                            multiple density="compact" variant="outlined"
                                                            label="Please select" :items="technicians" item-value="id"
                                                            chips closable-chips :rules="[validation.required]">
                                                            <template v-slot:item="{ props, item }">
                                                                <v-list-item v-bind="props" title="">
                                                                    <v-list-item-title>{{ item.raw.first_name }} {{
                                                                        item.raw.last_name }}</v-list-item-title>
                                                                    <v-list-item-subtitle>{{ item.raw.email }}
                                                                    </v-list-item-subtitle>
                                                                </v-list-item>
                                                            </template>

                                                            <template v-slot:chip="{ props, item }">
                                                                <v-chip v-bind="props" color="primary">{{
                                                                    item.raw.first_name }} {{ item.raw.last_name
                                                                    }}</v-chip>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-expand-transition>
                                    </v-card>
                                </v-col>

                                <v-col cols="12">
                                    <v-card variant="outlined"
                                        :color="editedWorkflow.actions.create_an_issue.active ? 'primary' : 'grey'">
                                        <div class="py-4 px-4" @click="toggleCreateIssueActionStatus">
                                            <div class="d-flex justify-space-between">
                                                <span>
                                                    <v-icon class="mr-2">mdi-alert-outline</v-icon>
                                                    Create an issue
                                                </span>

                                                <v-chip density="compact"
                                                    v-if="editedWorkflow.trigger.selected == 'form_submitted'">Not
                                                    Available</v-chip>
                                                <v-icon color="primary"
                                                    v-if="editedWorkflow.actions.create_an_issue.active">mdi-check-circle-outline</v-icon>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card class="mt-3">
                        <v-card-title>Details</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="editedWorkflow.description" color="primary"
                                        label="Description" variant="outlined" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-checkbox v-model="editedWorkflow.active" color="primary" label="Enable Workflow"
                                        density="compact" hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-card-text>

                    </v-card>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn variant="text" color="primary" @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn variat="text" color="primary" @click="save">Save</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, type PropType, type ComputedRef, watch } from 'vue'
import { storeToRefs } from 'pinia';
import type { Workflow } from '~/types/maintenance/inspectionForm';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const technicianStore = useTechniciansStore()
const { technicians } = storeToRefs(technicianStore)

const emit = defineEmits(['add', 'saveEdit', 'updateDialog'])

const props = defineProps({
    item: {
        type: Object as PropType<Workflow>,
        required: true,
        default: {
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
        } as Workflow
    },

    inspectionItems: {
        type: Array as PropType<any>,
        Required: true,
    },

    inspectionWorkflows: {
        type: Array as PropType<any>,
        Required: true,
        default: [],
    },

    dialog: {
        type: Boolean,
        required: true,
    }
})

const workflowForm = ref<HTMLFormElement | null>(null)

const editedWorkflow = ref<Workflow>(JSON.parse(JSON.stringify(props.item)))
watch(() => props.item,
    () => {
        editedWorkflow.value = JSON.parse(JSON.stringify(props.item));
    },
    { deep: true }
);

watch(() => editedWorkflow.value.trigger.inspection_items, (newVal) => {
    length = newVal.length
    if (length > 1 && newVal[0] == 'all') {
        editedWorkflow.value.trigger.inspection_items.splice(0, 1)
    }
    else if (length > 1 && newVal[length - 1] == 'all') {
        editedWorkflow.value.trigger.inspection_items = ['all']
    }

    // reset inspection_items to select all items when all items cleared on trigger 'item_fail'
    if (length == 0 && editedWorkflow.value.trigger.selected == 'item_fail') {
        editedWorkflow.value.trigger.inspection_items = ['all']
    }
}, { deep: true })

const updateTrigger = (trigger: string) => {

    const editing = props.item.id ? true : false;

    const triggerInWorkflows = props.inspectionWorkflows.some((item: any) => item.trigger.selected == trigger)
    const incomingWorkflowHasTrigger = props.item.trigger.selected == trigger

    let canSwitch = true

    if (editing) {
        canSwitch = !triggerInWorkflows || (triggerInWorkflows && incomingWorkflowHasTrigger)
    } else {
        canSwitch = !triggerInWorkflows
    }

    switch (trigger) {
        case 'item_pass':
            if (canSwitch) {
                if (editedWorkflow.value.trigger.inspection_items.length) {
                    if (editedWorkflow.value.trigger.inspection_items[0] == 'all') {
                        editedWorkflow.value.trigger.inspection_items = []
                    }
                }
                editedWorkflow.value.trigger.selected = 'item_pass'
            }
            break;
        case 'item_fail':
            if (canSwitch) {
                editedWorkflow.value.trigger.selected = 'item_fail'
                if (!editedWorkflow.value.trigger.inspection_items.length) {
                    editedWorkflow.value.trigger.inspection_items = ['all']
                }
            }
            break;
        case 'form_submitted':
            if (canSwitch) {
                editedWorkflow.value.actions.create_an_issue.active = false
                editedWorkflow.value.trigger.inspection_items = []
                editedWorkflow.value.trigger.selected = 'form_submitted'
            }
            break;
    }
}

const allTriggersActive = computed(() => {
    return props.inspectionWorkflows.length == 3
})

const getInspectionItems = () => {
    return props.inspectionItems.map((item: any) => {
        return { id: item.id, title: item.label }
    })
}

const trigggerItems: ComputedRef<Array<{ id: string, title: string }>> = computed(() => {
    switch (editedWorkflow.value.trigger.selected) {
        case 'item_pass':
            return getInspectionItems()
        case 'item_fail':
            return [
                { id: 'all', title: 'ANY failed inspection item', class: 'text-primary' },
                ...getInspectionItems()
            ]
        default:
            return []
    }
})

const passWorkflowAdded = computed(() => {
    return props.inspectionWorkflows?.some((item: any) => item.trigger.selected == 'item_pass') && props.item.trigger.selected != 'item_pass'
})

const failWorkflowAdded = computed(() => {
    return props.inspectionWorkflows?.some((item: any) => item.trigger.selected == 'item_fail') && props.item.trigger.selected != 'item_fail'
})

const formSubmittedWorkflowAdded = computed(() => {
    return props.inspectionWorkflows?.some((item: any) => item.trigger.selected == 'form_submitted') && props.item.trigger.selected != 'form_submitted'
})

const title = computed(() => (props.item && props.item.id ? 'Modify Workflow' : 'Create Workflow'));

const vehicleStatuses = [
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
    { title: 'Out of Service', value: 'out of service' },
    { title: 'Sold', value: 'sold' }
]

const triggerSelectionErrorMessage = ref<string>('')
const actionSelectionErrorMessage = ref<string>('')

const triggerSelected = computed(() => {
    return (editedWorkflow.value.trigger.selected || '').length > 0
})

const actionSelected = computed(() => {
    return (editedWorkflow.value.actions.change_vehicle_status.active || editedWorkflow.value.actions.send_an_email.active || editedWorkflow.value.actions.create_an_issue.active)
})
const save = async () => {
    const formStatus = await workflowForm.value?.validate()

    if (!triggerSelected.value) {
        triggerSelectionErrorMessage.value = 'Select a trigger'
    }
    if (!actionSelected.value) {
        actionSelectionErrorMessage.value = 'Atleast one action is required'
    }

    if (!triggerSelected.value || !actionSelected.value || !formStatus.valid) {
        return
    }

    if (editedWorkflow.value.id) {
        emit('saveEdit', JSON.parse(JSON.stringify(editedWorkflow.value)))
    }
    else {
        emit('add', JSON.parse(JSON.stringify(editedWorkflow.value)))
    }
    closeDialog()
}

const resetErrorMessages = () => {
    triggerSelectionErrorMessage.value = ""
    actionSelectionErrorMessage.value = ""
}

const show = computed({
    get() {
        return props.dialog
    },
    set(value) {
        emit('updateDialog', value)
    }
})

watch(() => show.value, (newVal) => {
    resetErrorMessages()
    workflowForm.value?.resetValidation()
})


const closeDialog = () => {
    show.value = false
}

const customFilter = (value: string, query: string, item: any): boolean => {
    const searchText = query.toLowerCase();
    return item.raw.name.toLowerCase().includes(searchText) && item.raw.id != 'all';
};


const toggleVehicleStatus = () => {
    editedWorkflow.value.actions.change_vehicle_status.active = !editedWorkflow.value.actions.change_vehicle_status.active
    if (!editedWorkflow.value.actions.change_vehicle_status.active) {
        editedWorkflow.value.actions.change_vehicle_status.status = ''
    }
}

const toggleSendEmailActionStatus = () => {
    editedWorkflow.value.actions.send_an_email.active = !editedWorkflow.value.actions.send_an_email.active
    if (!editedWorkflow.value.actions.send_an_email.active) {
        editedWorkflow.value.actions.send_an_email.send_to_vehicle_watchers = false
        editedWorkflow.value.actions.send_an_email.users = []
    }
}

const toggleCreateIssueActionStatus = () => {
    if (editedWorkflow.value.trigger.selected == 'form_submitted') {
        editedWorkflow.value.actions.create_an_issue.active = false
    }
    else {
        editedWorkflow.value.actions.create_an_issue.active = !editedWorkflow.value.actions.create_an_issue.active
    }
}
</script>