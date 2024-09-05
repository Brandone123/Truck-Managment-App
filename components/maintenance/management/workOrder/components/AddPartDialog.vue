<template>
    <v-dialog :model-value="show" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="partForm">
                    <p v-if="editing">Current Service Task</p>
                    <p v-if="editing">{{ currentServiceTask?.name }}</p>
                    <v-row :class="{ 'mt-3': editing }">
               
                        <v-col cols="12" sm="6">
                            <v-autocomplete variant="solo" flat density="compact" :items="partSupplies"
                                item-title="part_number" item-value="id" v-model="localWorkOrderPart.part_id"
                                label="Select A Part*" :rules="[validation.required]">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.part_number" style="width:600px;">
                                       <!-- select dropdown icon -->
                                        <template v-slot:prepend>
                                            <v-icon>mdi-package-variant-closed</v-icon>
                                        </template>
                                        <!-- section that inclides the dialog box -->
                                        <v-list-item-subtitle>
                                            <v-tooltip text="Manufacturer Part Number">
                                                <template v-slot:activator="{ props }">
                                                    <!-- underlined value with dialog hover efect -->
                                                    <span v-bind="props"
                                                        style="font-size: 12px;border-bottom: 1px dotted;">{{
                                                            item.raw.manufacturer_part_number
                                                        }}</span>
                                                </template>
                                            </v-tooltip>
                                            <!-- description  on right ofoption bottom -->
                                            <span class="mx-1">.</span>
                                            <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                                item.raw.description }}</span>
                                        </v-list-item-subtitle>
                                        <!-- right flexed option values -->
                                        <template v-slot:append>
                                            <span class="text-caption text-grey">{{
                                                getTotalQuantity(item.raw.locations) }} </span>
                                        </template>

                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <!-- select a location right dropdown -->
                        <v-col cols="12" sm="6">
                            <v-autocomplete variant="solo" flat density="compact" :items="selectedPartLocations"
                                item-title="name" item-value="id" v-model="localWorkOrderPart.part_location_id"
                                label="Select A Part Location*"  persistent-hint hint="This will make an inventory adjustment"
                                :rules="[validation.required]">

                                <template v-slot:selection="{item}">
                                     <span v-if="item.raw.name">{{ item.raw?.name }} ({{ item.raw?.quantity }})</span>
                                </template>
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" title="">
                                        <v-list-item-title class="d-flex justify-space-between">
                                            <span>{{ item.raw.name }}</span>
                                            <span>
                                                <v-chip v-if="item.raw.quantity == 0" class="text-caption" variant="tonal" color="error" density="compact">Out of Stock</v-chip>
                                                {{ item.raw.quantity }}
                                            </span>
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <!-- quantity label bruh -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model.number="localWorkOrderPart.qte"
                                label="Quantity" type="number" required
                                @input="calculateSubtotalPart(localWorkOrderPart)"></v-text-field>
                        </v-col>
                        <!-- unit cost label -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model.number="localWorkOrderPart.unit_cost"
                                label="Unit Cost" type="number"
                                @input="calculateSubtotalPart(localWorkOrderPart)"></v-text-field>
                        </v-col>
                        <v-col cols="12" v-if="!editing">
                            <v-autocomplete variant="solo" flat density="compact" :items="serviceTaskList"
                                item-title="name" item-value="id" v-model="localWorkOrderPart.service_task_id"
                                label="Select Service Task" :rules="[validation.required]">

                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.name">
                                        <v-list-item-subtitle>
                                            <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                                item.raw.description }}</span>
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="solo" flat density="compact" v-model="localWorkOrderPart.notes"
                                label="Notes" :rows="3"></v-textarea>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localWorkOrderPart.qte }} x
                                        ${{ localWorkOrderPart.unit_cost }}</span>
                                </span>
                                <span class="text-h6">${{ localWorkOrderPart.subtotal }}</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn v-if="editing" color="error" variant="text" @click="deleteItem">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Parts } from '~/types/maintenance/workOrder';
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const getTotalQuantity = (locations: any) => {
    return locations.reduce((acc: number, location: any) => {
        acc += (location?.quantity || 0);
        return acc;
    }, 0);
}

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore);

const partLocationStore = usePartLocationStore();
const { partLocations } = storeToRefs(partLocationStore);

const props = defineProps({
    modelValue: {
        type: Object as PropType<Partial<Parts>>,
        required: true,
        default: false
    },
    show: {
        type: Boolean,
        required: true,
        default: false
    },
    calculateSubtotalPart: {
        type: Function,
        required: true,
    },
    editing: {
        type: Boolean,
        required: true,
    }
})

const getLocationName = (locationId: number) => {
    return partLocations.value?.find(location => location.id == locationId)?.name
}

const currentServiceTask = computed(() => {
    return serviceTaskList.value.find(serviceTask => serviceTask.id == props.modelValue.service_task_id)
})

const emit = defineEmits(['close', 'save', 'update', 'delete'])

const title = computed(() => {
    return props.editing ? 'Edit Part' : 'Add Part'
})

const partForm = ref<HTMLFormElement | null>(null)

const localWorkOrderPart = ref<Partial<Parts>>(JSON.parse(JSON.stringify(props.modelValue)))

const selectedPart = computed(() => {
    return partSupplies.value.find(part => part.id == localWorkOrderPart.value.part_id)
})

// const selectedPartLocations = computed(() => {
//     const locationIds = selectedPart.value?.locations?.map(location => location.location_id) || []
//     if (locationIds.length) {
//         let locations =  partLocations.value?.filter(location => locationIds.includes(location.id)) || []
//         return locations.map(location => { return {
//             ...location,
//             quantity: selectedPart.value?.locations?.find(item => item.location_id == location.id)?.quantity || 0
//         }})
//     }
//     return []
// })

const selectedPartLocations = computed(() => {
    const selectedLocations = selectedPart.value?.locations || [];
    const locationIdsSet = new Set(selectedLocations.map(location => location.location_id));

    return partLocations.value?.reduce((acc, location) => {
        if (locationIdsSet.has(location.id)) {
            acc.push({
                ...location,
                quantity: selectedLocations.find(item => item.location_id === location.id)?.quantity || 0
            });
        }
        return acc;
    }, [] as Array<any>) || [];
});

watch(props.modelValue, (newModelValue) => {
    localWorkOrderPart.value = JSON.parse(JSON.stringify(newModelValue))
})

watch(() => props.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            localWorkOrderPart.value = JSON.parse(JSON.stringify(props.modelValue))
        })
    }
})

watch(() => localWorkOrderPart.value.part_id, (newVal) => {
    nextTick(() => {
        localWorkOrderPart.value.unit_cost = selectedPart.value?.unit_cost
    })
})

const closeDialog = () => {
    emit('close')
}

const save = async () => {
    const formStatus = await partForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    if (props.editing) {
        emit('update', JSON.parse(JSON.stringify(localWorkOrderPart.value)))
    } else {
        emit('save', JSON.parse(JSON.stringify(localWorkOrderPart.value)))
    }
}

const deleteItem = () => {
    emit('delete', JSON.parse(JSON.stringify(props.modelValue)))
}
</script>