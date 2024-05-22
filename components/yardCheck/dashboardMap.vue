<script setup lang="ts">
import { ref, computed } from 'vue';
import googleMaps from '@/composables/googleMaps'
import { useRouter } from 'vue-router';

const router = useRouter();

const yardStore = useYardStore()
const { yardMapData, loadingYardMapData } = storeToRefs(yardStore)

const yardOccupancyStore = useYardOccupancyStore()
const { yardOccupancyList, loading: loadingYard } = storeToRefs(yardOccupancyStore)

onMounted(() => {
    loadMap()
    yardOccupancyStore.fetchYardOccupancyList();
    yardStore.fetchYardMapData()
});

const openYardDetail = (yardId: number) => {
    router.push(`/yard_check/yardDetail/${yardId}`);
}

const search = ref<string>('');
const show = ref<boolean>(true)

const menu = ref('yardList') // options ['yardList','yardDetails']

const currentMapId = ref<number | null>(null);
const currentYardId = ref<number | null>(null)

const mapInstance = ref<googleMaps | undefined>();
const mapPolygons = ref<{ id: number, polygon: google.maps.Polygon }[]>([])

const mapLoader = ref<HTMLElement | null>()

const loadMap = async () => {
    mapLoader.value = document.getElementById('loader');
    mapInstance.value = await googleMaps.init()
    mapInstance.value.renderMap({
        customButtons: [{ id: 'etaDisplay', position: 'RIGHT_TOP' }, { id: 'detailsDisplay', position: 'LEFT_TOP' }],
        mapContainerID: 'map',
        zoomControlsContainerID: 'zoomControls',
        index: '',
    })
    mapInstance.value.setZoom(8)
}

// Extract the coordinates from the geometry object
const getGeometryCoordinates = (geometry: any) => {
    return geometry.coordinates[0].map(function (coordinate: any) {
        return { lat: coordinate[1], lng: coordinate[0] };
    });
}

watch(yardMapData, (newVal) => {
    if (newVal) {
        displayYards()
    }
})

const displayYards = () => {
    const polygons: google.maps.Polygon[] = [];
    const markers: google.maps.Marker[] = [];

    yardMapData.value.forEach((yardDetail) => {
        let polygon = new google.maps.Polygon({
            paths: getGeometryCoordinates(yardDetail.geometry),
            clickable: true,
            draggable: false,
            editable: false,
            map: mapInstance.value?.map,
            strokeColor: '#00bfff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00bfff',
            fillOpacity: 0.35 // Increase fill opacity for better visibility
        });

        polygons.push(polygon);

        let marker = new google.maps.Marker({
            position: getCenterCoordinate(yardDetail.geometry),
            map: mapInstance.value?.map,
            label: 'Y' // Visual indicator for a yard
        });

        markers.push(marker);

        var infoWindow = new google.maps.InfoWindow();

        function createMouseoverCallback(yard: any) {
            return function () {
                var content = `<h3>Yard Details</h3>` +
                    `<p><b>Yard Name: </b>${yard.name}</p>` +
                    `<p><b>Location: </b>${yard.location}</p>` +
                    `<p><b>Total Vehicles: </b>${yard.vehicleCount}</p>`;

                infoWindow.setContent(content);
                infoWindow.open(mapInstance.value?.map, marker);
            }
        }

        function createMouseoutCallback() {
            return function () {
                infoWindow.close();
            }
        }

        google.maps.event.addListener(marker, 'mouseover', createMouseoverCallback(yardDetail));
        google.maps.event.addListener(marker, 'mouseout', createMouseoutCallback());
    });

    zoomToPolygons(polygons);

    if (mapLoader.value) {
        mapLoader.value.style.display = "none";
    }
}

const zoomToPolygons = (polygons: google.maps.Polygon[]) => {
    var bounds = new google.maps.LatLngBounds();

    polygons.forEach((polygon: google.maps.Polygon) => {
        polygon.getPath().forEach(function (latLng: google.maps.LatLng) {
            bounds.extend(latLng);
        });
    });

    mapInstance.value?.map?.fitBounds(bounds);
}

const getCenterCoordinate = (geometry: any) => {
    const bounds = new google.maps.LatLngBounds();

    // Parcours des coordonnées du polygone pour étendre les limites
    geometry.coordinates[0].forEach((coordinate: [number, number]) => {
        const latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
        bounds.extend(latLng);
    });

    // Calcul des coordonnées centrales à partir des limites
    const centerLatLng = bounds.getCenter();

    return centerLatLng;
}

const currentYard = computed(() => {
    return yardOccupancyList.value.filter(yard => yard.yardId == currentYardId.value)
})


const filteredYardList = computed(() => {
    // Filter yards based on the search input
    if (search.value.length) {
        return yardOccupancyList.value.filter((yard) => {
            return yard.name?.toLowerCase().includes(search.value.toLowerCase());
        });
    }
    return yardOccupancyList.value

});

// const backToList = () => {
//     menu.value = 'yardList'
//     currentMapId.value = null
//     mapInstance.value?.setZoom(8)
// }

</script>
<template>
    <div class="d-flex page-fill-height v-card v-theme--light v-card--density-default elevation-10 v-card--variant-elevated">

        <div class="fill-height expand-collapse" :class="[show ? 'to-collapse' : 'to-expand']">
            <div class="pa-4 pb-0">
                <v-row class="my-2">
                    <v-col>
                        <v-text-field clearable rounded hide-details :loading="loadingYard" v-model="search"
                            placeholder="Search for yard by name" variant="solo" density="comfortable"
                            prepend-inner-icon="mdi-map-search"></v-text-field>
                    </v-col>
                </v-row>
            </div>

            <div class="list-items">
                <div  v-for="(yard, index) in filteredYardList" :key="index">
                    <v-card append-icon="mdi-truck" class="ma-4"   @click="openYardDetail(yard.yardId as number)"
                         :subtitle="`Total Vehicles: ${yard.totalOccupancy ? yard.totalOccupancy : ''}`" 
                        :title="yard.name ? yard.name : ''">
                        <template v-slot:prepend>
                        <v-icon color="primary" size="30" icon="mdi-warehouse"></v-icon>
                        </template>
                        <v-card-text>
                        <div class="d-flex">
                            <span>Trailers: {{ yard.trailers }}</span>
                            <div class="ml-auto">Trucks: {{ yard.trucks }} </div>
                        </div>
                        </v-card-text>
                    </v-card>
                </div> 
                
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
    height: calc(100vh - 48px - 16px - 16px);
    /* margin-top: 16px; */
}

#mapContainer {
    height: calc(100vh - 48px - 16px - 16px) !important;
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
    background-color: white;
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

.card {
    cursor: pointer;
    transition: transform .2s;
}

.card:hover {
    transform: scale(1.05);
}


</style>
