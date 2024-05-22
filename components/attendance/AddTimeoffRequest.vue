<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import type { EmployeeInfo } from '~/types/store/employee';
import type { LeaveApproverInfo } from '~/types/attendance/leave_approver';
import type { LeavePolicyInfo, EmployeeLeavePolicyInfo } from '~/types/attendance/leave_policy';


// type EmployeeLeavePolicyInfo = {
//     policy_activated?: Boolean
//     policy_activation_date?: String
//     leave_period_start_date?: String | null
//     leave_period_end_date?: String | null
//     assigned?: number
//     used?: number
//     policy?: LeavePolicyInfo
// }
const emit = defineEmits(['update:show', 'editInfo', 'addInfo'])

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList } = storeToRefs(leaveTypeStore)

const leaveApproverStore = useLeaveApproverStore()
const { leaveApproverList } = storeToRefs(leaveApproverStore)

const leavePolicyStore = useLeavePolicyStore()
const { leavePolicyList } = storeToRefs(leavePolicyStore)


// const employeeStore = useEmployeeStore()
// const { employeeList } = storeToRefs(employeeStore)



const props = defineProps({
    item: {
        type: Object as () => TimeoffRequest,
        required: false,
    },

    selectedDate: {
        // type: Any,
        required: false,
        default: null
    },

    selectedEmployee: {
        // type: any,
        required: false,
        default: null
    },

    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
    employees: {
        type: Array,
        required: true,
        default: []
    }
});

const timeoffRequestForm: Ref<HTMLFormElement | null> = ref(null);
const timeoffRequestInfo = ref<TimeoffRequest>({})


const employeePolicy = ref<EmployeeLeavePolicyInfo>({})
const loadingEmployeePolicy = ref<boolean>(false)

const employeePolicyObtained = computed(() => {
    return Object.keys(employeePolicy.value).length > 0
})

const title = computed(() => {
    return props.updating ? 'Timeoff Request Info' : 'Request Timeoff'
})

