<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    <v-avatar class="rounded-circle" size="30" color="grey">
                        <v-icon>mdi-account</v-icon>
                    </v-avatar>
                    {{ getTechnicianName(laborItem.user_id) }}
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="laborItem.hrs" type="number"
                        @input="calculateSubtotal(laborItem)"></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="laborItem.rate" type="number"
                        @input="calculateSubtotal(laborItem)"></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="laborItem.subtotal"
                        readonly></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="1">
                <div @click="editItem" class="icon-container pa-2" style="cursor: pointer">
                    <v-icon color="primary" density="compact" class="icon">mdi-pencil</v-icon>
                    <div class="overlay"></div>
                </div>
            </v-col>
        </v-row>
        <v-expand-transition v-if="isExpanded">
            <v-card-text>
                <v-card-text>
                    <div>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <span v-if="isExpanded">
                                    <v-select variant="outlined" flat density="compact" :items="getLineItemServiceTasks"
                                        v-model="laborItem.service_task_id" label="Service Task Line Items"
                                        item-title="name" item-value="id">
                                    </v-select>
                                </span>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea variant="outlined" flat density="compact" v-model="laborItem.notes"
                                    label="Notes" :rows="3"></v-textarea>
                            </v-col>
                        </v-row>
                    </div>
                    <div>
                    </div>
                </v-card-text>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
    getServiceTaskName: {
        type: Function,
        required: true,
    },
    laborItem: {
        type: Object,
        required: true,
    },
    getTechnicianName: {
        type: Function,
        required: true,
    },
    calculateSubtotalLabor: {
        type: Function,
        required: true,
    },
    getLineItemServiceTasks: {
        type: Array,
        required: true,
    }
})

const emit = defineEmits(['onDelete', 'onEdit', 'onInput'])

const isExpanded = ref(false)


const deleteItem = () => {
    emit('onDelete')
}

const editItem = () => {
    emit('onEdit')
}


const calculateSubtotal = (item: any) => {
    props.calculateSubtotalLabor(item)
    emit('onInput')
}
</script>