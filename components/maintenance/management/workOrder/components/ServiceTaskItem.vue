<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    {{ getServiceTaskName(lineItem.service_task_id) }}
                    <v-icon color="grey" style="font-size:medium; cursor: pointer">mdi-alert-circle</v-icon>
                </div>
                <div v-if="isExpanded" class="d-flex ml-8">
                    <v-card variant="outlined" class="px-1 d-flex align-center"
                        @click="addLabor(null, lineItem.service_task_id)">
                        <v-icon color="grey">mdi-account</v-icon>
                        <span>Add Labor</span>
                    </v-card>
                    <v-card variant="outlined" class="ml-1 px-1 d-flex align-center"
                        @click="addPart(null, lineItem.service_task_id)">
                        <v-icon color="grey" small>mdi-package-variant-closed</v-icon>
                        <span>Add Part</span>
                    </v-card>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.labor_cost" type="number"
                        readonly></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.part_cost" type="number"
                       readonly></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.subtotal"
                        readonly></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="1">


                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <div v-bind="props" class="icon-container pa-2" style="cursor: pointer">
                            <v-icon color="primary" density="compact" class="icon">mdi-dots-horizontal</v-icon>
                            <div class="overlay"></div>
                        </div>
                    </template>

                    <v-list min-width="200px">
                        <ChangeServiceTaskListItem :modelValue="lineItem.service_task_id"
                            @save="lineItem.service_task_id = $event" />
                        <v-list-item @click="">
                            <v-list-item-title class="d-flex" @click="deleteItem">
                                <span class="flex-grow-1 text-caption">Delete</span>
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
        </v-row>
        <v-expand-transition>
            <v-card-text v-if="isExpanded">
                <v-card-text>
                    <div>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea variant="outlined" flat density="compact" v-model="lineItem.notes"
                                    label="Notes" placeholder="Add notes or additional details" :rows="3"></v-textarea>
                            </v-col>
                        </v-row>
                    </div>
                    <div>
                        <v-row v-if="lineItem.labor && lineItem.labor.length">
                            <v-col cols="12" sm="5">
                                <span>LABOR <span class="ml-1">({{ lineItem.labor.length }})</span></span>
                            </v-col>
                            <v-col cols="12" sm="2">Hrs</v-col>
                            <v-col cols="12" sm="2">Rate</v-col>
                            <v-col cols="12" sm="2">Amount</v-col>
                            <v-col cols="12" sm="1"></v-col>
                        </v-row>
                        <v-divider v-if="lineItem.labor && lineItem.labor.length" class="my-1"></v-divider>
                        <v-row class="mt-1" v-for="(laborItem, indexlabor) in lineItem.labor" :key="indexlabor">
                            <v-col cols="12" sm="5">
                                <div class="d-flex fill-height align-center">
                                    <v-avatar class="rounded-circle" size="30" color="grey">
                                        <v-icon>mdi-account</v-icon>
                                    </v-avatar>
                                    <i class="ml-1">{{ getTechnicianName(laborItem.user_id)
                                        }}</i>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field variant="outlined" flat density="compact" v-model="laborItem.hrs"
                                    type="number" @input="getLaborSubtotal(laborItem)"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field variant="outlined" flat density="compact" v-model="laborItem.rate"
                                    type="number" @input="getLaborSubtotal(laborItem)"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                                <v-text-field variant="outlined" flat density="compact" v-model="laborItem.subtotal"
                                    readonly hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="1">
                                <div @click="editLabor(laborItem, indexlabor)" class="icon-container pa-2"
                                    style="cursor: pointer">
                                    <v-icon color="primary" density="compact" class="icon">mdi-pencil</v-icon>
                                    <div class="overlay"></div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>

                    <v-row class="mt-2" v-if="lineItem.parts && lineItem.parts.length">
                        <v-col cols="12" sm="5">
                            <span>PARTS <span class="ml-1">({{ lineItem.parts.length }})</span></span>
                        </v-col>
                        <v-col cols="12" sm="2">
                            Qty
                        </v-col>
                        <v-col cols="12" sm="2">
                            Unit Cost
                        </v-col>
                        <v-col cols="12" sm="2">
                            Amount
                        </v-col>
                        <v-col cols="12" sm="1">
                        </v-col>
                    </v-row>

                    <v-divider class="my-1" v-if="lineItem.parts && lineItem.parts.length"></v-divider>
                    <v-row class="mt-2" v-for="(partItem, indexPart) in lineItem.parts" :key="indexPart">
                        <v-col cols="12" sm="5">
                            <div class="d-flex fill-height align-center">
                                <span>{{ getPartNumber(partItem.part_id) }}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field variant="outlined" flat density="compact" v-model="partItem.qte" type="number"
                                @input="getPartSubtotal(partItem)" hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field variant="outlined" flat density="compact" v-model="partItem.unit_cost"
                                type="number" @input="getPartSubtotal(partItem)" hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field variant="outlined" flat density="compact" v-model="partItem.subtotal" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <div @click="editPart(partItem, indexPart)" class="icon-container pa-2"
                                style="cursor: pointer">
                                <v-icon color="primary" density="compact" class="icon">mdi-pencil</v-icon>
                                <div class="overlay"></div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useValidation } from '~/composables/formValidation';
import ChangeServiceTaskListItem from './ChangeServiceTaskListItem.vue';

const validation = useValidation();

const props = defineProps({
    getServiceTaskName: {
        type: Function,
        required: true,
    },
    getPartNumber: {
        type: Function,
        required: true,
    },
    addLabor: {
        type: Function,
        required: true,
    },
    addPart: {
        type: Function,
        required: true,
    },
    lineItem: {
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
    editLabor: {
        type: Function,
        required: true,
    },
    calculateSubtotalPart: {
        type: Function,
        required: true,
    },
    editPart: {
        type: Function,
        required: true,
    }
})

const emit = defineEmits(['delete','onPartInput','onLaborInput'])

const isExpanded = ref(false)


const deleteItem = () => {
    emit('delete')
}

const getPartSubtotal = (item: any) => {
    props.calculateSubtotalPart(item)
    emit('onPartInput')
}

const getLaborSubtotal = (item: any) => {
    props.calculateSubtotalLabor(item)
    emit('onLaborInput')
}
</script>

<style scoped>
.trigger-btn {
    transition: transform 0.3s ease;
}

.trigger-btn.rotated {
    transform: rotate(90deg);
}
</style>