const employeeList = computed(() => {
    return props.employees.map((item: any) => { return { ...item, full_name: `${item.first_name} ${item.last_name}` } })
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

const getStartDateMin = computed(() => {
    let date = new Date()

    if (employeePolicy.value.policy) {
        //get minimum notice period
        let notice_days = employeePolicy.value.policy.min_notice_period || 0

        //append minimum notice period
        date.setDate(date.getDate() + notice_days)
    }
    return date.toISOString().slice(0, 10);
})

const getStartDateMax = computed(() => {
    if (timeoffRequestInfo.value.end_date) {
        return new Date(timeoffRequestInfo.value.end_date).toISOString().slice(0, 10)
    }
    return null
})

const getEndDateMin = computed(() => {
    return timeoffRequestInfo.value.start_date || getStartDateMin.value
})

const availableDays = computed(() => {
    return ((employeePolicy.value?.assigned as number) - (employeePolicy.value.used as number)) || 0
})

const getEndDateMax = computed(() => {
    if (employeePolicy.value && timeoffRequestInfo.value.start_date) {
        let date = new Date(timeoffRequestInfo.value.start_date)
        let available_days = availableDays.value

        if (available_days > 0) {
            //subtract today
            available_days -= 1
        }

        //append available leave days
        date.setDate(date.getDate() + (available_days))
        return date.toISOString().slice(0, 10);
    }

    return null

})


const getStartTimeMax = computed(() => {
    return timeoffRequestInfo.value.end_time || null
})

const getEndTimeMin = computed(() => {
    return timeoffRequestInfo.value.start_time || null
})

const rules = computed(() => {
    return {
        employee: [
            (value: number) => !!value || "Value is required",
            (value: number) => {
                let errorMessage = validateEmployeeProfile(value)
                return !errorMessage.length || `Employee Not Assigned: ${errorMessage.join(', ')}`
            }
        ],

        start_date: [
            (value: string) => !!value || "Value is required",
            (value: string) => {
                if (timeoffRequestInfo.value.end_date) {
                    (new Date(value) <= new Date(timeoffRequestInfo.value.end_date)) || 'Value must be less than or equal to end date'
                }
                return true
            }
        ],

        end_date: [
            (value: string) => !!value || "Value is required",
            (value: string) => {
                if (timeoffRequestInfo.value.start_date) {
                    (new Date(value) >= new Date(timeoffRequestInfo.value.start_date)) || 'Value must be greater than or equal to start date'
                }
                return true
            }
        ],
        required: [
            (value: string) => !!value || "Value is required"
        ]
    }
})

const save = async () => {
    if (timeoffRequestForm.value) {
        const formStatus = await timeoffRequestForm.value.validate()
        if (!formStatus.valid) {
            return
        }

        let data = Object.assign({}, timeoffRequestInfo.value)
        if (props.updating) {
            emit('editInfo', data);
        } else {
            emit('addInfo', data);
        }
        dialog.value = false
    }
}

const allowedTimeStep = (m: any) => m % 15 === 0


function validateEmployeeProfile(employeeId: number | null | undefined) {
    let response = []
    if (employeeId) {
        const employee = employeeList.value.find((item: EmployeeInfo) => item.id == employeeId)
        if (employee && !leaveApproverList.value.some((item: LeaveApproverInfo) => item.id == employee.approver_id)) {
            response.push('Leave Approver')
        }
        if (employee && !leavePolicyList.value.some((item: LeavePolicyInfo) => item.id == employee.leave_policy_id)) {
            response.push('Leave Policy')
        }
    }
    return response
}


const validEmployeeProfile = computed(() => {
    if (timeoffRequestForm.value?.items[0].isValid) {
        return true
    }
    return false
})

const getEmployeeLeaveInfo = (employee_id: number) => {
    loadingEmployeePolicy.value = true
    leavePolicyStore.getEmployeeLeaveStatus(employee_id).then((response) => {
        employeePolicy.value = response as EmployeeLeavePolicyInfo
        loadingEmployeePolicy.value = false
    }).catch((error) => {
        loadingEmployeePolicy.value = false
        //do something
    })
}

//request for employee leave info when ever the employee is changed
watch(() => timeoffRequestInfo.value.employee_id, (value) => {
    if (value != null) {
        getEmployeeLeaveInfo(value as number)
    }
})

watch(dialog, (val) => {
    if (val && props.updating) {
        timeoffRequestInfo.value = Object.assign({}, props.item as TimeoffRequest)
    } else {
        if (props.selectedEmployee != null) {
            getEmployeeLeaveInfo(props.selectedEmployee)
        }

        timeoffRequestInfo.value = {
            employee_id: props.selectedEmployee ? props.selectedEmployee as any : null,
            start_date: props.selectedDate ? props.selectedDate as any : null,
            end_date: props.selectedDate ? props.selectedDate as any : null,
            status: 'pending'
        }
    }
})

</script>

<template>
    <v-dialog v-model="dialog" width="800px" scrollable>
        <template v-slot:activator="{ props }">
            <v-btn color="primary" density="comfortable" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add New Absence
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
                        <v-col cols="12" class="pb-0">
                            <v-autocomplete v-model="timeoffRequestInfo.employee_id" variant="solo" flat
                                label="For Employee" :items='employeeList' item-title="full_name" item-value="id"
                                density="compact" :rules="rules.employee" :readonly="props.updating"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" v-if="loadingEmployeePolicy || employeePolicyObtained">
                            <v-card flat>
                                <v-card-title><b>Leave Policy Information</b></v-card-title>
                                <v-card-text>
                                    <!-- <p><b>Leave Policy: </b> {{ getPolicy(currentEmployee.leave_policy_id).name }}</p> -->
                                    <p>
                                        <b>Leave Policy Activation Status: </b>
                                        <span v-if="loadingEmployeePolicy">
                                            <v-progress-circular size="15" :width="2" indeterminate
                                                color="primary"></v-progress-circular>
                                        </span>
                                        <span v-else-if="employeePolicyObtained">
                                            {{ employeePolicy.policy_activated ? 'Active' : 'Inactive' }}
                                        </span>
                                    </p>
                                    <p>
                                        <b>Leave Policy Activation Date: </b>
                                        <span v-if="loadingEmployeePolicy">
                                            <v-progress-circular size="15" :width="2" indeterminate
                                                color="primary"></v-progress-circular>
                                        </span>
                                        <span v-else-if="employeePolicyObtained">
                                            {{ employeePolicy.policy_activation_date }}
                                        </span>
                                    </p>
                                    <p><b>Assigned Days: </b>
                                        <span v-if="loadingEmployeePolicy">
                                            <v-progress-circular size="15" :width="2" indeterminate
                                                color="primary"></v-progress-circular>
                                        </span>
                                        <span v-else-if="employeePolicyObtained">{{ employeePolicy.assigned }}</span>
                                    </p>
                                    <p><b>Available Days: </b>
                                        <span v-if="loadingEmployeePolicy">
                                            <v-progress-circular size="15" :width="2" indeterminate
                                                color="primary"></v-progress-circular>
                                        </span>
                                        <span v-else-if="employeePolicyObtained">
                                            {{ (employeePolicy.assigned as number) - (employeePolicy.used as number) }}
                                        </span>
                                    </p>
                                    <p><b>Leave Request Minimum Notice Period (Days): </b>
                                        <span v-if="loadingEmployeePolicy">
                                            <v-progress-circular size="15" :width="2" indeterminate
                                                color="primary"></v-progress-circular>
                                        </span>
                                        <span v-else-if="employeePolicyObtained">
                                            {{ employeePolicy.policy?.min_notice_period }} days from Current Day
                                        </span>
                                    </p>
                                    <p></p>
                                </v-card-text>

                            </v-card>

                        </v-col>
                        <!-- <v-col cols="12" md="9" class="pb-0" v-if="availableDays > 0"> -->
                            <v-col cols="12" class="pb-0" v-if="availableDays > 0">
                                <v-select v-model="timeoffRequestInfo.attendance_leave_type_id" variant="solo" flat
                                label="Leave Type" :items='leaveTypeList' item-title="name" item-value="id"
                                density="compact" required :rules="rules.required"
                                :disabled="!validEmployeeProfile"></v-select>
                        </v-col>

                        <!-- <v-col cols="12" md="3"  v-if="availableDays > 0">
                            <v-checkbox v-model="timeoffRequestInfo.paid" hide-details color="primary" label="Paid"
                                :disabled="!validEmployeeProfile"></v-checkbox>
                        </v-col> -->

                        <v-col cols="12" md="6" class="pb-0"  v-if="availableDays > 0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="Start Date"
                                v-model="timeoffRequestInfo.start_date" :min="getStartDateMin" :max="getStartDateMax"
                                :rules="rules.start_date" :disabled="!validEmployeeProfile"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0"  v-if="availableDays > 0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="End Date"
                                v-model="timeoffRequestInfo.end_date" :min="getEndDateMin" :max="getEndDateMax"
                                :rules="rules.end_date" :disabled="!validEmployeeProfile"></v-text-field>
                            <!-- <SharedDatePicker type="date" variant="solo" flat density="compact" v-model="timeoffRequestInfo.end_date" label="End Date"/> -->
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0"  v-if="availableDays > 0">
                            <v-text-field type="time" format="24hr" variant="solo" flat density="compact" label="Start Time"
                                v-model="timeoffRequestInfo.start_time" :allowed-minutes="allowedTimeStep"
                                :rules="rules.required" :max="getStartTimeMax"
                                :disabled="!validEmployeeProfile"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0"  v-if="availableDays > 0">
                            <v-text-field type="time" format="24hr" variant="solo" flat density="compact" label="End Time"
                                v-model="timeoffRequestInfo.end_time" :allowed-minutes="allowedTimeStep"
                                :rules="rules.required" :min="getEndTimeMin"
                                :disabled="!validEmployeeProfile"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0"  v-if="availableDays > 0">
                            <v-textarea v-model="timeoffRequestInfo.description" variant="solo" flat label="Description"
                                density="compact" :disabled="!validEmployeeProfile"></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0"  v-if="availableDays > 0">
                            <v-select variant="solo" flat density="compact" label="Status"
                                v-model="timeoffRequestInfo.status" required :items="['pending', 'accepted', 'rejected']"
                                :rules="rules.required" :disabled="!validEmployeeProfile"></v-select>
                        </v-col>
                        <v-col cols="12" class="pb-0"  v-if="availableDays > 0">
                            <v-textarea v-model="timeoffRequestInfo.comment" variant="solo" flat label="Status Comment"
                                density="compact" :disabled="!validEmployeeProfile"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save" v-if="availableDays > 0">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
