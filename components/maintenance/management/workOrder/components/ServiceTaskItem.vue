<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    {{ lineItem.service_task?.name || ' -- ' }}
                    <v-icon color="grey" style="font-size:medium; cursor: pointer">mdi-alert-circle</v-icon>
                </div>
                <div v-if="isExpanded" class="d-flex ml-8">
                    <v-card variant="outlined" class="px-1 d-flex align-center" @click="emit('addLabor')">
                        <v-icon color="grey">mdi-account</v-icon>
                        <span>Add Labor</span>
                    </v-card>
                    <v-card variant="outlined" class="ml-1 px-1 d-flex align-center" @click="emit('addPart')">
                        <v-icon color="grey" small>mdi-package-variant-closed</v-icon>
                        <span>Add Part</span>
                    </v-card>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <!-- <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.labor_cost" type="number"
                        readonly></v-text-field>
                </div> -->
                {{ formatCurrency(lineItem.labor_cost) }}
            </v-col>
            <v-col cols="12" sm="2">
                <!-- <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.parts_cost" type="number"
                        readonly></v-text-field>
                </div> -->
                {{ formatCurrency(lineItem.parts_cost) }}
            </v-col>
            <v-col cols="12" sm="2">
                <!-- <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.subtotal"
                        readonly></v-text-field>
                </div> -->
                {{ formatCurrency(lineItem.subtotal) }}
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
                        <v-list-item @click="emit('edit')">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1 text-caption">Edit</span>
                                <v-icon>mdi-pencil</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="emit('delete')">
                            <v-list-item-title class="d-flex">
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
                        <v-col cols="12">
                            <v-textarea variant="outlined" flat density="compact" v-model="lineItem.notes" label="Notes"
                                placeholder="Add notes or additional details" :rows="3"></v-textarea>
                        </v-col>
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
                                    <i class="ml-1">{{ laborItem.technician_name }}</i>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="2">
                                {{ laborItem.hours }}
                            </v-col>
                            <v-col cols="12" sm="2">
                                {{ formatCurrency(laborItem.hourly_labor_rate) }}
                            </v-col>
                            <v-col cols="12" sm="2">
                                {{ formatCurrency(laborItem.subtotal) }}
                            </v-col>
                            <v-col cols="12" sm="1">
                                <div @click="emit('editLabor', laborItem)" class="icon-container pa-2"
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
                                <span>{{ partItem?.part?.part_number }}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="2">
                            {{ partItem.quantity }}
                        </v-col>
                        <v-col cols="12" sm="2">
                            {{ formatCurrency(partItem.unit_cost) }}
                        </v-col>
                        <v-col cols="12" sm="2">
                            {{ formatCurrency(partItem.subtotal) }}
                        </v-col>
                        <v-col cols="12" sm="1">
                            <div @click="emit('editPart', partItem)" class="icon-container pa-2"
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
import { formatCurrency } from '~/composables/currencyUtils'
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();

const props = defineProps({
    lineItem: {
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['edit', 'delete', 'addLabor', 'editLabor', 'addPart', 'editPart'])

const isExpanded = ref(false)
</script>

<style scoped>
.trigger-btn {
    transition: transform 0.3s ease;
}

.trigger-btn.rotated {
    transform: rotate(90deg);
}
</style>