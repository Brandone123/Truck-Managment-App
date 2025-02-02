<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Tire Rotation</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="laborForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <TirePosition variant="solo" flat density="compact" v-model="tireRotation.from_position"
                                :tireLayout="tireLayout" :selectedAxle="selectedAxles" :rules="[validation.required]"
                                label="From Location" :installedPositions="alreadyInstalledPositions"
                                :onlyInstalledPositions="true" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <TirePosition variant="solo" flat density="compact" v-model="tireRotation.to_position"
                                :tireLayout="tireLayout" :selectedAxle="selectedAxles" :rules="[validation.required]"
                                label="To Location" :installedPositions="alreadyInstalledPositions" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model="tireRotation.mileage_at_rotation" type="number" label="Mileage At Rotation"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Rotation Date" type="date" variant="solo" flat density="compact"
                                v-model="tireRotation.rotation_date" :rules="[validation.required]"
                                :max="today"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <SharedInputTechnicianNameAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localLabor.user_id" label="Technician" :rules="[validation.required]"
                                @selection="updateHourlyLaborRate" />
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localLabor.start_time"
                                label="Start Time" @input="calculateHrs()" type="datetime-local"
                                :max="localLabor.end_time">
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localLabor.end_time"
                                label="End Time" @input="calculateHrs()" type="datetime-local"
                                :min="localLabor.start_time">
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model.number="localLabor.hours"
                                label="Duration" readonly>
                                <template v-slot:append-inner>hr</template>
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field @input="computeLaborSubtotal()" variant="solo" flat density="compact"
                                v-model.number="localLabor.hourly_labor_rate" label="Hourly Rate"
                                :rules="[validation.required, validation.minNumber(0.01)]" type="number" :min="0.01">
                                <template v-slot:prepend-inner>$</template>
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <v-textarea variant="solo" flat density="compact" v-model="localLabor.notes" label="Notes"
                                :rows="3"></v-textarea>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localLabor.hours }}hrs x
                                        ${{ localLabor.hourly_labor_rate }} / hr</span>
                                </span>
                                <span class="text-h6">${{ localLabor.subtotal }}</span>
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
import type { Tire, TireRotation } from '~/types/maintenance/tireTypes';
import TirePosition from './TirePosition.vue'

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    tire: {
        type: Object as PropType<Tire>,
        required: true
    },
    tirePlacement: {
        required: true
    },
    alreadyInstalledPositions: {
        type: Array as PropType<String[]>,
        required: false,
        default: []
    },
    selectedAxles: {
        required: false,
        default: {}
    },
    tireLayout: {
        type: String,
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

const localLabor = ref<Partial<Labor>>({})
const tireRotation = ref<Partial<TireRotation>>({});

const today = computed(() => {
    return new Date().toISOString().substring(0, 10);
})

const save = async () => {
    const formStatus = await laborForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    let payload = { ...tireRotation.value, labor: localLabor.value }
    emit('save', JSON.parse(JSON.stringify(payload)))
    dialog.value = false
}

const updateHourlyLaborRate = (technician: EmployeeInfo) => {
    localLabor.value.hourly_labor_rate = technician.hourly_labour_rate
}

const computeLaborSubtotal = () => {
    localLabor.value.subtotal = parseFloat(((localLabor.value.hourly_labor_rate ?? 0) * (localLabor.value.hours ?? 0)).toFixed(2))
}

const calculateHrs = () => {
    if (localLabor.value.start_time && localLabor.value.end_time) {
        try {
            localLabor.value.hours = getTimeDiffHours(localLabor.value.start_time, localLabor.value.end_time)
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

const reset = () => {
    localLabor.value = {}
    tireRotation.value = {}
}

watch(() => dialog.value, async (newVal) => {
    if (newVal) {
        reset()
        if (props.tire?.current_installation) {
            tireRotation.value.from_position = props.tire.current_installation?.position
        }
    }
})

</script>