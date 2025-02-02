<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    <v-avatar class="rounded-circle" size="30" color="grey">
                        <v-icon>mdi-tools</v-icon>
                    </v-avatar>
                    {{ purchasePart.part_number }}
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                {{ purchasePart.purchase_details.quantity_ordered }}
            </v-col>
            <v-col cols="12" sm="2">
                {{ formatCurrency(purchasePart.purchase_details.unit_cost) }}
            </v-col>
            <v-col cols="12" sm="2">
                {{ formatCurrency(purchasePart.purchase_details.subtotal) }}
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
            <!-- <v-col cols="12" sm="1">
                <div v-bind="props" @click="editItem" class="icon-container pa-2" style="cursor: pointer">
                    <v-icon color="primary" density="compact" class="icon">mdi-pencil</v-icon>
                    <div class="overlay"></div>
                </div>
            </v-col> -->
        </v-row>
        <v-expand-transition v-if="isExpanded">
            <v-card-text>
                <v-card-text>

                    <v-row>
                        <v-col cols="12">
                            <div class="text-caption">{{ purchasePart.description }}</div>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" flat density="compact" v-model="purchasePart.description"
                                label="Notes" :rows="3" readonly></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue"
import { formatCurrency } from '~/composables/currencyUtils'
import { useValidation } from '~/composables/formValidation';
import type { PurchasePart } from "~/types/maintenance/purchaseOrderTypes";

const validation = useValidation();

const props = defineProps({
    purchasePart: {
        type: Object as PropType<PurchasePart>,
        required: true,
    },
})

const emit = defineEmits(['delete', 'edit', 'onInput'])

const isExpanded = ref(false)
</script>