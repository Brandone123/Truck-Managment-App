<script setup lang="ts">
import { ref, computed } from 'vue';
import googleMaps from '@/composables/googleMaps'
import type { DispatchLocationInfo } from '~/types/dispatch/location';
import type GoogleMap from '@/composables/googleMaps';
import { data } from 'jquery';

const dispatchLocationStore = useDispatchLocationStore()
const { dispatchLocationList } = storeToRefs(dispatchLocationStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    dispatchLocationStore.fetchDispatchLocationList();
});

const search = ref<string | null>(null);
const menu = ref('dispatchLocationList') // options ['dispatchLocationList','locationDetails']
const detailsType = ref('create') //options ['create','update']

const currentLocationId = ref<number | null>(null);
const currentLocation = ref<DispatchLocationInfo>({} as DispatchLocationInfo)

const currentMarker = ref<google.maps.Marker | undefined>()
const mapInstance = ref<googleMaps | undefined>();
const geofenceCircle = ref<google.maps.Circle | undefined>()

const defaultGeofenceRadius = ref<number>(50);

const mapLoader = ref<HTMLElement | null>()

const dispatchLocationForm: Ref<HTMLFormElement | null> = ref(null);

const filteredLocationList = computed(() => {
    let searchParameter = (search.value || "").toLowerCase().trim()
    if (searchParameter.length > 0) {
        return dispatchLocationList.value.filter(location => location.Name.toLowerCase().includes(searchParameter))
    }
    return dispatchLocationList.value
})

const selectedLocation = computed(() => {
    return dispatchLocationList.value.find(location => location.id == currentLocationId.value) || {} as DispatchLocationInfo
})

const currentView =  computed(() => {
    if(menu.value != 'dispatchLocationList'){
        return detailsType.value == 'create' ? ' | New' : ' | Details'
    }
    return null
})

watch(selectedLocation, (val) => {
    currentLocation.value = selectedLocation.value
})

const previewDetails = async (location: any) => {
    currentLocationId.value = location.id //{...location, geofenceRadius: 1}
    menu.value = 'locationDetails'
    detailsType.value = 'update'

    if (location.longitude != null && location.latitude != null) {

        //store default geofence value if not present
        if (!location.GeofenceRadius) {
            dispatchLocationStore.updateDispatchLocation({ ...location, GeofenceRadius: defaultGeofenceRadius.value })
        }

        let markerPosition = { lat: location.latitude, lng: location.longitude }
        displayMarker(markerPosition as google.maps.LatLng, location.GeofenceRadius || defaultGeofenceRadius.value)
    }
    else {
        //hide map loader once map is rendered
        if (mapLoader.value) {
            mapLoader.value.style.display = "block"
        }

        let { data: markerPosition, error } = await getLatLngFromAddress(`${location.AddressLine}, ${location.City}, ${location.State}`)

        // save response to database for future reference
        let updatePayload = {
            ...selectedLocation.value,
            longitude: markerPosition?.lng(),
            latitude: markerPosition?.lat(),
            GeofenceRadius: defaultGeofenceRadius.value
        }

        console.log(updatePayload)
        dispatchLocationStore.updateDispatchLocation(updatePayload as any)
        displayMarker(markerPosition as google.maps.LatLng, location.GeofenceRadius || defaultGeofenceRadius.value)

        //hide map loader once map is rendered
        if (mapLoader.value) {
            mapLoader.value.style.display = "none"
        }

    }

    //todo save marker in database
}

const backToList = () => {
    menu.value = 'dispatchLocationList'
    currentLocationId.value = null
    mapInstance.value?.setZoom(0)
    detailsType.value = 'create'
}

const showAddLocation = () => {
    menu.value = 'locationDetails'
    detailsType.value = 'create'
    currentLocationId.value = null
    mapInstance.value?.setZoom(0)
}

onMounted(() => {
    loadMap()
})

const show = ref(true)

const rules = computed(() => {
    return {
        required: (value: string) => !!value || 'Field is required',
    }
})

