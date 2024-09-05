<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import type { LocationInfo } from '~/types/attendance/location';
import { useLocationStore } from '@/stores/settings/attendance/locations'
import AttendanceLocationDialog from '~/components/settings/locations/LocationDialog.vue'

const locationStore = useLocationStore()
const { LocationList, loading } = storeToRefs(locationStore)


const layoutStore = useLayoutStore()
onMounted(() => {
    locationStore.fetchLocationList();
});

const locationHeaders = ref([
    { title: 'ID', key: 'id' },
    { title: 'NAME', key: 'Name' },
    { title: 'Location Type', key: 'location_type' },
    { title: 'LOCATION CODE', key: 'LocationCode', sortable: false },
    { title: 'ADDRESS LINE', key: 'AddressLine', sortable: false },
    { title: 'CITY', key: 'City' },
    { title: 'STATE', key: 'State' },
    { title: 'CONTACT', key: 'contact' },
    { title: 'PHONE', key: 'phone' },
    { title: 'GEOFENCE RADIUS', key: 'GeofenceRadius' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedLocation = ref<LocationInfo>({
    id: null,
    Name: '',
    LocationCode: null,
    AddressLine: '',
    City: '',
    State: '',
    contact: null,
    phone: null,
    location_type: null,
    latitude: null,
    longitude: null,
    geofence_latitude_1: null,
    geofence_longitude_1: null,
    geofence_latitude_2: null,
    geofence_longitude_2: null,
    geofence_latitude_3: null,
    geofence_longitude_3: null,
    geofence_latitude_4: null,
    geofence_longitude_4: null,
    GeofenceRadius: null
})
const updatingLocation = ref(false)
const locationDialog = ref(false)

const LocationTable = ref(null)

const editLocation = (Location: LocationInfo) => {
    editedLocation.value = Object.assign({}, Location)
    updatingLocation.value = true
    locationDialog.value = true
}

const deleteLocation = async (Location_Id: number) => {
    const { confirm } = await layoutStore.showConfirmDialog("Are you sure you want to delete")
    if (confirm) {
       locationStore.deleteLocation(Location_Id)
    }
}

const updateDialog = (value: boolean) => {
    locationDialog.value = value
    editedLocation.value = {
        id: null,
        Name: '',
        LocationCode: null,
        AddressLine: '',
        City: '',
        State: '',
        contact: null,
        phone: null,
        location_type: null,
        latitude: null,
        longitude: null,
        geofence_latitude_1: null,
        geofence_longitude_1: null,
        geofence_latitude_2: null,
        geofence_longitude_2: null,
        geofence_latitude_3: null,
        geofence_longitude_3: null,
        geofence_latitude_4: null,
        geofence_longitude_4: null,
        GeofenceRadius: null
    }
    updatingLocation.value = false
}

</script>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Location</span>
            <AttendanceLocationDialog @update:show="updateDialog"
             :show="locationDialog" :updating="updatingLocation" :item="editedLocation" />
        </div>
        <div>
            <SharedUiCustomTable ref="LocationTable" show-select return-object
             :headers="locationHeaders" :items="LocationList" :loading="loading">
                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editLocation(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteLocation(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>
