<template>
    <v-dialog v-model="dialog" scrollable width="800px">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" density="comfortable" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add Commodity
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" :title="title" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-row class="my-4">
                        <v-col cols="12" class="pb-0">

                            <v-row>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="commodityInfo.matrix" variant="solo" flat type="number"
                                        label="Matrix" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-select v-model="commodityInfo.commodity" variant="solo" flat label="Commodity"
                                        :items='commodityList' item-title="description" item-value="id"
                                        density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="commodityInfo.reference" variant="solo" flat label="Reference"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field v-model="commodityInfo.description" variant="solo" flat
                                        label="Description" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-textarea v-model="commodityInfo.notes" variant="solo" flat label="Notes"
                                        density="compact"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider></v-divider>
                        <v-col cols="12" class="pb-0">
                            <v-row>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.actual_weight" variant="solo" flat type="number"
                                        label="Actual Wgt" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.tarrif_weight" variant="solo" flat type="number"
                                        label="Tarrif Wgt" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.as_weight" variant="solo" flat type="number"
                                        label="As Wgt" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.pieces" variant="solo" flat type="number"
                                        label="Pieces" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.space" variant="solo" flat type="number"
                                        label="Space" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.seats" variant="solo" flat type="number"
                                        label="Seats" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.value" variant="solo" flat type="number"
                                        label="Value" density="compact"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-select v-model="commodityInfo.measure" variant="solo" flat label="Measure"
                                        :items='["team1", "team2"]' density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.length" variant="solo" flat type="number"
                                        label="Length" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.width" variant="solo" flat type="number"
                                        label="Width" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.height" variant="solo" flat type="number"
                                        label="Height" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field v-model="commodityInfo.volume" variant="solo" flat type="number"
                                        label="Volume" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3" class="pb-0">
                                    <v-checkbox v-model="commodityInfo.stackable" label="Stackable" density="compact"
                                        color="primary" hide-details></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="3" class="pb-0">
                                    <v-checkbox v-model="commodityInfo.floor_board" label="Floor Load" density="compact"
                                        color="primary" hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="dialog = false">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCommodityStore } from '@/stores/settings/dispatch/commodity'
import type { CommodityInfo } from '~/types/dispatch/load'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'

const emit = defineEmits(['update:show'])

const props = defineProps({
    item: {
        type: Object as () => CommodityInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const commodityStore = useCommodityStore()
const { commodityList } = storeToRefs(commodityStore)


const defaultCommodity = ref<CommodityInfo>({
    id: null,
    matrix: null,
    commodity: null,
    reference: null,
    description: null,
    notes: null,
    actual_weight: null,
    tarrif_weight: null,
    as_weight: null,
    pieces: null,
    space: null,
    seats: null,
    value: null,
    measure: null,
    length: null,
    width: null,
    height: null,
    volume: null,
    stackable: false,
    floor_board: false,
})

const commodityInfo = ref(defaultCommodity.value)

const title = computed(() => {
    return props.updating ? 'Commodity Info' : 'Book Commodity'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})

watch(dialog, (val) => {
    if (val && props.updating) {
        commodityInfo.value = props.item as CommodityInfo
    } else {
        commodityInfo.value = defaultCommodity.value
    }
})
</script>