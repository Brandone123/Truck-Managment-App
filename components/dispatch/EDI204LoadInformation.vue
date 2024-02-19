<template>
    <v-dialog v-model="dialog" scrollable width="800px">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" variant="text" flat v-bind="props" class="text-none">
                {{ itemLabel }}
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" title="204 Load Information" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
                <template v-slot:extension>
                    <v-row no-gutters class="px-3">
                        <div>Customer: John Doe</div>
                        <v-spacer></v-spacer>
                        <div>Reference: 532141</div>
                    </v-row>
                </template>
            </v-toolbar>
            <v-card-text>
                <v-tabs density="compact" v-model="tab" align-tabs="title" color="primary" class="mb-2">
                    <v-tab value="load-info">
                        Load Info
                    </v-tab>
                    <v-tab value="raw-data">
                        Raw Data
                    </v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item value="load-info">

                        <v-card flat>
                            <v-card-text>
                                <div class="d-flex justify-space-between mb-2">
                                    <span class=" font-weight-bold">Stops</span>
                                    <v-btn variant="text" class="text-none" color="primary">Load: 1234</v-btn>
                                </div>
                                <SharedUiCustomTableVariant :headers="stopHeaders" :items="stopInfo.stops" />
                            </v-card-text>
                        </v-card>

                        <v-card flat class="mt-2">
                            <v-card-text>
                                <div class="d-flex justify-space-between mb-2">
                                    <span class=" font-weight-bold">Commodities</span>
                                </div>
                                <SharedUiCustomTableVariant :headers="commodityHeaders" :items="stopInfo.commodities" />
                            </v-card-text>
                        </v-card>

                        <v-card flat class="mt-2">
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-textarea :v-model="stopInfo.notes" hide-details label="notes"
                                            variant="outlined"></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>


                    </v-window-item>
                    <v-window-item value="raw-data">
                        <v-card flat>
                            <v-card-text>Raw Data</v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>



            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="dialog = false">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadStore } from '@/stores/load'
import { useLoadTypeStore } from '@/stores/settings/dispatch/load_type'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
// import { LoadInfo } from '@/types/store/load'

const dialog = ref(false)

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    itemLabel: {
        type: String,
    required: true, 
   }
});

const tab = ref('load-info')

const stopHeaders = ref([
    { title: 'Source', key: 'source', sortable: false },
    { title: 'Destination', key: 'destination' },
    { title: 'City', key: 'city', sortable: false },
    { title: 'St', key: 'state', sortable: false },
    { title: 'Zip', key: 'zip', sortable: false },
])

const commodityHeaders = ref([
    { title: 'Source', key: 'source', sortable: false },
    { title: 'Destination', key: 'destination' },
    { title: 'Pieces', key: 'pieces', sortable: false },
    { title: 'Weight', key: 'weight', sortable: false },
])


const stopInfo = {
    stops: [
        {
            source: 'UNI LOGISTICS',
            destination: 'UNI LOGISTICS',
            city: 'GRAND PRA',
            state: 'TX',
            zip: '1234',
        },
        {
            source: 'AVAC-VAA',
            destination: 'AVAC-VAA',
            city: 'ARLINGTON',
            state: 'TX',
            zip: '4329',
        },
        {
            source: 'ODC LOGISTICS DETROIT',
            destination: 'ODC LOGISTICS',
            city: 'WOODHAVEN',
            state: 'MI',
            zip: '836362',
        },
    ],
    commodities: [],
    notes: "",
}

watch(dialog, (val) => {
    if (val) {
        tab.value = 'load-info'
    }
})
</script>

<style scoped>
.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) :deep() .v-tab:first-child {
    margin-inline-start: 0px;
}
</style>