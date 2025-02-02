<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="laborForm">
                    <div v-if="localWorkOrderLabor.id">
                        <p>Current Service Task</p>
                        <p>{{ currentServiceTask?.name }}</p>
                    </div>
                    <v-row :class="{ 'mt-3': localWorkOrderLabor.id }">
                        <v-col cols="12">
                            <SharedInputTechnicianNameAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localWorkOrderLabor.user_id" label="Technician" :rules="[validation.required]"
                                @selection="updateHourlyLaborRate" />
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localWorkOrderLabor.start_time"
                                label="Start Time" @input="calculateHrs()" type="datetime-local"
                                :max="localWorkOrderLabor.end_time">
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localWorkOrderLabor.end_time"
                                label="End Time" @input="calculateHrs()" type="datetime-local"
                                :min="localWorkOrderLabor.start_time">
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localWorkOrderLabor.hours" label="Duration" readonly>
                                <template v-slot:append-inner>hr</template>
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field @input="computeLaborSubtotal()" variant="solo" flat density="compact"
                                v-model.number="localWorkOrderLabor.hourly_labor_rate" label="Hourly Rate"
                                :rules="[validation.required, validation.minNumber(0.01)]" type="number" :min="0.01">
                                <template v-slot:prepend-inner>$</template>
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" v-if="!addingToLineItem && !localWorkOrderLabor.id">
                            <SharedInputServiceTaskAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localWorkOrderLabor.service_task_id"
                                label="Select Service Task*" :rules="[validation.required]" />
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <v-textarea variant="solo" flat density="compact" v-model="localWorkOrderLabor.notes"
                                label="Notes" :rows="3"></v-textarea>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localWorkOrderLabor.hours }}hrs x
                                        ${{ localWorkOrderLabor.hourly_labor_rate }} / hr</span>
                                </span>
                                <span class="text-h6">${{ localWorkOrderLabor.subtotal }}</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn v-if="laborItem.id" color="error" variant="text" @click="deleteItem">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Labor } from '~/types/maintenance/workOrder';
import { useValidation } from '~/composables/formValidation';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import type { EmployeeInfo } from '~/types/store/employee'

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    laborItem: {
        type: Object as PropType<Partial<Labor>>,
        required: true,
        // default: () => { return {} as Partial<Labor> }
    },
    currentServiceTask: {
        type: Object as PropType<Partial<ServiceTask>>,
        required: false,
        default: () => { return {} as Partial<ServiceTask> }
    },
    addingToLineItem: {
        type: Boolean,
        required: false,
        default: false,
    }
})

const emit = defineEmits(['update:modelValue', 'close', 'save', 'delete']);

const dialog = computed({
    get() {
        return props.modelValue;
    }, set(value) {
        emit('update:modelValue', value)
    }
})

const title = computed(() => {
    return props.laborItem.id ? 'Edit Labor' : 'Add Labor'
})

const laborForm = ref<HTMLFormElement | null>(null)

const localWorkOrderLabor = ref<Partial<Labor>>(JSON.parse(JSON.stringify(props.laborItem)))

const laborEntryFirstEmit = ref(true)

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        localWorkOrderLabor.value = JSON.parse(JSON.stringify(props.laborItem))
        calculateHrs()
    }
})


watch(() => localWorkOrderLabor.value.hourly_labor_rate, (newVal) => {
    if (newVal && newVal < 0) {
        localWorkOrderLabor.value.hourly_labor_rate = Math.abs(newVal)
    }
})

const save = async () => {
    const formStatus = await laborForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    emit('save', JSON.parse(JSON.stringify(localWorkOrderLabor.value)))
    dialog.value = false
}

const deleteItem = () => {
    emit('delete', props.laborItem)
}

const updateHourlyLaborRate = (technician: EmployeeInfo) => {
    if (!laborEntryFirstEmit.value || !localWorkOrderLabor.value.id) {
        localWorkOrderLabor.value.hourly_labor_rate = technician.hourly_labour_rate
    }
    laborEntryFirstEmit.value = false
}

const computeLaborSubtotal = () => {
    localWorkOrderLabor.value.subtotal = parseFloat(((localWorkOrderLabor.value.hourly_labor_rate ?? 0) * (localWorkOrderLabor.value.hours ?? 0)).toFixed(2))
}

const calculateHrs = () => {
    if (localWorkOrderLabor.value.start_time && localWorkOrderLabor.value.end_time) {
        try {
            localWorkOrderLabor.value.hours = getTimeDiffHours(localWorkOrderLabor.value.start_time, localWorkOrderLabor.value.end_time)
            computeLaborSubtotal()
        }
        catch (e) {
            //fail silently
            // console.log(e)
        }
    }
}

const getTimeDiffHours = (date1: string, date2: string) => {
    const Date1: Date = new Date(date1)
    const Date2: Date = new Date(date2)

    if (isNaN(Date1.getTime()) || isNaN(Date2.getTime())) {
        throw new Error("Invalid date format. Please provide valid date strings.");
    }

    const diffMs = Math.abs(Date2.getTime() - Date1.getTime());
    return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(3));
}

</script>