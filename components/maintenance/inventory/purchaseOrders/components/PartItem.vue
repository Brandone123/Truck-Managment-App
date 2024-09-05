<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    <v-avatar class="rounded-circle" size="30" color="grey">
                        <v-icon>mdi-account</v-icon>
                        getSelectedPartLocations </v-avatar>
                    {{ getPartNumber(partItem.part_id) }} {{ partItem.part_id }}
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="partItem.quantity_ordered" type="number"
                        @input="calculateSubtotal(partItem)"></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="partItem.unit_cost" type="number"
                        @input="calculateSubtotal(partItem)"></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="partItem.subtotal"
                        readonly></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="1">
                <div v-bind="props" @click="editItem" class="icon-container pa-2" style="cursor: pointer">
                    <v-icon color="primary" density="compact" class="icon">mdi-pencil</v-icon>
                    <div class="overlay"></div>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
    partItem: {
        type: Object,
        required: true,
    },
    getPartNumber: {
        type: Function,
        required: true,
    },
    calculateSubtotalPart: {
        type: Function,
        required: true,
    },
    getSelectedPartLocations: {
        type: Function,
        required: true,
    }
})

const emit = defineEmits(['onDelete', 'onEdit','onInput'])

const isExpanded = ref(false)

const deleteItem = () => {
    emit('onDelete')
}

const editItem = () => {
    emit('onEdit')
}

const calculateSubtotal = (item: any) => {
    props.calculateSubtotalPart(item)
    emit('onInput')
}
</script>