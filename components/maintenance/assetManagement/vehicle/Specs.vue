<template>
      <v-row >
        <v-col :cols="showSidePanel ? 12 : 6">      
            <v-card class="d-flex flex-column" height="300">
                <v-card-title class="d-flex justify-space-between "
                    style="position:sticky;top:0;z-index:1;background:white;">
                    <span class="text-h7 font-weight-bold text-primary">Dimensions</span>
                    <v-btn color="primary" density="comfortable" variant="tonal" @click="saveDimensions">Save</v-btn>
                </v-card-title>
                <v-card-text class="pt-3" style="overflow-y:auto;">
                    <v-form ref="dimensionsForm">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.width" :rules=[validation.required]
                                    density="compact" label="Width"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.height"
                                    :rules=[validation.required] density="compact" label="Height"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.length"
                                    :rules=[validation.required] density="compact" label="Length"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.interior_volume"
                                    :rules=[validation.required] density="compact"
                                    label="Interior Volume"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.passenger_volume"
                                    :rules=[validation.required] density="compact"
                                    label="Passenger Volume"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.cargo_volume"
                                    :rules=[validation.required] density="compact" label="Cargo Volume"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.ground_clearance"
                                    :rules=[validation.required] density="compact"
                                    label="Ground Clearance"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.bed_length"
                                    :rules=[validation.required] density="compact" label="Bed Length"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.body_type"
                                    :rules=[validation.required] density="compact" label="Body Type"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" v-model="dimensions.body_subtype"
                                    :rules=[validation.required] density="compact" label="Body SubType"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>

        <v-card class="mt-3">
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Weight</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveWeight">Save</v-btn>
            </v-card-title>
            <v-card-text>
                <v-form ref="weightForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="weight.curb_weight" variant="outlined" :rules=[validation.required]
                                density="compact" label="Curb Weight"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="weight.gross_vehicle_weight_rating" variant="outlined"
                                :rules=[validation.required] density="compact"
                                label="Gross Vehicle Weight Rating"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <v-card class="mt-3">
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Peformance</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="savePeformance">Save</v-btn>
            </v-card-title>

            <v-card-text>
                <v-form ref="performanceForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="performance.towing_capacity" variant="outlined"
                                :rules=[validation.required] density="compact" label="Towing Capacity"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="performance.max_payload" variant="outlined"
                                :rules=[validation.required] density="compact" label="Max Payload"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="performance.max_hp" variant="outlined"
                                :rules=[validation.required] density="compact" label="Max HP"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="performance.max_torque" variant="outlined"
                                :rules=[validation.required] density="compact" label="Max Torque"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="performance.redline_rpm" variant="outlined"
                                :rules=[validation.required] density="compact" label="Redline RPM"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <v-card class="mt-3">
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Fuel Economy</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveFuelEconomy">Save</v-btn>
            </v-card-title>
            <v-card-text>
                <v-form ref="fuelEconomyForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.epa_city" variant="outlined"
                                :rules=[validation.required] density="compact" label="EPA City"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.epa_highway" variant="outlined"
                                :rules=[validation.required] density="compact" label="EPA Highway"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.epa_combined" variant="outlined"
                                :rules=[validation.required] density="compact" label="EPA Combined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.epa_highway" variant="outlined"
                                :rules=[validation.required] density="compact" label="Fuel Type"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.fuel_tank_1_capacity" variant="outlined"
                                :rules=[validation.required] density="compact" label="Fuel Tank 1 Capacity"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.fuel_tank_2_capacity" variant="outlined"
                                :rules=[validation.required] density="compact" label="Fuel Tank 2 Capacity"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.fuel_induction" variant="outlined"
                                :rules=[validation.required] density="compact" label="Fuel Induction"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="fuel_economy.fuel_quality" variant="outlined"
                                :rules=[validation.required] density="compact" label="Fuel Quality"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-col>

    <v-col :cols="showSidePanel ? 12 : 6">
        <v-card class="d-flex flex-column" height="300">
            <v-card-title class="d-flex justify-space-between "
                style="position:sticky;top:0;z-index:1;background:white;">
                <span class="text-h7 font-weight-bold text-primary">Engine</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveEngine">Save</v-btn>
            </v-card-title>
            <v-card-text class="pt-3" style="overflow-y:auto;">
                <v-form ref="engineForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_summary" variant="outlined" :rules=[validation.required]
                                density="compact" label="Engine Summary"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_brand" variant="outlined" :rules=[validation.required]
                                density="compact" label="Engine Brand"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_aspiration" variant="outlined" :rules=[validation.required]
                                density="compact" label="Aspiration"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_block_type" variant="outlined" :rules=[validation.required]
                                density="compact" label="Block Type"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_bore" variant="outlined" :rules=[validation.required]
                                density="compact" label="Bore"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_cam_type" variant="outlined" :rules=[validation.required]
                                density="compact" label="Cam Type"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_compression" variant="outlined" :rules=[validation.required]
                                density="compact" label="Compression"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_cylinders" variant="outlined" :rules=[validation.required]
                                density="compact" label="Cylinders"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_displacement" variant="outlined" :rules=[validation.required]
                                density="compact" label="Displacement"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.oil_capacity" variant="outlined"
                                :rules=[validation.required] density="compact" label="Oil Capacity"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_stroke" variant="outlined" :rules=[validation.required]
                                density="compact" label="Stroke"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="engine.engine_valves" variant="outlined" :rules=[validation.required]
                                density="compact" label="Valves"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
        </v-card>

        <v-card class="mt-3">
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Transmission</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveTransmission">Save</v-btn>
            </v-card-title>
            <v-card-text>
                <v-form ref="transmissionForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="transmission.transmission_summary" variant="outlined"
                                :rules=[validation.required] density="compact"
                                label="Transmission Summary"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="transmission.transmission_brand" variant="outlined" :rules=[validation.required]
                                density="compact" label="Transmission Brand"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="transmission.transmission_type" variant="outlined" :rules=[validation.required]
                                density="compact" label="Transmission Type"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="transmission.transmission_gears" variant="outlined" :rules=[validation.required]
                                density="compact" label="Transmission Gears"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <v-card class="mt-3">
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Wheels & Tires</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveWheelsAndTires">Save</v-btn>
            </v-card-title>
            <v-card-text>
                <v-form ref="wheelsAndTiresForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="wheels_tires.drive_type" variant="outlined"
                                :rules=[validation.required] density="compact" label="Drive Type"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="wheels_tires.brake_system" variant="outlined"
                                :rules=[validation.required] density="compact" label="Brake System"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="wheels_tires.front_track_width" variant="outlined"
                                :rules=[validation.required] density="compact" label="Front Track Width"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="wheels_tires.rear_track_width" variant="outlined"
                                :rules=[validation.required] density="compact" label="Rear Track Width"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>

        </v-card>
    </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref} from 'vue';
