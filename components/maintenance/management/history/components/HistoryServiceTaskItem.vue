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
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.labor_cost" type="number"
                    @input="getItemSubtotal(lineItem)"></v-text-field>
                </div>
            </v-col>
            <v-col cols="12" sm="2">
                <div class="mt-4">
                    <v-text-field variant="outlined" flat density="compact" v-model="lineItem.part_cost" type="number"
                    @input="getItemSubtotal(lineItem)"></v-text-field>
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
                </v-card-text>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useValidation } from '~/composables/formValidation';
import ChangeServiceTaskListItem from '@/components/maintenance/management/workOrder/components/ChangeServiceTaskListItem.vue';

const validation = useValidation();

const props = defineProps({
    getServiceTaskName: {
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
    calculateSubtotalItem: {
        type: Function,
        required: true,
    },
})

const emit = defineEmits(['delete','onItemInput'])


const isExpanded = ref(false)


const deleteItem = () => {
    emit('delete')
}

const getItemSubtotal = (item: any) => {
    props.calculateSubtotalItem(item)
    emit('onItemInput')
}
</script>