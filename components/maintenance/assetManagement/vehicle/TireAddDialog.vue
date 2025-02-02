<template>
    <v-dialog v-model="dialog" max-width="800px" max-heigth="500px" scrollable>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Install Tire</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="tireForm">
                    <v-row>
                        <v-col cols="12">
                            <SharedInputPartNumberAutoCompleteInput variant="outlined" flat density="compact"
                                v-model="localTire.part_id" label="Part" :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field variant="outlined" flat density="compact" v-model="localTire.tire_model"
                                type="number" label="Model" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field variant="outlined" flat density="compact" v-model="localTire.brand"
                                label="Brand"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field step="1" type="number" variant="outlined" flat density="compact"
                                v-model="localTire.size" label="Size" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field step="1" type="datetime-local" variant="outlined" flat density="compact"
                                v-model="localTire.purchase_date" label="Purchase Date"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field variant="outlined" type="number" flat density="compact"
                                v-model="localTire.cost" label="Cost" :rules="[validation.required]"></v-text-field>
                        </v-col>
                    </v-row>

                    <!-- tire Installation -->
                    <v-row>
                        <v-col cols="12">
                            <TirePosition variant="outlined" flat density="compact" v-model="tireInstallation.position"
                                :tireLayout="configuration.tireLayout" :selectedAxle="selectedAxles"
                                :rules="[validation.required]" :installedPositions="alreadyInstalledPositions" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                                v-model="tireInstallation.tread_depth" type="number" label="Tread Depth"
                                :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact" v-model="tireInstallation.pressure"
                                type="number" label="Pressure" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                                v-model="tireInstallation.mileage_at_installation" type="number"
                                label="Mileage at installation" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-checkbox label="New Tire" variant="outlined" flat density="compact" color="primary"
                                v-model="tireInstallation.is_new"></v-checkbox>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field label="Installation Date" type="date" variant="outlined" flat
                                density="compact" v-model="tireInstallation.installation_date"
                                :rules="[validation.required]" :max="today"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <SharedInputTechnicianNameAutoCompleteInput label="Installed By" variant="outlined" flat
                                density="compact" v-model="tireInstallation.installed_by"
                                :rules="[validation.required]">
                            </SharedInputTechnicianNameAutoCompleteInput>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="error" @click="dialog = false">
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { Tire, TireInstallation } from '~/types/maintenance/tireTypes';
import TirePosition from '../tireManagement/component/TirePosition.vue'
const validation = useValidation();

const props = defineProps({
    modelValue: Boolean,
    selectedPosition: {
        type: String,
        required: false,
    },
    configuration: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    tirePlacement: {
        type: Object as PropType<Record<string, any>>,
        required: false,
        default: () => { return {} }
    }
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const tireForm = ref<HTMLFormElement | null>(null);
const localTire = ref<Partial<Tire>>({});

const dialog = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value);
    }
})

const tireInstallation = ref<Partial<TireInstallation>>({});

const today = computed(() => {
    return new Date().toISOString().substring(0, 10);
})

const alreadyInstalledPositions = computed(() => {
    return Object.keys(props.tirePlacement)
})

const selectedAxles = computed(() => {
    return props.configuration?.axles ?? {}
})

const save = async () => {
    const formStatus = await tireForm.value?.validate();
    if (!formStatus.valid) {
        return;
    }
    const payload = { ...localTire.value, installation: tireInstallation.value }
    emit('save', JSON.parse(JSON.stringify(payload)));
    dialog.value = false;
}

const reset = () => {
    tireInstallation.value = {}
    localTire.value = {}
}

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        reset()
        if (props.selectedPosition) {
            tireInstallation.value.position = props.selectedPosition
        }
    }
})

watch(
    () => tireInstallation.value.position,
    (newVal) => {
        if (newVal?.length) {
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

<style scoped></style>