const loadMap = async () => {
    mapLoader.value = document.getElementById('loader');

    mapInstance.value = await googleMaps.init()

    mapInstance.value.renderMap({
        customButtons: [{ id: 'etaDisplay', position: 'RIGHT_TOP' }, { id: 'detailsDisplay', position: 'LEFT_TOP' }],
        mapContainerID: 'map',
        zoomControlsContainerID: 'zoomControls',
        index: '',
    })

    //hide map loader once map is rendered
    if (mapLoader.value) {
        mapLoader.value.style.display = "none"
    }
}

const getLatLngFromAddress = async (address: string): Promise<{ data?: google.maps.LatLng, error?: Error }> => {
    const geocoder = new google.maps.Geocoder();

    try {
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results as google.maps.GeocoderResult[]);
                } else {
                    reject(new Error('Geocode request failed. Status: ' + status));
                }
            });
        });

        // const location = results[0].geometry.location;
        // const latitude = location.lat();
        // const longitude = location.lng();

        return { data: results[0].geometry.location };
    } catch (e: Error) {
        return { error: e };
    }
}

const drawGeofenceCircle = (radius: number, marker: google.maps.Marker) => {

    // Remove the old plot (circle) if it exists
    if (geofenceCircle.value) {
        geofenceCircle.value.setMap(mapInstance.value?.map) //just to enforce
        geofenceCircle.value.setMap(null);
    }

    // Create a circle around the marker
    geofenceCircle.value = new google.maps.Circle({
        map: mapInstance.value?.map,
        center: marker.getPosition(),
        radius: radius,
        strokeColor: '#00bfff', // Light blue stroke color
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00bfff', // Light blue fill color
        fillOpacity: 0.35
    });
}

const displayMarker = (markerPosition: google.maps.LatLng, radius: number) => {
    // Create a marker
    currentMarker.value = new google.maps.Marker({
        position: markerPosition,
        map: mapInstance.value?.map,
        title: selectedLocation.value.Name
    });

    // currentMarker.value?.setMap(null)

    //draw geofence polygon
    
    drawGeofenceCircle(radius, currentMarker.value)

    // zoom into marker
    mapInstance.value?.setZoom(18)

    //centralize marker on screen
    mapInstance.value?.panTo(markerPosition as any)

}

const save = async () => {
    if (dispatchLocationForm.value) {
        const formStatus = await dispatchLocationForm.value.validate()
        if (!formStatus.valid) {
            return
        }

        switch (detailsType.value) {
            case 'create':
               const {error , data}  = await dispatchLocationStore.createDispatchLocation(currentLocation.value)
               if(!error && data){
                    const newLocation: DispatchLocationInfo = data as DispatchLocationInfo;
                    currentLocationId.value = newLocation.id
               }
               break;
            case 'update':
                dispatchLocationStore.updateDispatchLocation(currentLocation.value)
                break;
        }
    }
}

watch(() => currentLocation.value.GeofenceRadius, (newVal, oldVal) => {
    if (oldVal != undefined && newVal && newVal > 0) {
        if (currentMarker.value && mapInstance.value) {
            nextTick(() => {
                // drawGeofenceCircle(newVal,currentMarker.value, mapInstance.value)
                drawGeofenceCircle(parseInt(newVal.toString()), currentMarker.value as google.maps.Marker)
            })
        }
    }
})

watch(() => menu.value, (val) => {
    if (val == 'dispatchLocationList') {
        nextTick(()=>{
            //remove current marker from map
            if (currentMarker.value) {
                currentMarker.value.setMap(null)
            }

            //remove geofence polygon
            if (geofenceCircle.value) {
                geofenceCircle.value.setMap(null);
            }
        })
    }
})

