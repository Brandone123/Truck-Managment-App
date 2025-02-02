<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Tire Removal</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="laborForm">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field type="date" variant="solo" flat density="compact"
                                v-model="localTireRemoval.removal_date" label="Removal Date" :max="today"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field variant="solo" flat density="compact"
                                v-model="localTireRemoval.mileage_at_removal" type="number" label="Mileage"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field step="1" type="number" variant="solo" flat density="compact"
                                v-model="localTireRemoval.tread_depth" label="Tread Depth"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field step="1" type="number" variant="solo" flat density="compact"
                                v-model="localTireRemoval.pressure" label="Pressure"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="solo" flat density="compact"
                                v-model="localTireRemoval.reason_for_removal" label="Reason for removal"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
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
import type { Tire, TireInstallation, TireRemoval } from '~/types/maintenance/tireTypes';

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
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

const laborForm = ref<HTMLFormElement | null>(null)

const localWorkOrderLabor = ref<Partial<Labor>>({})
const localTireRemoval = ref<Partial<TireRemoval>>({});

const today = computed(() => {
    return new Date().toISOString().substring(0, 10);
})

const save = async () => {
    const formStatus = await laborForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    let payload = { ...localTireRemoval.value, labor: localWorkOrderLabor.value }
    emit('save', JSON.parse(JSON.stringify(payload)))
    dialog.value = false
}


const updateHourlyLaborRate = (technician: EmployeeInfo) => {
    localWorkOrderLabor.value.hourly_labor_rate = technician.hourly_labour_rate
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