import 'apexcharts/dist/apexcharts.css';
import type { Asset, Dimensions, Weight, Peformance, FuelEconomy, Engine, Transmission, WheelsAndTires } from '~/types/maintenance/assetTypes';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
    item: {
        type: Object as PropType<Asset>,
        require: true,
        default: {} as Asset
    },
    showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['save'])

const dimensionsForm = ref<HTMLFormElement | null>(null)
const weightForm = ref<HTMLFormElement | null>(null)
const performanceForm = ref<HTMLFormElement | null>(null)
const fuelEconomyForm = ref<HTMLFormElement | null>(null)
const engineForm = ref<HTMLFormElement | null>(null)
const transmissionForm = ref<HTMLFormElement | null>(null)
const wheelsAndTiresForm = ref<HTMLFormElement | null>(null)

const dimensions = ref<Partial<Dimensions>>(JSON.parse(JSON.stringify(props.item.dimensions || {})) as Partial<Dimensions>)
const weight = ref<Partial<Weight>>(JSON.parse(JSON.stringify(props.item.weight || {})) as Partial<Weight>)
const performance = ref<Partial<Peformance>>(JSON.parse(JSON.stringify(props.item.performance || {})) as Partial<Peformance>)
const fuel_economy = ref<Partial<FuelEconomy>>(JSON.parse(JSON.stringify(props.item.fuel_economy || {})) as Partial<FuelEconomy>)
const engine = ref<Partial<Engine>>(JSON.parse(JSON.stringify(props.item.engine || {})) as Partial<Engine>)
const transmission = ref<Partial<Transmission>>(JSON.parse(JSON.stringify(props.item.transmission || {})) as Partial<Transmission>)
const wheels_tires = ref<Partial<WheelsAndTires>>(JSON.parse(JSON.stringify(props.item.wheels_tires || {})) as Partial<WheelsAndTires>)

watch(props.item, (newVal, oldVal) => {
    dimensions.value = newVal.dimensions || {} as Dimensions
    weight.value = newVal.weight || {} as Weight
    performance.value = newVal.performance || {} as Peformance
    fuel_economy.value = newVal.fuel_economy || {} as FuelEconomy
    engine.value = newVal.engine || {} as Engine
    transmission.value = newVal.transmission || {} as Transmission
    wheels_tires.value = newVal.wheels_tires || {} as WheelsAndTires
})

const saveDimensions = async () => {
    const formStatus = await dimensionsForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { dimensions: dimensions.value });
};

const saveWeight = async () => {
    const formStatus = await weightForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { weight: weight.value });
};

const savePeformance = async () => {
    const formStatus = await performanceForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { performance: performance.value });
};

const saveFuelEconomy = async () => {
    const formStatus = await fuelEconomyForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { fuel_economy: fuel_economy.value });
};

const saveEngine = async () => {
    const formStatus = await engineForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { engine: engine.value });
};

const saveTransmission = async () => {
    const formStatus = await transmissionForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { transmission: transmission.value });
};

const saveWheelsAndTires = async () => {
    const formStatus = await wheelsAndTiresForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { wheels_tires: wheels_tires.value });
};

</script>