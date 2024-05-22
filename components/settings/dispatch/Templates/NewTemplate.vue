<template>
    <v-dialog v-model="dialog" scrollable fullscreen>
        <template v-slot:activator="{ props }">
            <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add Template
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
                <v-form ref="loadTemplateForm">
                    <v-row>

                        <v-col cols="12" md="6" class="pb-0">
                            <v-select v-model="loadTemplate.customer_id" variant="solo" flat label="Customer"
                                :items='[{ id: 1, name: "Customer 1" }, { id: 2, name: "Customer 2" }]' density="compact"
                                item-title="name" item-value="id"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-select v-model="loadTemplate.route_id" variant="solo" flat label="Route"
                                :items='[{ id: 1, name: "1111" }, { id: 2, name: "1112" }]' density="compact"
                                item-title="id" item-value="id"></v-select>
                        </v-col>
                        <!-- <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.pickup_city" variant="solo" flat label="Pickup City"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.pickup_state" variant="solo" flat
                                        label="Pickup State" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.pickup_address" variant="solo" flat
                                        label="Pickup Address" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.delivery_city" variant="solo" flat
                                        label="Delivery City" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.delivery_state" variant="solo" flat
                                        label="Delivery State" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadTemplate.delivery_address" variant="solo" flat
                                        label="Delivery Address" density="compact"></v-text-field>
                                </v-col> -->
                    </v-row>
                    <div class="d-flex justify-space-between my-2">
                        <span class="text-h6 text-primary">Stops</span>
                        <SettingsDispatchTemplatesAddStop :show="stopDialog" @update:show="updateStopDialog"
                            :updating="updatingStop" :item="editedStop" @addStop="saveAddStop" @editStop="saveEditStop" />
                    </div>

                    <SharedUiCustomTableVariant :headers="stopHeaders" :items="loadTemplate.stops" class="mb-2">
                        <template v-slot:item.stop="{ item }">
                            <v-btn color="primary" variant="text" density="compact" class="text-none"
                                @click="editStop(item)">
                                {{ item.stop }}
                            </v-btn>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" density="compact" v-bind="props" icon="mdi-dots-vertical">
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item @click="editStop(item)">
                                        <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="deleteStop(item.id)">
                                        <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </SharedUiCustomTableVariant>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'

const emit = defineEmits(['update:show'])

const loadTemplateStore = useLoadTemplateStore()
const { loadTemplateList } = storeToRefs(loadTemplateStore)

const props = defineProps({
    item: {
        type: Object,
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

const loadTemplateForm = ref(null)
// onMounted(() => {
//     console.log(loadTemplateStore)
// });

const defaultLoadTemplate = ref<LoadInfo>({
    stops: []
})

const loadTemplate = ref<LoadInfo>(defaultLoadTemplate.value)

const editedStop = ref<StopInfo>({});
const stopDialog = ref(false)
const updatingStop = ref(false)

const stopHeaders = ref([
    { title: 'Stop', key: 'stop', sortable: false },
    { title: 'No', key: 'stop_number' },
    // { title: 'Av', key: 'available_from', sortable: false },
    // { title: 'Thru', key: 'available_through', sortable: false },
    // { title: 'From', key: 'time_from', sortable: false },
    // { title: 'To', key: 'time_to', sortable: false },
    { title: 'Appt', key: 'appointment_required', sortable: false },
    // { title: 'Appt Ref', key: 'appointment_reference', sortable: false },
    { title: 'Shipper', key: 'shipper', sortable: false },
    { title: 'Address', key: 'address', sortable: false },
    { title: 'City', key: 'city', sortable: false },
    { title: 'St', key: 'state', sortable: false },
    { title: 'Zip', key: 'zip', sortable: false },
    { title: 'Z', key: 'zone', sortable: false },
    // { title: 'MI', key: 'mi', sortable: false },
    { title: 'Reference', key: 'reference', sortable: false },
    { title: '', key: 'actions', sortable: false }
])


const editStop = (stop: any) => {
    editedStop.value = Object.assign({},stop)
    updatingStop.value = true
    stopDialog.value = true
}

const updateStopDialog = (value: any) => {
    stopDialog.value = value
    editedStop.value = {}
    updatingStop.value = false
}

const saveAddStop = (stop: StopInfo) => {
    if (!Array.isArray(loadTemplate.value.stops)) {
        loadTemplate.value.stops = []
    }
    loadTemplate.value.stops.push(stop)
}

const saveEditStop = (stop: StopInfo) => {
    if (loadTemplate.value.stops) {
        let index = loadTemplate.value.stops.findIndex(item => item.id == stop.id)
        if (index > -1) {
            Object.assign(loadTemplate.value.stops[index], stop)
        }
    }
}

const deleteStop = (id: number) =>{
    if (loadTemplate.value.stops) {
        let index = loadTemplate.value.stops.findIndex(item => item.id == id)
        if (index > -1) {
            loadTemplate.value.stops.splice(index,1)
        }
    }
}

const title = computed(() => {
    return props.updating ? 'Edit Load Template' : 'New Load template'
})

const saveButtonText = computed(() => {
    return props.updating ? 'Update' : 'Save'
})

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})


const save = () => {
    if (props.updating) {
        //Updating Template
        let payload = Object.assign({}, loadTemplate.value)
        loadTemplateStore.updateLoadTemplate(payload)
    } else {
        //Adding New Template
        let payload = Object.assign({}, loadTemplate.value)
        payload.id = loadTemplateList.value.length
        loadTemplateStore.createLoadTemplate(payload)
    }
    dialog.value = false
}

const resetForm = () => {
    if (loadTemplateForm.value) {
        (loadTemplateForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        loadTemplate.value = Object.assign({}, props.item)
    } else {
        loadTemplate.value = Object.assign({},defaultLoadTemplate.value)
        resetForm()
    }
})
</script>