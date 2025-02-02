<template>
    <v-row>
        <v-col cols="12" :md="showSidePanel ? 12 : 6">
            <v-card class="h-100">
                <v-card-text class="h-100">
                    <div v-if="tireLayoutManager == null || loadingTirePlacement"
                        class="d-flex h-100 justify-center align-center">
                        <v-progress-circular v-if="loadingTirePlacement || loading" :size="70" :width="7"
                            color="primary" indeterminate></v-progress-circular>
                        <div v-else-if="!vehicle.axle_configuration" class="d-flex flex-column align-center">
                            <span class="mb-3">No axle configuration</span>
                            <v-btn density="comfortable" color="primary" @click="axleConfigDialog = true">Set Axle
                                Configuration</v-btn>
                        </div>

                    </div>

                    <div id="tireContiner" style="max-width:70%;margin:0 auto;">
                    </div>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col :cols="showSidePanel ? 12 : 6">
            <v-card style="overflow-y:auto;">
                <div class=" px-3 pt-3 d-flex justify-space-between">
                    <span class="text-h6 font-weight-bold text-primary">Installed Tires
                    </span>
                    <span v-if="tireLayoutManager">
                        <v-btn density="comfortable" variant="outlined" class="text-primary ml-2" @click="installTire">
                            <v-icon>mdi-plus</v-icon>Add
                        </v-btn>
                    </span>
                </div>
                <template v-if="installedTires" v-for="(tire, i) in installedTires ?? []" :key="i">
                    <InstalledTire :tire="tire" @remove="removeTire(tire)" @rotate="rotateTire(tire)" />
                    <v-divider v-if="i < installedTires.length - 1"></v-divider>
                </template>
                <div v-else class="pa-4" style="font-size:small; color:grey; text-align: center;">
                    <span><v-icon size="150">mdi-tire</v-icon></span>
                    <p>There are no tires installed on this vehicle yet.</p>
                </div>
            </v-card>
        </v-col>

        <TireRotationDialog v-model="tireRotationDialog" :tire="(selectedTire as Tire)" :tirePlacement="tirePlacement"
            :alreadyInstalledPositions="alreadyInstalledPositions" :selectedAxles="selectedAxles"
            :tireLayout="vehicle.axle_configuration?.tireLayout || ''" @save="saveTireRotation" />

        <TireInstallationDetails v-model="tireInstallationDetailsDialog" :tire="(selectedTire as Tire)" />

        <TireRemovalDialog v-model="tireRemovalDialog" @save="saveTireRemoval" />

        <TireInstallationDialog v-model="tireInstallationDialog" :alreadyInstalledPositions="alreadyInstalledPositions"
            :selectedAxles="selectedAxles" :tireLayout="vehicle.axle_configuration?.tireLayout || ''"
            :axles="vehicle.axle_configuration?.axles" @save="saveTireInstallation"
            :installationPosition="installationPosition" />

        <AxleConfigSelectionDialog v-model="axleConfigDialog" :configuration="axleConfiguration"
            @update:configuration="setAxleConfiguration" />
    </v-row>

    <!-- </v-card-text>
    </v-card> -->
</template>


<script setup lang="ts">
import { defineEmits, defineProps, computed, ref, watch } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { Tire, TireInstallation } from '~/types/maintenance/tireTypes';
import type { Asset } from '~/types/maintenance/assetTypes';
import TirePosition from './components/TirePosition.vue'
import TireLayoutManager from '~/utils/tireManager';
import InstalledTire from './components/InstalledTire.vue';
import TireInstallationDetails from './TireInstallationDetails.vue';
import TireRemovalDialog from './components/TireRemovalDialog.vue';
import TireRotationDialog from './components/TireRotationDialog.vue';
import TireInstallationDialog from './components/TireInstallationDialog.vue';
import AxleConfigSelectionDialog from '../vehicle/AxleConfigSelectionDialog.vue';
import { useTheme } from 'vuetify'

const vTheme = useTheme()
const primaryColor = vTheme.current.value.colors.primary

const validation = useValidation();

const tireStore = useTireStore()
const mediaStore = useMediaStore();
const assetStore = useAssetStore()