</script>
<template>
    <div class="d-flex page-fill-height ma-n4">

        <div class="fill-height expand-collapse" :class="[show ? 'to-collapse' : 'to-expand']">
            <div class="pa-4 pb-0">
                <div class="d-flex justify-space-between">
                    <span class="text-primary text-h5">Stop Locations {{ currentView }}</span>
                    <v-btn v-if="menu == 'dispatchLocationList'" density="comfortable" color="primary" class="mr-6"
                        @click="showAddLocation"><v-icon>mdi-plus</v-icon>Add</v-btn>
                </div>
                <v-row class="my-2">
                    <v-col v-if="menu == 'dispatchLocationList'">
                        <v-text-field clearable rounded hide-details v-model="search" placeholder="Search Location" variant="solo"
                            density="comfortable" prepend-inner-icon="mdi-map-search"></v-text-field>
                    </v-col>
                    <v-col v-if="menu == 'locationDetails'">
                        <div class="d-flex justify-space-between">
                            <v-btn class="text-none" density="comfortable" color="primary" @click="backToList"><v-icon
                                    class="mr-1">mdi-chevron-left</v-icon>Back</v-btn>
                            <v-btn class="text-none" density="comfortable" color="green" @click="save">{{ detailsType ==
                                'create' ? 'Save' : 'Update' }}</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>

            <div class="list-items" v-if="menu == 'dispatchLocationList'">
                <v-list density="compact">
                    <v-list-item v-for="(location, i) in filteredLocationList" :key="i"
                        @click="previewDetails(location)">
                        <v-list-item-title>{{ location.Name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ location.City }},{{ location.State }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </div>

            <div class="list-item-details pa-4 pb-0" v-if="menu == 'locationDetails'">
                <v-form ref="dispatchLocationForm" class="">
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <v-text-field label="Name" v-model="currentLocation.Name" variant="solo" flat
                                density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-text-field label="Location Code" v-model="currentLocation.LocationCode" variant="solo"
                                flat density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="City" v-model="currentLocation.City" variant="solo" flat
                                density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="State" v-model="currentLocation.State" variant="solo" flat
                                density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Country Code" v-model="currentLocation.CountryCode" variant="solo" flat
                                density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Postal Code" v-model="currentLocation.PostalCode" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-text-field label="Address Line" v-model="currentLocation.AddressLine" variant="solo" flat
                                density="compact" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-text-field label="Address Line 2" v-model="currentLocation.AddressLine_2" variant="solo"
                                flat density="compact"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Contact " v-model="currentLocation.contact" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Phone" v-model="currentLocation.phone" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Longitude" v-model="currentLocation.longitude" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                            <v-text-field label="Latitude" v-model="currentLocation.latitude" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-text-field label="Geofence Radius (Meters)" type="number" min="1"
                                v-model="currentLocation.GeofenceRadius" variant="solo" flat
                                density="compact"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
        </div>

        <div class="flex-grow-1 fill-height">
            <div id="mapContainer">
                <!-- left pannel toggle button -->
                <v-btn id="button-toggle" style="position:absolute;top:10px;z-index:2;"
                    :style="{ left: show ? '-25px' : '10px' }" @click="show = !show"
                    :icon="show ? 'mdi-chevron-left' : 'mdi-chevron-right'" color="primary"></v-btn>

                <!-- map loading overlay -->
                <v-overlay style="z-index:1;" id="loader" :model-value="true" contained
                    class="align-center justify-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                </v-overlay>

                <!-- map container -->
                <div id="map" style="position:absolute;top:0;left:0;"></div>

                <!-- zoom controls -->
                <div id="zoomControls" style="display:none !important;" class="d-flex flex-column mr-4 mb-4">
                    <v-btn density="compact" id="center">
                        <v-icon>mdi-crosshairs</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomIn" class="my-3">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomOut">
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.page-fill-height {
    height: calc(100vh - 48px)
}

#mapContainer {
    height: calc(100vh - 48px) !important;
    position: relative;
    overflow-y: visible !important;
    --v-scrollbar-offset: 0 !important;
}

#map {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}



.expand-collapse {
    overflow: hidden;
    /* white-space: nowrap; */
    transition: width 0.3s ease-in-out;
}

.expand-collapse.to-expand {
    width: 0 !important;
}

.expand-collapse.to-collapse {
    width: 500px !important;
    /* min-width: 400px; */
}


@keyframes to-expand {
    0% {
        width: 0;
    }

    100% {
        min-width: 500px;
    }
}

@keyframes to-collapse {
    0% {
        width: 500px;
    }

    100% {
        width: 0 !important;
    }
}


#button-toggle {
    position: absolute;
    transition: left 0.3s ease-in-out;
}

.list-items {
    height: calc(100vh - (46px + 138px)) !important;
    overflow-y: auto;
}

.list-item-details {
    height: calc(100vh - (46px + 120px)) !important;
    overflow-y: auto;
}
</style>
