<script setup  lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';

const emit = defineEmits(['update:show', 'update:editInfo', 'update:addInfo'])

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList } = storeToRefs(leaveTypeStore)

const props = defineProps({
    item: {
        type: Object as () => TimeoffRequest,
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
    employee: {
        type: Object,
        default: false
    }
});


const timeoffRequestForm: Ref<HTMLFormElement | null> = ref(null);
const timeoffRequestInfo = ref<TimeoffRequest>({
    status: 'pending',
})

const getStartDateMin = computed(() => {
    return new Date().toISOString().slice(0, 10)
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

const rules = computed(() => {
    return {
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

const title = computed(() => {
    return props.updating ? 'Timeoff Request Info' : 'New Timeoff Request'
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

const save = async () => {
    if (timeoffRequestForm.value) {
        const formStatus = await timeoffRequestForm.value.validate()
        if (!formStatus.valid) {
            return
        }

        let data = Object.assign({}, timeoffRequestInfo.value)
        if (props.updating) {
            //updating timeoff request
            emit('update:editInfo', data);
        } else {
            //adding timeoff request
            data.employee_id = props.employee.id
            emit('update:addInfo', data);
        }
        dialog.value = false
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        timeoffRequestInfo.value = Object.assign({}, props.item as TimeoffRequest)
    } else {
        timeoffRequestInfo.value = { status: 'pending' }
    }
})

</script>

<template>
    <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" density="comfortable" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                New TimeOff Request
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
                        <v-col cols="12" md="10" class="pb-0">
                            <v-select v-model="timeoffRequestInfo.attendance_leave_type_id" variant="solo" flat
                                label="Leave Type" :items='leaveTypeList' item-title="name" item-value="id"
                                density="compact" required :rules="rules.required"></v-select>
                        </v-col>
                        <v-col cols="12" md="2" class="pb-0">
                            <v-checkbox label="Paid"></v-checkbox>
                        </v-col>

                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="Start Date"
                                v-model="timeoffRequestInfo.start_date" required :min="getStartDateMin"
                                :max="getStartDateMax" :rules="rules.start_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="date" variant="solo" flat density="compact" label="End Date"
                                v-model="timeoffRequestInfo.end_date" required :min="getEndDateMin"
                                :rules="rules.end_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="time" variant="solo" flat density="compact" label="Start Time"
                                v-model="timeoffRequestInfo.start_time" :rules="rules.required"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field type="time" variant="solo" flat density="compact" label="End Time"
                                v-model="timeoffRequestInfo.end_time" :rules="rules.required"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-if="props.updating">
                            <v-select readonly variant="solo" flat density="compact" label="Status"
                                v-model="timeoffRequestInfo.status" :items="['pending', 'accepted', 'rejected']"
                                :rules="rules.required"></v-select>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-textarea v-model="timeoffRequestInfo.description" variant="solo" flat label="Comment"
                                density="compact"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider v-if="['pending', 'rejected'].includes(timeoffRequestInfo.status as string)"></v-divider>
            <v-card-actions v-if="['pending', 'rejected'].includes(timeoffRequestInfo.status as string)">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
