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
                    <div v-if="localPurchaseOrderPart.id">
                    </div>
                    <v-row :class="{ 'mt-3': localPurchaseOrderPart.id }">

                        <v-col cols="12">
                            <SharedInputPartNumberAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localPurchaseOrderPart.part_id" label="Select A Part*"
                                :rules="[validation.required]" @selection="updateSelectedPart" />
                        </v-col>
                        <!-- quantity label bruh -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localPurchaseOrderPart.quantity_ordered" label="Quantity Ordered*"
                                type="number" required @input="calculateSubtotal()"
                                :rules="[validation.required, validation.minNumber(0)]" :min="1"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localPurchaseOrderPart.quantity_received" label="Quantity Recived*" type="number" required
                                @input="calculateSubtotal()" :rules="[validation.required, validation.minNumber(1)]"
                                :min="1"></v-text-field>
                        </v-col> -->
                        <!-- unit cost label -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localPurchaseOrderPart.unit_cost" label="Unit Cost*" type="number"
                                @input="calculateSubtotal()"
                                :rules="[validation.required, validation.minNumber(0.01)]"></v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localPurchaseOrderPart.quantity_received ?? 0 }} x
                                        ${{ localPurchaseOrderPart.unit_cost ?? 0 }}</span>
                                </span>
                                <span class="text-h6">${{ localPurchaseOrderPart.subtotal ?? 0 }}</span>
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
import { useValidation } from '~/composables/formValidation';
import type { PurchaseDetails } from '~/types/maintenance/purchaseOrderTypes';
import type { Part } from '~/types/maintenance/workOrder';
import type { Location } from '~/types/maintenance/partSupplyTypes';

const props = defineProps({
    modelValue: {
        type: Object as PropType<Partial<PurchaseDetails>>,
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
    }
})

const validation = useValidation();

// end of changes 
const localPurchaseOrderPart = ref<Partial<PurchaseDetails>>(JSON.parse(JSON.stringify(props.modelValue)))
// changes

watch(() => props.modelValue, (newPurchaseOrderPart: Partial<PurchaseDetails>) => {
    localPurchaseOrderPart.value = newPurchaseOrderPart
})
const selectedPart = ref<Partial<Part>>({})

const selectedLocations = ref<Location[]>([])

const updateSelectedPart = (part: Part) => {
    selectedPart.value = part
    selectedLocations.value = part.locations as Location[]
}

const calculateSubtotal = () => {
    localPurchaseOrderPart.value.subtotal = Number(((localPurchaseOrderPart.value.unit_cost ?? 0) * (localPurchaseOrderPart.value.quantity_ordered ?? 0)).toPrecision(2))
}


const emit = defineEmits(['close', 'save', 'update'])

const title = computed(() => {
    return 'Add Part';
})

const partForm = ref<HTMLFormElement | null>(null)

const localPurchasePart = ref<Partial<PurchaseDetails>>(JSON.parse(JSON.stringify(props.modelValue)))


// watch(() => props.show, (newVal) => {
//     localPurchasePart.value.subtotal = (localPurchasePart.value.unit_cost || 0) * (localPurchasePart.value.quantity_ordered || 0)
// })

const closeDialog = () => {
    emit('close')
}

const save = async () => {
    const formStatus = await partForm.value?.validate()
    if (!formStatus.valid) {
        return
    }
    // console.log(localPurchaseOrderPart.value)
    emit('save', JSON.parse(JSON.stringify(localPurchaseOrderPart.value)))

    closeDialog()
}

</script>