const props = defineProps({
    vehicle: {
        type: Object as PropType<Asset>,
        required: true
    },
    showSidePanel: {
        type: Boolean,
        required: false,
        default: false,
    },
    workOrderId: {
        type: Number,
        required: true,
    },
    fetchWorkOrder: {
        type: Function,
        required: true
    },
    loading: {
        type: Boolean,
        default: false,
    }
});

const tireLayoutManager = ref<any>(null)
const axleConfiguration = ref<Record<string, any>>({ tireLayout: '', axles: {} })
const tirePlacement = ref<Record<string, any>>({})
const loadingTirePlacement = ref<boolean>(false)

const tireInstallationDialog = ref<boolean>(false)
const tireRotationDialog = ref<boolean>(false)
const tireInstallationDetailsDialog = ref<boolean>(false)
const tireRemovalDialog = ref<boolean>(false)
const axleConfigDialog = ref<boolean>(false)
const installationPosition = ref<string>('')

const installedTires = ref<any>([])
const selectedTire = ref<Partial<Tire>>({})

const alreadyInstalledPositions = computed(() => {
    return Object.keys(tirePlacement.value)
})

const selectedAxles = computed(() => {
    return props.vehicle?.axle_configuration?.axles ?? {}
})

const onTireClick = (zoneId: string) => {
    selectedTire.value = installedTires.value.find((tire: Tire) => tire.current_installation?.position == zoneId)
    // tireRotationDialog.value = true;
    // tireInstallationDetailsDialog.value = true;
    tireRemovalDialog.value = true;
}

const removeTire = (tire: Tire) => {
    selectedTire.value = tire
    tireRemovalDialog.value = true;
}

const rotateTire = (tire: Tire) => {
    selectedTire.value = tire
    tireRotationDialog.value = true;
}

const installTire = () => {
    selectedTire.value = {}
    tireInstallationDialog.value = true;
}

const getInstalledTires = async (vehicleId: number) => {
    loadingTirePlacement.value = true;
    try {
        installedTires.value = await tireStore.getCurrentVehicleTires(vehicleId);
        if (installedTires.value.length) {
            let tires: Record<string, any> = {}
            installedTires.value.forEach((tire: any) => {
                tires[tire.current_installation?.position] = { tirePressure: tire.current_installation?.pressure, threadDepth: tire.current_installation?.tread_depth }
            })
            tirePlacement.value = tires
        } else {
            tirePlacement.value = {}
        }
    } catch (error) {
        //failed to get installed tire data
        tirePlacement.value = {}
    }
    loadingTirePlacement.value = false;
}

const setAxleConfiguration = async (axleConfig: any) => {
    let payload = { axle_configuration: axleConfig, id: props.vehicle.id }
    await assetStore.updateAsset(payload)
    await props.fetchWorkOrder()
    await getTireInformation(props.vehicle)

}

const getTireInformation = async (vehicle: any) => {
    if (vehicle.axle_configuration != null) {
        await getInstalledTires(vehicle.id);
        axleConfiguration.value = vehicle.axle_configuration
        initializeTireLayoutManager({
            axles: vehicle.axle_configuration.axles,
            tireLayout: vehicle.axle_configuration.tireLayout,
            tirePlacement: tirePlacement.value
        })
    } else {
        tireInstallation.value.vehicle_id = undefined;
        if (tireLayoutManager.value) {
            tireLayoutManager.value.clear()
            tireLayoutManager.value = null;
        }
    }
}

const installTireAtPosition = (position: string) => {
    installationPosition.value = position;
    tireInstallationDialog.value = true;
}

watch(() => tireInstallationDialog.value, (newVal) => {
    if (!newVal) {
        installationPosition.value = '';
    }
})

