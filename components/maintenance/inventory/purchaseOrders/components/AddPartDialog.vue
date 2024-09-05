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
                    <v-row :class="{ 'mt-3': editing }">
                        <!-- <v-col cols="12" sm="6">
                            <v-autocomplete variant="solo" flat density="compact" :items="partSupplies"
                                item-title="part_number" item-value="id" v-model="localPurchasePart.part_id"
                                label="Select A Part*" :rules="[validation.required]"></v-autocomplete>
                        </v-col> -->
                        <!--implementation of modified dropdown -->
                        <v-col cols="12" sm="6">
                            <v-autocomplete variant="solo" flat density="compact" :items="partSupplies"
                                item-title="part_number" item-value="id" v-model="localWorkOrderPart.part_id"
                                label="Select A Part*" :rules="[validation.required]">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.part_number" style="width:600px;">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-package-variant-closed</v-icon>
                                        </template>
                                        <v-list-item-subtitle>
                                            <v-tooltip text="Manufacturer Part Number">
                                                <template v-slot:activator="{ props }">
                                                    <span v-bind="props"
                                                        style="font-size: 12px;border-bottom: 1px dotted;">{{
                                                            item.raw.manufacturer_part_number
                                                        }}</span>
                                                </template>
                                            </v-tooltip>
                                            <span class="mx-1">.</span>
                                            <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                                item.raw.description }}</span>
                                        </v-list-item-subtitle>
                                        <template v-slot:append>
                                            <span class="text-caption text-grey">{{
                                                getTotalQuantity(item.raw.locations) }} </span>
                                        </template>

                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                         <!-- end of changes -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localPurchasePart.quantity_ordered"
                                label="Quantity" type="number" required
                                @input="calculateSubtotalPart(localPurchasePart)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model="localPurchasePart.unit_cost"
                                label="Unit Cost" type="number"
                                @input="calculateSubtotalPart(localPurchasePart)"></v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localPurchasePart.quantity_ordered }} x
                                        ${{ localPurchasePart.unit_cost }}</span>
                                </span>
                                <span class="text-h6">${{ localPurchasePart.subtotal }}</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { PurchaseOrder, PurchaseCustomField, PurchaseParts } from '@/types/maintenance/purchaseOrderTypes';
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();
import type { Parts } from '~/types/maintenance/workOrder';


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
        type: Object as PropType<Partial<PurchaseParts>>,
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

// end of changes 
const localWorkOrderPart = ref<Partial<Parts>>(JSON.parse(JSON.stringify(props.modelValue)))
// changes

const getLocationName = (locationId: number) => {
    return partLocations.value?.find(location => location.id == locationId)?.name
}

const emit = defineEmits(['close', 'save', 'update'])

const title = computed(() => {
    return props.editing ? 'Edit Part' : 'Add Part'
})

const partForm = ref<HTMLFormElement | null>(null)

const localPurchasePart = ref<Partial<PurchaseParts>>(JSON.parse(JSON.stringify(props.modelValue)))

const selectedPart = computed(() => {
    return partSupplies.value.find(part => part.id == localPurchasePart.value.part_id)
})

const selectedPartLocations = computed(() => {
    const locationIds = selectedPart.value?.locations?.map(location => location.location_id) || []
    if (locationIds.length) {
        return partLocations.value?.filter(location => locationIds.includes(location.id)) || []
    }
    return []
})

watch(props.modelValue, (newModelValue) => {
    localPurchasePart.value = JSON.parse(JSON.stringify(newModelValue))
})

watch(() => props.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            localPurchasePart.value = JSON.parse(JSON.stringify(props.modelValue))
        })
    }
})

watch(() => localPurchasePart.value.part_id, (newVal) => {
    nextTick(() => {
        localPurchasePart.value.unit_cost = selectedPart.value?.unit_cost
    })
})

watch(() => props.show, (newVal) => {
    localPurchasePart.value.subtotal = (localPurchasePart.value.unit_cost || 0) * (localPurchasePart.value.quantity_ordered || 0)
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
        emit('update', JSON.parse(JSON.stringify(localPurchasePart.value)))
    } else {
        emit('save', JSON.parse(JSON.stringify(localPurchasePart.value)))
    }
}

</script>