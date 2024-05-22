<template>
    <v-dialog v-model="dialog" scrollable width="800px">
        <template v-slot:activator="{ props }">
            <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Add Stop
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
                <v-form ref="stopForm">
                    <v-row class="my-4">
                        <v-col cols="12" class="pb-0">

                            <v-row>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-select v-model="stopInfo.stop" variant="solo" flat label="Ship/Cons"
                                        :items='[{ text: "Shipper", value: "shipper" }, { text: "Consignee", value: "consignee" }]'
                                        density="compact" item-title="text" item-value="value"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.stop_number" variant="solo" flat type="number"
                                        label="Stop No" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.available_from" variant="solo" flat type="date"
                                        label="Available From" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.available_through" variant="solo" flat type="date"
                                        label="Available Thru" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.time_from" variant="solo" flat type="time"
                                        label="Time From" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.time_to" variant="solo" flat type="time" label="Time To"
                                        density="compact"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider></v-divider>
                        <v-col cols="12" class="pb-0">
                            <v-row>
                                <v-col cols="12" md="12" class="pb-0">
                                    <v-select v-model="stopInfo.shipper" variant="solo" flat label="Company"
                                        :items='[{ id: 1, name: "team1" }, { id: 2, name: "team2" }]' item-value="id"
                                        item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="12" class="pb-0">
                                    <v-text-field v-model="stopInfo.address" variant="solo" flat label="Address"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field variant="solo" flat label="City" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-select variant="solo" flat :items="['item1', 'item2']" label="State"
                                        density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-text-field variant="solo" flat label="Zip" type="number"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="pb-0">
                                    <v-select variant="solo" flat :items="zoneList" item-title="code" item-value="id"
                                        label="Zone" density="compact"></v-select>
                                </v-col>

                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.phone" variant="solo" flat label="Phone"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.contact" variant="solo" flat label="Contact"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.reference" variant="solo" flat label="Reference"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4" class="pb-0">
                                    <v-checkbox v-model="stopInfo.appointment_required" label="Appt Required"
                                        density="compact" color="primary" hide-details></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4" class="pb-0">
                                    <v-text-field v-model="stopInfo.appointment_reference" variant="solo" flat
                                        label="Appt Reference" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-textarea v-model="stopInfo.notes" variant="solo" flat label="Notes"
                                        density="compact"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="6" class="pb-0">
                                    <v-textarea v-model="stopInfo.location_notes" variant="solo" flat label="Location Notes"
                                        density="compact"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="6" class="pb-0">
                                    <v-textarea v-model="stopInfo.directions" variant="solo" flat label="Directions"
                                        density="compact"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
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
// import { useZoneStore } from '@/stores/settings/dispatch/zone'
// import type { StopInfo } from '@/types/store/load'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
import type { StopInfo } from '~/types/dispatch/load'

const emit = defineEmits(['update:show', 'addStop', 'editStop'])

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

const zoneStore = useZoneStore()
const { zoneList } = storeToRefs(zoneStore)

const stopForm = ref(null)

const defaultStop = ref<StopInfo>({
    id: null,
    stop: null,
    stop_number: null,
    available_from: null,
    available_through: null,
    time_from: null,
    time_to: null,
    appointment_required: false,
    appointment_reference: null,
    shipper: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    zone: null,
    mi: null,
    phone: null,
    contact: null,
    reference: null,
    notes: null,
    location_notes: null,
    directions: null,
})

const stopInfo = ref(defaultStop.value)

const title = computed(() => {
    return props.updating ? 'Stop Info' : 'Book Stop'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})


const save = () => {
    let payload = Object.assign({}, stopInfo.value)
    if (props.updating) {
        //updating stop
        emit('editStop', payload)
    } else {
        //adding stop
        emit('addStop', payload)
    }
    dialog.value = false
}

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})

const resetForm = () => {
    if (stopForm.value) {
        (stopForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        stopInfo.value = props.item as StopInfo
    } else {
        // stopInfo.value = defaultStop.value
        resetForm()
    }
})
</script>