const initializeTireLayoutManager = ({ tireLayout, tirePlacement, axles }: { tireLayout: any, tirePlacement: any, axles: any }) => {
    if (tireLayoutManager.value) {
        tireLayoutManager.value?.updateConfig({
            containerId: 'tireContiner',
            tireLayout: tireLayout,
            defaultColor: primaryColor,
            tirePlacement: tirePlacement,
            axleConfiguration: axles,
            onZoneClick: (zoneId: string) => {
                installTireAtPosition(zoneId)
            },
            onAxleUpdate: (axleId: string, data: string) => {
            },
            onTireClick(zoneId: string, data: any) {
                onTireClick(zoneId)
            }
        })
    } else {
        tireLayoutManager.value = new TireLayoutManager({
            containerId: 'tireContiner',
            tireLayout: tireLayout,
            defaultColor: primaryColor,
            tirePlacement: tirePlacement,
            axleConfiguration: axles,
            onZoneClick: (zoneId: string) => {
                installTireAtPosition(zoneId)
            },
            onAxleUpdate: (axleId: string, data: string) => {
            },
            onTireClick(zoneId: string, data: any) {
                onTireClick(zoneId)
            }
        })
    }

}


// const title = computed(() =>
//     props.tire.id ? 'Edit Tire Info' : 'Add Tire'
// );

const emit = defineEmits(['update:modelValue', 'save']);

const tireForm = ref<HTMLFormElement | null>(null);
const localTire = ref<Partial<Tire>>({});
const tireInstallation = ref<Partial<TireInstallation>>({});

const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
    fileInput.value?.click();
}

function removePhoto(index: number) {
    tireInstallation.value.photos?.splice(index, 1);
}

async function storeFile(event: any, location: string) {
    const files = (event.target as HTMLFormElement).files as FileList;

    if (files.length === 0) {
        return;
    }

    const fileArray = Array.from(files);

    for (const file of fileArray) {
        const { data, error } = await mediaStore.uploadFile(file);
        if (data) {
            switch (location) {
                case 'photos':
                    if (!Array.isArray(tireInstallation.value.photos)) {
                        tireInstallation.value.photos = [];
                    }
                    // Add file data to item_photos array
                    tireInstallation.value.photos.push(data);
                    break;
                case 'documents':
                    // if (!Array.isArray(localTire.value.documents)) {
                    //   localTire.value.documents = [];
                    // }
                    // Add file data to documents array
                    // localTire.value.documents.push(data);
                    break;
            }
        }
    }

    //clear input value
    if (event.target) {
        (event.target as HTMLFormElement).value = null
    }
}


const save = async () => {
    const formStatus = await tireForm.value?.validate();
    if (!formStatus.valid) {
        return;
    }
    const payload = { ...tireInstallation.value, tire_id: localTire.value.id }
    emit('save', JSON.parse(JSON.stringify(payload)));
}


const saveTireInstallation = async (installationData: any) => {
    await tireStore.installTire(props.workOrderId, installationData)
    await getTireInformation(props.vehicle)
}

const saveTireRemoval = async (removalData: any) => {
    await tireStore.removeTire(props.workOrderId, selectedTire.value.current_installation?.id as number, removalData)
    await getTireInformation(props.vehicle)
}


const saveTireRotation = async (rotationData: any) => {
    await tireStore.rotateTire(props.workOrderId, selectedTire.value.current_installation?.id as number, rotationData)
    await getTireInformation(props.vehicle)
}

// const reset = () => {
//     tireInstallation.value = {}
//     localTire.value = {}
//     if (tireLayoutManager.value) {
//         tireLayoutManager.value.clear()
//         tireLayoutManager.value = null;
//     }

//     axleConfiguration.value = { tireLayout: '', axles: {} }
//     tirePlacement.value = {}
//     loadingTirePlacement.value = false
// }

// watch(
//     () => props.modelValue,
//     (newVal) => {
//         if (newVal) {
//             reset()
//             localTire.value = JSON.parse(JSON.stringify(props.tire));
//         }
//     },
// );

const loadTiremangementData = () => {
    if (props.vehicle?.axle_configuration) {
        getTireInformation(props.vehicle)
    }
}

onMounted(() => {
    if (props.vehicle) {
        loadTiremangementData()
    }
})


watch(() => props.vehicle, (newVal) => {
    if (newVal?.id) {
        loadTiremangementData()
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

<style scoped>
.border {
    border: 2px solid black;
    height: 10px;
}
</style>