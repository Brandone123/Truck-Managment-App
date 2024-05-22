<template>
    <v-dialog v-model="dialog" width="700px">
        <template v-slot:activator="{ props }">
            <v-btn color="success" density="comfortable" icon="mdi-send-circle" v-bind="props" variant="text"></v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" title="Send Check Call Message" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="checkCallForm">
                    <v-row>
                        <v-col cols="12">
                            <v-select flat density="compact" v-model="messageType" label="Category"
                                :items="['Arrival', 'Departure', 'In Transit', 'Exception']" variant="solo"
                                :rules="[rules.required]"></v-select>
                        </v-col>
                    </v-row>
                    <v-row v-if="messageType == 'Arrival'">
                        <v-col cols="12">
                            <v-text-field :disabled="arriveMessage.useCurrentTime" flat
                                v-model="arriveMessage.arriveTime" density="compact" label="Arrival Time"
                                type="datetime-local" variant="solo"
                                :rules="arriveMessage.useCurrentTime ? [] : [rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox label="Use Current Time" v-model="arriveMessage.useCurrentTime"
                                color="primary"></v-checkbox>
                        </v-col>
                    </v-row>

                    <v-row v-if="messageType == 'Departure'">
                        <v-col cols="12">
                            <v-text-field :disabled="departMessage.useCurrentTime" flat
                                v-model="departMessage.departTime" density="compact" label="Departure Time"
                                type="datetime-local" variant="solo" :rules="departMessage.useCurrentTime ? [] : [rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox label="Use Current Time" v-model="departMessage.useCurrentTime"
                                color="primary"></v-checkbox>
                        </v-col>
                    </v-row>


                    <v-row v-if="messageType == 'In Transit'">
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field :disabled="inTransitMessage.useCurrentTrailerLocation" flat variant="solo"
                                density="compact" v-model="inTransitMessage.longitude" label="Longitude"
                                :rules="inTransitMessage.useCurrentTrailerLocation ? [] : [rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field :disabled="inTransitMessage.useCurrentTrailerLocation" flat variant="solo"
                                density="compact" v-model="inTransitMessage.latitude" label="Latitude"
                                :rules="inTransitMessage.useCurrentTrailerLocation ? [] : [rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-checkbox label="Use Current Trailer Location"
                                v-model="inTransitMessage.useCurrentTrailerLocation" color="primary"
                                hide-details></v-checkbox>
                        </v-col>
                    </v-row>

                    <v-row v-if="messageType == 'Exception'">
                        <v-col cols="12" md="6" class="pb-0">
                            <v-autocomplete flat variant="solo" density="compact" v-model="exceptionMessage.statusCode"
                                label="Status Code" :items="exceptionStatusCodes" item-title="text" item-value="value"
                                :rules="[rules.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-autocomplete flat variant="solo" density="compact" v-model="exceptionMessage.reasonCode"
                                label="Reason Code" :items="exceptionReasonCodes" item-title="text" item-value="value"
                                :rules="[rules.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field flat density="compact" v-model="exceptionMessage.expectedDeliveryDatetime"
                                label="Expected Delivery Time" type="datetime-local" variant="solo"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea flat density="compact" :v-model="exceptionMessage.comments" hide-details
                                label="Comments" variant="solo"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save()">
                    Send
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadStore } from '~/stores/settings/dispatch/load'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'

const dialog = ref(false)

const props = defineProps({
    loadInfo: {
        type: Object as () => LoadInfo,
        required: true
    },
    stopInfo: {
        type: Object as () => StopInfo,
        reqired: true
    }
})

let loadStore = useLoadStore()

const checkCallForm: Ref<HTMLFormElement | null> = ref(null);

const messageType = ref<string | null>(null)

const exceptionMessage = ref({
    statusCode: null,
    reasonCode: null,
    comments: null,
    expectedDeliveryDatetime: null,
})

const arriveMessage = ref({
    arriveTime: null,
    useCurrentTime: true,
})

const departMessage = ref({
    departTime: null,
    useCurrentTime: true,
})

const rules = computed(() => {
    return {
        required: (value: string) => !!value || 'Field is required',
    }
})

const inTransitMessage = ref({
    longitude: null,
    latitude: null,
    useCurrentTrailerLocation: true,
})

