<template>
    <v-card variant="outlined">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <div>
                    <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn"
                        density="comfortable" color="primary" variant="text" icon="mdi-menu-right"></v-btn>
                    {{ lineItem?.service_task?.name }}
                    <v-icon color="grey" style="font-size:medium; cursor: pointer">mdi-alert-circle</v-icon>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                {{ formatCurrency(lineItem.labor_cost) }}
            </v-col>
            <v-col cols="12" sm="2">
                {{ formatCurrency(lineItem.parts_cost) }}
            </v-col>
            <v-col cols="12" sm="2">
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
                </v-card-text>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue"
import { formatCurrency } from '~/composables/currencyUtils.js'

const props = defineProps({
    lineItem: {
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['edit', 'delete'])

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