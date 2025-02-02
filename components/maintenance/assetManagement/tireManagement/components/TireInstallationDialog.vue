<template>
    <v-dialog v-model="dialog" scrollable fullscreen>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Tire Installation</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="tireInstallationForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-card>
                                <v-card-title>Tire Information</v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" sm="6">
                                            <SharedInputPartNumberAutoCompleteInput variant="outlined" flat
                                                density="compact" v-model="localPart.part_id" label="Select A Part*"
                                                category="tires" :rules="[validation.required]"
                                                @selection="updateSelectedPart" />
                                        </v-col>

                                        <!-- select a location right dropdown -->
                                        <v-col cols="12" sm="6">
                                            <v-autocomplete :disabled="!localPart.part_id" variant="outlined" flat
                                                density="compact" :items="selectedLocations" item-title="location_name"
                                                item-value="location_id" v-model="localPart.part_location_id"
                                                label="Select A Part Location*" persistent-hint
                                                hint="This will make an inventory adjustment"
                                                :rules="[validation.required]">

                                                <template v-slot:selection="{ item }">
                                                    <span v-if="item.raw.location_name">{{ item.raw?.location_name }}
                                                        ({{
                                                            item.raw?.quantity }})</span>
                                                </template>
                                                <template v-slot:item="{ props, item }">
                                                    <v-list-item v-bind="props" title="">
                                                        <v-list-item-title class="d-flex justify-space-between">
                                                            <span>{{ item.raw.location_name }}</span>
                                                            <span>
                                                                <v-chip v-if="item.raw.quantity == 0"
                                                                    class="text-caption" variant="tonal" color="error"
                                                                    density="compact">Out of
                                                                    Stock</v-chip>
                                                                {{ item.raw.quantity }}
                                                            </span>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                        <!-- quantity label bruh -->
                                        <v-col cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model.number="localPart.quantity" label="Quantity*" type="number"
                                                required @input="calculatePartSubtotal()"
                                                :rules="[validation.required, validation.minNumber(1)]"
                                                :min="1"></v-text-field>
                                        </v-col>
                                        <!-- unit cost label -->
                                        <v-col cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model.number="localPart.unit_cost" label="Unit Cost*" type="number"
                                                @input="calculatePartSubtotal()"
                                                :rules="[validation.required, validation.minNumber(0.01)]"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field type="number" variant="outlined" flat density="compact"
                                                v-model="localTire.size" label="Size"
                                                :rules="[validation.required]"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field type="number" variant="outlined" flat density="compact"
                                                v-model="localTire.serial_number" label="Serial Number"
                                                :rules="[validation.required]"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-textarea variant="outlined" flat density="compact"
                                                v-model="localPart.notes" label="Notes" :rows="3"></v-textarea>
                                        </v-col>
                                        <v-col class="pt-0" cols="12">
                                            <div class="d-flex justify-space-between">
                                                <span>
                                                    <span class="text-h6">Subtotal</span><br>
                                                    <span class="text-caption">{{ localPart.quantity }} x
                                                        ${{ localPart.unit_cost }}</span>
                                                </span>
                                                <span class="text-h6">${{ localPart.subtotal }}</span>
                                            </div>
                                        </v-col>

                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-card>
                                <v-card-title>Labor Information</v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <SharedInputTechnicianNameAutoCompleteInput variant="outlined" flat
                                                density="compact" v-model="localLabor.user_id" label="Technician"
                                                :rules="[validation.required]" @selection="updateHourlyLaborRate" />
                                        </v-col>
                                        <v-col class="pt-0" cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model="localLabor.start_time" label="Start Time"
                                                @input="calculateHrs()" type="datetime-local"
                                                :max="localLabor.end_time">
                                            </v-text-field>
                                        </v-col>
                                        <v-col class="pt-0" cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model="localLabor.end_time" label="End Time" @input="calculateHrs()"
                                                type="datetime-local" :min="localLabor.start_time">
                                            </v-text-field>
                                        </v-col>
                                        <v-col class="pt-0" cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model.number="localLabor.hours" label="Duration" readonly>
                                                <template v-slot:append-inner>hr</template>
                                            </v-text-field>
                                        </v-col>
                                        <v-col class="pt-0" cols="12" sm="6">
                                            <v-text-field @input="computeLaborSubtotal()" variant="outlined" flat
                                                density="compact" v-model.number="localLabor.hourly_labor_rate"
                                                label="Hourly Rate"
                                                :rules="[validation.required, validation.minNumber(0.01)]" type="number"
                                                :min="0.01">
                                                <template v-slot:prepend-inner>$</template>
                                            </v-text-field>
                                        </v-col>
                                        <v-col class="pt-0" cols="12">
                                            <v-textarea variant="outlined" flat density="compact"
                                                v-model="localLabor.notes" label="Notes" :rows="3"></v-textarea>
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
                                </v-card-text>
                            </v-card>
                        </v-col>


                        <v-col cols="12">
                            <v-card>
                                <v-card-title>Tire Installation</v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <TirePosition variant="outlined" flat density="compact"
                                                v-model="tireInstallation.position" :tireLayout="tireLayout"
                                                :selectedAxle="axles" :rules="[validation.required]"
                                                :installedPositions="alreadyInstalledPositions" />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model="tireInstallation.tread_depth" type="number" label="Tread Depth"
                                                :max="999.99" :min="1"
                                                :rules="[validation.required, validation.maxNumber(999.99)]"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field variant="outlined" flat density="compact"
                                                v-model="tireInstallation.pressure" type="number" label="Pressure"
                                                :rules="[validation.required]"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field :disabled="tireInstallation.is_new" variant="outlined" flat
                                                density="compact" v-model="tireInstallation.mileage_at_installation"
                                                type="number" label="Mileage at installation"
                                                :rules="[validation.required]"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-checkbox label="New Tire" variant="outlined" flat density="compact"
                                                color="primary" v-model="tireInstallation.is_new"></v-checkbox>
                                        </v-col>

                                        <!-- <v-col cols="12" sm="6">
                                            <v-text-field label="Installation Date" type="date" variant="outlined" flat
                                                density="compact" v-model="tireInstallation.installation_date"
                                                :rules="[validation.required]" :max="today"></v-text-field>
                                        </v-col> -->

                                        <!-- <v-col cols="12" sm="6">
                                            <SharedInputTechnicianNameAutoCompleteInput label="Installed By"
                                                :fetchData="false" variant="outlined" flat density="compact"
                                                v-model="tireInstallation.installed_by" :rules="[validation.required]">
                                            </SharedInputTechnicianNameAutoCompleteInput>
                                        </v-col> -->
                                    </v-row>
                                </v-card-text>
                            </v-card>
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
import type { Part, Labor } from '~/types/maintenance/workOrder';
import type { Location } from '~/types/maintenance/partSupplyTypes';
import { useValidation } from '~/composables/formValidation';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import type { EmployeeInfo } from '~/types/store/employee'
import type { Tire, TireInstallation, TireRemoval } from '~/types/maintenance/tireTypes';
import TirePosition from './TirePosition.vue'

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    alreadyInstalledPositions: {
        type: Array as PropType<String[]>,
        required: false,
        default: []
    },
    selectedAxles: {
        type: Object as any,
        required: false,
        default: {}
    },
    tireLayout: {
        type: String,
        required: true
    },
    axles: {
        type: Array,
        required: true
    },
    installationPosition: {
        type: String,
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

const tireInstallationForm = ref<HTMLFormElement | null>(null)


const localPart = ref<Partial<Part>>({})
const selectedPart = ref<Partial<Part>>({})
const localLabor = ref<Partial<Labor>>({})
const selectedLocations = ref<Location[]>([])
const localTire = ref<Partial<Tire>>({})
const tireInstallation = ref<Partial<TireInstallation>>({});

const reset = () => {
    localPart.value = {}
    selectedPart.value = {}
    localLabor.value = {}
    selectedLocations.value = []
    localTire.value = {}
    tireInstallation.value = {}
}

const today = computed(() => {
    return new Date().toISOString().substring(0, 10);
})

const updateSelectedPart = (part: Part) => {
    selectedPart.value = part
    selectedLocations.value = part.locations as Location[]
}

const save = async () => {
    const formStatus = await tireInstallationForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    let payload = { ...localTire.value, installation: tireInstallation.value, part: localPart.value, labor: localLabor.value }
    emit('save', JSON.parse(JSON.stringify(payload)))
    dialog.value = false
}

const calculatePartSubtotal = () => {
    localPart.value.subtotal = parseFloat(((localPart.value.unit_cost ?? 0) * (localPart.value.quantity ?? 0)).toFixed(2))
}

const updateHourlyLaborRate = (technician: EmployeeInfo) => {
    console.log(technician)
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

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        if (props.installationPosition?.length) {
            tireInstallation.value.position = props.installationPosition
        }
    } else {
        reset()
    }
})

watch(
    () => tireInstallation.value.position,
    (newVal) => {
        if (newVal) {
            const firstChar = newVal.charAt(0);
            if (firstChar === "L" || firstChar === "R") {
                tireInstallation.value.axle = '1'
            } else if (!isNaN(Number(firstChar))) {
                tireInstallation.value.axle = firstChar
            }
        }
    },
);

</script>