const exceptionStatusCodes = ref([
    { text: 'Carrier Departed Pick-up Location with Shipment', value: 'AF' },
    { text: 'Estimated Delivery', value: 'AG' },
    { text: 'Rail Arrival At Destination Ramp', value: 'AR' },
    { text: 'Completed Unloading at Delivery Location', value: 'D1' },
    { text: 'In-Gate', value: 'I1' },
    { text: 'Out-Gate', value: 'OA' },
    { text: 'Rail Departure from Origin Ramp', value: 'RL' },
    { text: 'Arrived at Delivery Location', value: 'X1' },
    { text: 'Arrived at Pick-up Location', value: 'X3' },
    { text: 'En Route to Delivery Location', value: 'X6' }
])

const exceptionReasonCodes = ref([
    { text: 'Waiting Shipping Instructions', value: 'C6' },
    { text: 'Waiting for Customer Specified Carrier', value: 'C7' },
    { text: 'Collect on Delivery Required', value: 'C8' },
    { text: 'Cash Not Available From Consignee', value: 'C9' },
    { text: 'Customs (Import or Export)', value: 'CA' },
    { text: 'No Requested Arrival Date Provided by Shipper', value: 'CB' },
    { text: 'No Requested Arrival Time Provided by Shipper', value: 'CC' },
    { text: 'Carrier Dispatch Error', value: 'D1' },
    { text: 'Driver Not Available', value: 'D2' },
    { text: 'Non-Express Clearance Delay', value: 'F1' },
    { text: 'International Non-carrier Delay', value: 'F2' },
    { text: 'Held Pending Appointment', value: 'HB' },
    { text: 'Normal Appointment', value: 'NA' },
    { text: 'Normal Status Processing Delay', value: 'NS' },
    { text: 'Waiting Inspection', value: 'P1' },
    { text: 'Production Falldown', value: 'P2' },
    { text: 'Held for Full Carrier Load', value: 'P3' },
    { text: 'Reconsigned Delivery', value: 'P4' },
    { text: 'Shortage', value: 'RC' },
    { text: 'Tractor With Sleeper Car Not Available', value: 'S1' },
    { text: 'Tractor, Conventional, Not Available', value: 'T1' },
    { text: 'Trailer not Available', value: 'T2' },
    { text: 'Trailer Not Usable Due to Prior Product', value: 'T3' },
    { text: 'Trailer Class Not Available', value: 'T4' },
    { text: 'Trailer Volume Not Available', value: 'T5' },
    { text: 'Insufficient Delivery Time', value: 'T6' },
    { text: 'Other', value: 'T7' }
])


const save = async () => {
    if (checkCallForm.value) {
        const formStatus = await checkCallForm.value.validate()
        if (!formStatus.valid) {
            return
        }

        let extraData = {
            loadTenderId: props.loadInfo?.tender_id,
            stopSequenceNumber: props.stopInfo?.sequence,
            action: props.stopInfo?.stop_reason,
            //stopName: '',
            stopAddress: `${props.stopInfo?.location?.AddressLine}, ${props.stopInfo?.location?.AddressLine_2}`,
            stopCity: props.stopInfo?.location?.City,
            stopState: props.stopInfo?.location?.State,
        }

        switch (messageType.value) {
            case 'Arrival':
                loadStore.sendEDIArriveMessage({
                    ...extraData,
                    ...arriveMessage.value
                })
                break;
            case 'Departure':
                loadStore.sendEDIDepartMessage({
                    ...extraData,
                    ...departMessage.value
                })
                break;
            case 'In Transit':
                loadStore.sendEDIInTransitMessage({
                    ...extraData,
                    ...inTransitMessage.value
                })
                break;
            case 'Exception':
                loadStore.sendEDIExceptionMessage({
                    ...extraData,
                    ...exceptionMessage.value
                })
                break;
        }

        dialog.value = false
        nextTick(()=>{
            resetForm()
        })
    }
}

const resetForm = () => {
    if (checkCallForm.value) {
        (checkCallForm.value as HTMLFormElement).reset(); // Reset the form
    }

    messageType.value = null

    exceptionMessage.value = {
        statusCode: null,
        reasonCode: null,
        comments: null,
        expectedDeliveryDatetime: null,
    }

    arriveMessage.value = {
        arriveTime: null,
        useCurrentTime: true,
    }

    departMessage.value = {
        departTime: null,
        useCurrentTime: true,
    }

    inTransitMessage.value = {
        longitude: null,
        latitude: null,
        useCurrentTrailerLocation: true,
    }
}

</script>
