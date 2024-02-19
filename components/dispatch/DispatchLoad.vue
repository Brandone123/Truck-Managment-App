<template>
    <v-dialog v-model="dialog" persistent scrollable width="1200px">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
                <v-icon>mdi-truck-fast-outline</v-icon>
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact">
                <v-btn icon="mdi-chevron-left" @click="activeWindow = 'dispatch-summary'"
                    :disabled="activeWindow == 'dispatch-summary'"></v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu>
                    <template v-slot:activator="{ props: menu }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props: tooltip }">
                                <v-btn icon v-bind="mergeProps(menu, tooltip)" v-if="activeWindow == 'dispatch-summary'">
                                    <v-icon>mdi-truck-fast-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Dispatch</span>
                        </v-tooltip>
                    </template>
                    <v-list density="compact">
                        <v-list-item @click="dispatchLoad()">
                            <v-list-item-title>Dispatch Load</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="brokerLoad()">
                            <v-list-item-title>Broker Load</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn icon @click="dialog = false" class="ml-3">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-window v-model="activeWindow">
                    <v-window-item value="dispatch-summary">
                    <!-- <div style="display:relative;right:20px; top: 50px;" class="text-primary font-h4">ETA: 15hrs 20mins</div> -->
                        <v-row>
                            <v-col cols="12" md="4">

                                <v-card flat>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="6">
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Load</p>
                                                    <p class="text-primary">1234</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Status</p>
                                                    <p class="text-primary">Ready</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Type</p>
                                                    <p class="text-primary">{{ }}</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Seal</p>
                                                    <p class="text-primary">{{ }}</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Miles</p>
                                                    <p class="text-primary">{{ }}</p>
                                                </div>
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="d-flex">
                                                    <p style="width: 100px;">X Stops</p>
                                                    <p class="text-primary">Yes</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Haz Mat</p>
                                                    <p class="text-primary text-center">No</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Tailgates</p>
                                                    <p class="text-primary">Mo</p>
                                                </div>
                                                <div class="d-flex">
                                                    <p style="width: 100px;">Variance</p>
                                                    <p class="text-primary">No</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>


                                    <v-divider class="my-2 mx-3" thickness="4"></v-divider>

                                    <v-card-text>
                                        <v-table density="compact">
                                            <thead>
                                                <th></th>
                                                <th>Freight</th>
                                                <th>Access</th>
                                                <th>Total</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Rev</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                </tr>
                                                <tr>
                                                    <td>Exp</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                </tr>
                                                <tr>
                                                    <td>Net</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                    <td class="text-primary text-center">0.0</td>
                                                </tr>
                                                <tr>
                                                    <td>%</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-card flat>
                                    <v-card-text>
                                        <div class="text-center mb-2 font-weight-bold">Dispatch and Accessorial Pay</div>
                                        <SharedUiCustomTableVariant :headers="dispatchAccessoryHeaders"
                                            :items="dispatchAccessories" />
                                    </v-card-text>

                                    <v-divider class="my-2 mx-3" thickness="4"></v-divider>

                                    <v-card-text>
                                        <div class="text-center mb-2 font-weight-bold">Accessorial Billed</div>
                                        <SharedUiCustomTableVariant flat :headers="dispatchAccessoryHeaders" :items="[]" />
                                    </v-card-text>

                                </v-card>
                            </v-col>

                            <v-col cols="12">
                                <v-card flat>
                                    <SharedUiCustomTableVariant flat :headers="loadMovementHeaders" :items="[]">
                                        <template v-slot:top>
                                            <div class="text-center text-subtitle font-weight-bold">Load Movement Summary
                                            </div>
                                        </template>
                                    </SharedUiCustomTableVariant>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>

                    <v-window-item value="dispatch-load">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-card flat>
                                    <v-card-text>
                                        <v-row class="pt-3">
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Pay Code"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined" type="date"
                                                    label="Date"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Unit"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Driver"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Co Driver"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Truck"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Trailer"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pt-0">
                                                <v-textarea hide-details density="compact" variant="outlined"
                                                    label="Notes"></v-textarea>
                                            </v-col>
                                        </v-row>
                                        <!-- <v-row>
                                            <v-col>
                                                <div class="d-flex justify-space-between" style="overflow-x:auto;">
                                                    <div class="d-flex align-center"
                                                        :style="{ flexGrow: i + 1 < dispatchAssignment.length ? 1 : null }"
                                                        v-for="(item, i) in  dispatchAssignment " :key="i">

                                                        <div class="d-flex flex-column align-center">
                                                            <v-avatar color="primary"><v-icon>{{ item.icon
                                                            }}</v-icon></v-avatar>
                                                        </div>
                                                        <div style="width: 100% ; min-width: 150px;"
                                                            class="d-flex flex-column align-center ml-n4 mr-n4"
                                                            v-if="i + 1 < dispatchAssignment.length">
                                                            <span>{{ item.distance_from_next_location }}</span>
                                                            <span
                                                                style="width:100%; height: 3px; background-color:rgb(var(--v-theme-primary));"></span>
                                                            <span v-if="item.info"
                                                                :class='[item.info_color ? item.info_color : "text-primary"]'>{{
                                                                    item.info
                                                                }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                               
                                            </v-col>
                                        </v-row> -->
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card flat>
                                    <v-card-text>
                                        <v-timeline side="end" class="mt-10">
                                            <v-timeline-item v-for="(item, i) in dispatchAssignment" :key="i"
                                                dot-color="primary" :icon="item.icon" fill-dot>
                                                <template v-slot:opposite>
                                                    {{ item.name }}
                                                </template>
                                                <span v-if="item.info"
                                                    :class='[item.info_color ? item.info_color : "text-primary"]'>{{
                                                        item.info
                                                    }}</span>
                                            </v-timeline-item>
                                        </v-timeline>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-card flat>
                                    <v-card-text>
                                        <v-row class="pt-3">
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Pay Source"></v-text-field></v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Pay Matrix"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Pay Type"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Loaded Miles"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Empty Miles"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Loaded Rate"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="pt-0">
                                                <v-text-field hide-details density="compact" variant="outlined"
                                                    label="Empty Rate"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">


                                <v-card flat>
                                    <v-card-text>
                                        <div class="font-weight-bold mb-2">Dispatch Starts</div>
                                        <v-row>
                                            <v-col cols="12" md="6" class="pb-0">
                                                <v-text-field type="date" hide-details density="compact" variant="outlined"
                                                    label="Date"></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="3" class="pb-0">
                                                <v-text-field type="time" hide-details density="compact" variant="outlined"
                                                    label="From"></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="3" class="pb-0">
                                                <v-text-field type="time" hide-details density="compact" variant="outlined"
                                                    label="To"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <div class="text-primary mt-5">GCDM FACTORY THREE ASAM</div>
                                        <div class="text-primary">115 WEST GRAND BLVD</div>
                                        <div class="text-primary">DETROIT, MI 4321 </div>

                                        <div class="font-weight-bold mb-2 mt-5">Dispatch Delivers</div>
                                        <v-row>
                                            <v-col cols="12" md="6" class="pb-0">
                                                <v-text-field type="date" hide-details density="compact" variant="outlined"
                                                    label="Date"></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="3" class="pb-0">
                                                <v-text-field type="time" hide-details density="compact" variant="outlined"
                                                    label="From"></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="3" class="pb-0">
                                                <v-text-field type="time" hide-details density="compact" variant="outlined"
                                                    label="To"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <div class="text-primary mt-5">VIROLEX SA DECA</div>
                                        <div class="text-primary">1155 S NEWBURN RD</div>
                                        <div class="text-primary">DETROIT, MI 1234 </div>

                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>

                    <v-window-item value="broker-load">
                        <v-btn @click="activeWindow = 'dispatch-summary'">Back</v-btn>
                    </v-window-item>
                </v-window>

            </v-card-text>
            <v-divider v-if="activeWindow != 'dispatch-summary'"></v-divider>
            <v-card-actions v-if="activeWindow != 'dispatch-summary'">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="text-none" variant="text" @click="saveDispatch()">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
// import { useZoneStore } from '@/stores/settings/dispatch/zone'
// import type { StopInfo } from '@/types/store/load'
import { ref, computed, defineProps, defineEmits, toRefs, watch, mergeProps } from 'vue'
// import { LoadInfo } from '@/types/store/load'

const emit = defineEmits(['update:show'])

const props = defineProps({
    item: {
        type: Object,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false,
    },
    show: {
        type: Boolean,
        default: false
    }
});

const dialog = ref(false)

const activeWindow = ref('dispatch-summary')

const dispatchAccessoryHeaders = ref([
    { title: 'Date', key: 'date', sortable: false },
    { title: 'Name', key: 'name', sortable: false },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Pay Code', key: 'pay_code', sortable: false },
    { title: 'Type', key: 'type', sortable: false },
    { title: 'Miles', key: 'miles', sortable: false },
    { title: 'Rates', key: 'rates', sortable: false },
    { title: 'Pay', key: 'pay', sortable: false },
    { title: 'Batch', key: 'batch', sortable: false },
])

const loadMovementHeaders = ref([
    { title: ' ', key: 'id', sortable: false },
    { title: 'Date', key: 'date', sortable: false },
    { title: 'Action', key: 'action', sortable: false },
    { title: 'Company', key: 'company', sortable: false },
    { title: 'City/St', key: 'city_st', sortable: false },
    { title: 'Date', key: 'date', sortable: false },
    { title: 'From', key: 'from', sortable: false },
    { title: 'To', key: 'to', sortable: false },
    { title: 'Unit', key: 'unit', sortable: false },
    { title: 'Carried By', key: 'carried_by', sortable: false },
    { title: 'Truck', key: 'truck', sortable: false },
    { title: 'Trailer', key: 'trailer', sortable: false },
])

const dispatchAccessories = ref([
    { date: '2023-11-11', name: 'test', status: 'status', pay_code: '1234', type: 'type', miles: '40', rates: 'rates', pay: 'pay', batch: 'batch' },
    { date: '2023-11-11', name: 'test', status: 'status', pay_code: '1234', type: 'type', miles: '40', rates: 'rates', pay: 'pay', batch: 'batch' },
    { date: '2023-11-11', name: 'test', status: 'status', pay_code: '1234', type: 'type', miles: '40', rates: 'rates', pay: 'pay', batch: 'batch' },
    { date: '2023-11-11', name: 'test', status: 'status', pay_code: '1234', type: 'type', miles: '40', rates: 'rates', pay: 'pay', batch: 'batch' },
])

const zoneStore = useZoneStore()
const { zoneList } = storeToRefs(zoneStore)

const dispatchSummaryInfo = ref({})


const dispatchAssignment = ref([
    {
        name: 'Truck',
        address: 'Truck Address',
        icon: 'mdi-truck-flatbed',
        distance_from_next_location: '20 Miles',
        info: 'Bobtail',
        info_color: 'text-error'
    },
    {
        name: 'Trailer',
        address: 'Trailer Address',
        icon: 'mdi-truck-trailer',
        distance_from_next_location: '20 Miles',
        info: 'ETA: 2023-11-11 13:00'
    },
    {
        name: 'Load',
        address: 'Load Address',
        icon: 'mdi-truck-cargo-container',
        distance_from_next_location: '10 Miles',
        info: 'ETA: 2023-11-11 13:00'
    }
])

const title = computed(() => {
    switch (activeWindow.value) {
        case 'dispatch-summary':
            return 'Dispatch Summary'
        case 'dispatch-load':
            return 'Dispatch Assignment'
        case 'broker-load':
            return "Broker Load Dispatch"
    }
})

const saveDispatch = () => {
    switch (activeWindow.value) {
        case 'dispatch-load':
        //save dispatch logic
        case 'broker-load':
        //broker load logic
    }
    dialog.value = false
}

const dispatchLoad = () => {
    activeWindow.value = 'dispatch-load'
}

const brokerLoad = () => {
    console.log('brokering load')
}

watch(dialog, (val) => {
    if (val) {
        activeWindow.value = 'dispatch-summary'
    }
})
</script>