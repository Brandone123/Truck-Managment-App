
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, watch, defineEmits, defineProps } from 'vue'
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';

const emit = defineEmits(['update:show'])

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList } = storeToRefs(leaveTypeStore)

// const leaveTypeStore = useLeaveTypeStore()

const props = defineProps({
    item: {
        type: Object,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
    employeeList: {
        type: Array,
        required: true,
        default: [],
    }
});

const approverEmployee = computed(() => {
  const employee = props.employeeList.find((item: any) => item.user_id == timeoffRequestInfo.value.user_id)
  return employee ? employee.approver_id : null
})
const timeoffRequestInfo = ref<TimeoffRequest>({})
const timeoffRequestStore = useTimeoffRequestStore()
const { timeoffRequestList } = storeToRefs(timeoffRequestStore)
const title = computed(() => {
    return props.updating ? 'Timeoff Request Info' : 'Request Timeoff'
})

const saveButtonText = computed(() => {
    return props.updating ? 'Update' : 'Save'
})

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})
const save = () => {
    if (props.updating) {
        // Call update function if updating
        timeoffRequestStore.updateTimeoffRequest(timeoffRequestInfo.value);
    } else {
        // Call create function if not updating
        timeoffRequestStore.addTimeoffRequest({...timeoffRequestInfo.value, approver_id:approverEmployee.value});
    }
    dialog.value = false;
}

watch(dialog, (val) => {
    if (val && props.updating) {
        
        timeoffRequestInfo.value = Object.assign({}, props.item as TimeoffRequest)
    } else {
        timeoffRequestInfo.value = {}
    }
})
</script>

<template>
    <v-dialog v-model="dialog" width="800px" scrollable>
        <template v-slot:activator="{ props }">
            <v-btn color="primary" density="comfortable" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Request Timeoff
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" :title="title" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="timeoffRequestForm">
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-select v-model="timeoffRequestInfo.user_id" variant="solo" flat label="Employee Name"
                                :items='employeeList' item-title="full_name" item-value="user_id" density="compact"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-select v-model="timeoffRequestInfo.attendance_leave_type_id" variant="solo" flat
                                label="Timeoff Reason" :items='leaveTypeList' item-title="name" item-value="id"
                                density="compact"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="Start Date"
                                v-model="timeoffRequestInfo.start_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="End Date"
                                v-model="timeoffRequestInfo.end_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="time" variant="solo" flat density="compact" label="Start Time"
                                v-model="timeoffRequestInfo.start_time" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="time" variant="solo" flat density="compact" label="End Time"
                                v-model="timeoffRequestInfo.end_time" required></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-select variant="solo" flat density="compact" label="Status"
                                v-model="timeoffRequestInfo.status" :items="['pending', 'accepted', 'rejected']"></v-select>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-textarea v-model="timeoffRequestInfo.description" variant="solo" flat label="Description"
                                density="compact"></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-textarea v-model="timeoffRequestInfo.comment" variant="solo" flat label="Status Comment"
                                density="compact"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>