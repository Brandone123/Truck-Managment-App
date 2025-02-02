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
                <v-form ref="partForm">
                    <div v-if="localWorkOrderPart.id">
                        <p>Current Service Task</p>
                        <p>{{ currentServiceTask?.name }}</p>
                    </div>
                    <v-row :class="{ 'mt-3': localWorkOrderPart.id }">

                        <v-col cols="12" sm="6">
                            <SharedInputPartNumberAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localWorkOrderPart.part_id" label="Select A Part*"
                                :rules="[validation.required]" @selection="updateSelectedPart" />
                        </v-col>

                        <!-- select a location right dropdown -->
                        <v-col cols="12" sm="6">
                            <v-autocomplete :disabled="!localWorkOrderPart.part_id" variant="solo" flat
                                density="compact" :items="selectedLocations" item-title="location_name"
                                item-value="location_id" v-model="localWorkOrderPart.part_location_id"
                                label="Select A Part Location*" persistent-hint
                                hint="This will make an inventory adjustment" :rules="[validation.required]">

                                <template v-slot:selection="{ item }">
                                    <span v-if="item.raw.location_name">{{ item.raw?.location_name }} ({{
                                        item.raw?.quantity }})</span>
                                </template>
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" title="">
                                        <v-list-item-title class="d-flex justify-space-between">
                                            <span>{{ item.raw.location_name }}</span>
                                            <span>
                                                <v-chip v-if="item.raw.quantity == 0" class="text-caption"
                                                    variant="tonal" color="error" density="compact">Out of
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
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localWorkOrderPart.quantity" label="Quantity*" type="number" required
                                @input="calculateSubtotal()" :rules="[validation.required, validation.minNumber(1)]"
                                :min="1"></v-text-field>
                        </v-col>
                        <!-- unit cost label -->
                        <v-col cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localWorkOrderPart.unit_cost" label="Unit Cost*" type="number"
                                @input="calculateSubtotal()"
                                :rules="[validation.required, validation.minNumber(0.01)]"></v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" v-if="!addingToLineItem && !localWorkOrderPart.id">
                            <SharedInputServiceTaskAutoCompleteInput variant="solo" flat density="compact"
                                v-model="localWorkOrderPart.service_task_id" label="Select Service Task*"
                                :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="solo" flat density="compact" v-model="localWorkOrderPart.notes"
                                label="Notes" :rows="3"></v-textarea>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localWorkOrderPart.quantity }} x
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
                <v-btn v-if="partItem.id" color="error" variant="text" @click="deleteItem">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Part } from '~/types/maintenance/workOrder';
import { useValidation } from '~/composables/formValidation';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import type { Location } from '~/types/maintenance/partSupplyTypes';
const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    partItem: {
        type: Object as PropType<Partial<Part>>,
        required: true,
        // default: () => { return {} as Partial<Part> }
    },
    currentServiceTask: {
        type: Object as PropType<Partial<ServiceTask>>,
        required: false,
        default: () => { return {} as Partial<ServiceTask> }
    },
    selectedPartLocations: {
        type: Array as PropType<Location[]>,
        required: true,
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
    return props.partItem.id ? 'Edit Part' : 'Add Part'
})
const partForm = ref<HTMLFormElement | null>(null)

const localWorkOrderPart = ref<Partial<Part>>(JSON.parse(JSON.stringify(props.partItem)))

const selectedPart = ref<Partial<Part>>({})

const selectedLocations = ref<Location[]>([])

const calculateSubtotal = () => {
    localWorkOrderPart.value.subtotal = parseFloat(((localWorkOrderPart.value.unit_cost ?? 0) * (localWorkOrderPart.value.quantity ?? 0)).toFixed(2))
}

watch(() => localWorkOrderPart.value.unit_cost, (newVal)=>{
    if(newVal **newVal < 0){
        localWorkOrderPart.value.unit_cost = Math.abs(newVal)
    }
})

watch(() => localWorkOrderPart.value.quantity, (newVal)=>{
    if(newVal && newVal < 0){
        localWorkOrderPart.value.quantity = Math.abs(newVal)
    }
})

const updateSelectedPart = (part: Part) => {
    selectedPart.value = part
    selectedLocations.value = part.locations as Location[]
}

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        localWorkOrderPart.value = JSON.parse(JSON.stringify(props.partItem))
        selectedLocations.value = JSON.parse(JSON.stringify(props.selectedPartLocations))
    }
})

watch(() => localWorkOrderPart.value.part_id, (newVal) => {
    nextTick(() => {
        if (newVal != props.partItem.part_id) {
            localWorkOrderPart.value.unit_cost = selectedPart.value?.unit_cost
            //reset the location selector
            localWorkOrderPart.value.part_location_id = undefined;
        }
        else {
            localWorkOrderPart.value.unit_cost = props.partItem.unit_cost
            localWorkOrderPart.value.part_location_id = props.partItem.part_location_id
        }
    })
})

const save = async () => {
    const formStatus = await partForm.value?.validate()
    if (!formStatus.valid) {
        return
    }
    emit('save', JSON.parse(JSON.stringify(localWorkOrderPart.value)))
    dialog.value = false
}

const deleteItem = () => {
    emit('delete', props.partItem)
}
</script>