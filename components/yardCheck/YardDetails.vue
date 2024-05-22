<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="border-sm pa-2 rounded">
          <span class="text-primary" @click="openDashboard" style="cursor: pointer;">Dashbord </span> /
          <span class="text-primary" @click="openYards" style="cursor: pointer;"> Yard List</span> /
          <span class=""> Yard Details</span>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card class="card-1 px-2 py-2 text-center card">
          <div>
            <span>
              <v-icon class="mr-2" color="#CE0053">mdi-clock-time-eight-outline</v-icon>
              Average Dwell Time
            </span>
            <div class="pt-5 pb-6">
              <span style="font-weight: bold;">
                <span v-if="loadingDwellTime">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span v-else> {{ averageValue }} hours</span>
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="card-2 px-2 py-2 text-center card">
          <span>
            <v-icon class="mr-2" color="#1867C0">mdi-timer-outline</v-icon>
            Minimum Dwell Time
          </span>
          <div class="pt-5 pb-6">
            <span style="font-weight: bold;">
              <span v-if="loadingDwellTime">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </span>
              <span v-else> {{ minValue }} hours</span>
            </span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="card-3 px-2 py-2 text-center card">
          <span>
            <v-icon class="mr-2" color="#424656">mdi-timer-off-outline</v-icon>
            Maximum Dwell Time
          </span>
          <div class="pt-5 pb-6">
            <span style="font-weight: bold;">
              <span v-if="loadingDwellTime">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </span>
              <span v-else> {{ maxValue }} hours</span>
            </span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="card-4 px-2 py-2 text-center card">
          <span>
            <v-icon class="mr-2" color="#6C52CD">mdi-truck</v-icon>
            Vehicles in Yard
          </span>
          <div class="pt-5 pb-6">
            <span style="font-weight: bold;">
              <span v-if="loadingYardDetail">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </span>
              <span v-else> {{ yardDetailVehicle.length }}</span>
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <div>
          <v-card-title class="text-h5 px-0 font-weight-bold text-primary">Stationary Vehicle Alerts</v-card-title>
        </div>
        <v-card height="475">
          <div class="d-sm-flex align-center justify-space-between pt-sm-2">
            <div class="my-sm-0 my-2">
              <div class="d-flex text-center">
                <v-progress-circular v-if="loadingStationary" indeterminate color="primary"
                  class="mr-2"></v-progress-circular>
              </div>
            </div>
          </div>
          <v-card-text>
            <div class="overflow-auto" style="max-height: 390px;">
              <div class="mt-2" v-for="stationary in stationaryVehicle">
                <div class="d-flex align-center mb-2">
                  <v-icon color="red" class="mr-2">mdi-car</v-icon>
                  <strong class="text-red">Vehicle ID: </strong> {{ stationary.vehicle_id }}
                </div>
                <div class="border border-muted mr-5 px-2 py-2 rounded-bottom">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="grey lighten-1">mdi-clock-outline</v-icon>
                    <span class="ml-1">Has been stationary for {{ stationary.stationary_time }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon small color="grey lighten-1">mdi-map-marker-outline</v-icon>
                    <span class="ml-1">Last known location: </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="stationaryVehicle.length <= 0">
              <h4 class="align-center">No vehicle parked </h4>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h5 px-0 font-weight-bold text-primary">Vehicles In Yard</v-card-title>
        </div>
        <v-card>
          <v-data-table return-object :loading="loadingYardDetail" items-per-page="7" :headers="yardVehicleHeaders"
            :items="yardDetailVehicle">
            <template v-slot:item.vehicle_details="{ item }">
              <span>{{ item.vehicle_details ? item.vehicle_details : "N/A" }}</span>
            </template>
          </v-data-table>
        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12">
        <YardDetailChart :yardID="yardId" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12">
        <div class="d-flex page-fill-height v-card v-theme--light v-card--density-default v-card--variant-elevated">
          <div class="fill-height expand-collapse" :class="[show ? 'to-collapse' : 'to-expand']">

            <div class="list-items pa-4">
              <h3>Recent Activity Log</h3>
              <div>
                <label for="filterType">Filter by Type:</label>
                <div>
                  <div style="width: 200px;">
                    <v-select class="form-control" density="compact" variant="outlined" v-model="selectedActivity"
                      id="filterType" :items="['all', 'entered', 'exited']"></v-select>
                  </div>
                  <div class="border-sm pa-2 rounded" style="border: 2px solid red; width: 350px;"
                    v-if="filteredActivities.length > 0">
                    <div v-for="activity in filteredActivities">
                      <span style="color:#00B5D1;">Vehicle ID {{ activity.vehicle_id }} on {{ activity.time }}</span>
                      <span v-if="loadingActivities">
                        <v-progress-circular size="17" indeterminate color="primary"></v-progress-circular>
                      </span>
                    </div>
                  </div>
                  <div v-else class="border-sm pa-2 rounded" style="border: 2px solid red;">
                    <span style="color:#00B5D1;">No Log Activities </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-grow-1 fill-height">
            <div class="d-flex">
              <h3 class="card-title" id="yardLocation"><strong style="color:#1867C9">Location:</strong> {{
                locationYard }}
                <span v-if="loadingYardDetail">
                  <v-progress-circular size="17" indeterminate color="primary"></v-progress-circular>
                </span>
              </h3>
              <h3 class="card-text ml-5" id="yardCapacity"><strong style="color:#1867C9">Capacity:</strong> {{
                capacityYard }}
                <span v-if="loadingYardDetail">
                  <v-progress-circular size="17" indeterminate color="primary"></v-progress-circular>
                </span>
              </h3>
            </div>

            <div id="mapContainer">
              <!-- left pannel toggle button -->
              <v-btn id="button-toggle" style="position: absolute!important; top: 10px; z-index: 1;"
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
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { YardDetailInfo } from '~/types/yard/yard';
import type { VehicleInYardInfo } from '~/types/yard/yard';
import YardDetailChart from '@/components/yardCheck/YardDetailChart.vue';
import type { YardOccupancyInfo } from '~/types/yard/yard_occupancy';
import googleMaps from '@/composables/googleMaps'
import { useRouter } from 'vue-router';

const router = useRouter();
const show = ref<boolean>(true)

const openDashboard = () => {
  router.push("/yard_check/overview")
}

const openYards = () => {
  router.push("/yard_check/yards")
}

const yardId = Number(router.currentRoute.value.params.id);

onMounted(() => {
  loadMap()
  yardStore.fetchYardMapData()
  YardDetailStore.getYardDetailById(yardId)
  YardDetailStore.getYardDwellTimeReport(yardId)
  YardDetailStore.getActivitiesYardById(yardId)
  yardOccupancyStore.getStationaryVehicles(yardId)
})

const YardDetailStore = useYardStore()
const {yardDetailVehicle, loadingActivities, locationYard, capacityYard, activities, average, min, max, loadingYardDetail, loadingDwellTime} = storeToRefs(YardDetailStore) 

const yardOccupancyStore = useYardOccupancyStore()
const { stationaryVehicle, yardOccupancyList, loadingStationary } = storeToRefs(yardOccupancyStore)

const yardStore = useYardStore()
const { yardMapData, loadingYardMapData } = storeToRefs(yardStore)


const vehicleMarkers = ref<Record<string, any>>({})

const averageValue = computed(() => {
  return average.value
})

const minValue = computed(() => {
  return min.value
})

const maxValue = computed(() => {
  return max.value
})

const selectedActivity = ref('all')

const filteredActivities = computed(() => {
  if (selectedActivity.value === 'all') {
    return activities.value;
  } else {
    return activities.value.filter((activity) => activity.action === selectedActivity.value);
  }
})

const yardVehicleHeaders = ref([
  { title: ' Vehicle ID', key: 'vehicle_id', class: "no-wrap" },
  { title: 'Asset Type', key: 'asset_type', class: "no-wrap" },
  { title: 'Entry Time', key: 'entry_time', class: "no-wrap font-weight-bold" },
  // { title: 'Exit Time', key: 'vehicle_details',class:"no-wrap"  },			
])

const defaultOccupancy = ref<YardOccupancyInfo>({
  id: null,
  yardId: null,
  name: null,
  totalOccupancy: null,
  trucks: null,
  trailers: null,
  alerts: null,
})

const yardInfo = ref(defaultOccupancy.value);

const mapInstance = ref<googleMaps | undefined>();
const mapPolygons = ref<{ id: number, polygon: google.maps.Polygon }[]>([])

const mapLoader = ref<HTMLElement | null>()

const loadMap = async () => {
  mapLoader.value = document.getElementById('loader');
  mapInstance.value = await googleMaps.init()
  mapInstance.value.renderMap({
    customButtons: [],
    mapContainerID: 'map',
    zoomControlsContainerID: 'zoomControls',
    index: '',
  })

  mapInstance.value.setZoom(10)
}

// Extract the coordinates from the geometry object
const getGeometryCoordinates = (geometry: any) => {
  return geometry.coordinates[0].map(function (coordinate: any) {
    return { lat: coordinate[1], lng: coordinate[0] };
  });
}

watch(yardMapData, (newVal) => {
  if (newVal) {
    if (router.currentRoute.value.params.id) {
      displayYard(parseInt(router.currentRoute.value.params.id as string))
    }
  }
})

watch(yardDetailVehicle, (newVal) => {
  if (newVal) {
    console.log('yard occupancy changed in watcher. loading markers')
    displayYardAssets()
  }
})

const displayYard = (yardId: number) => {
  // Create a marker
  let yard = yardMapData.value.find(item => item.yardId == yardId)

  // plot yard data
  if (yard) {
    let polygon = new google.maps.Polygon({
      paths: getGeometryCoordinates(yard.geometry),
      clickable: true,
      draggable: false,
      editable: false,
      map: mapInstance.value?.map,
      strokeColor: '#00bfff', // Light blue stroke color
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00bfff', // Light blue fill color
      fillOpacity: 0.05
    })

    mapPolygons.value.push({
      id: yardId,
      polygon
    })

    zoomToPolygon(polygon);

    // // Create an info window
    // var infoWindow = new google.maps.InfoWindow();

    // // Add a click event listener to the polygon
    // google.maps.event.addListener(polygon, 'mouseover', function (event: any) {
    //   // Set the content for the info window
    //   var content = `<h3>Yard Details</h3>` +
    //     `<p><b>Yard Name: </b>${yard?.name}</p>` +
    //     `<p><b>Location: </b>${yard?.location}</p>` +
    //     `<p><b>Total Vehicles: </b>${yard?.vehicleCount}</p>`


    //   // Set the position and content of the info window, and open it on the map
    //   infoWindow.setPosition(event.latLng);
    //   infoWindow.setContent(content);
    //   infoWindow.open(mapInstance.value?.map);
    // });

    // // Add a mouseout event listener to the polygon
    // google.maps.event.addListener(polygon, 'mouseout', function () {
    //   infoWindow.close();
    // });
  }
}

const displayYardAssets = () => {
  yardDetailVehicle.value.forEach((vehicle) => {
    setAssetPosition(vehicle)
  })

  //    hide map loader once map is rendered
  if (mapLoader.value) {
    mapLoader.value.style.display = "none"
  }
}

const setAssetPosition = (vehicleData: VehicleInYardInfo) => {
  if (mapInstance.value && vehicleData?.vehicle_details && vehicleData.vehicle_details.telematics) {

    const truckMarkerSVG = `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506.999 511.89">
                                    <path fill="#5d5cde" d="M505.023 485.928L263.083 6.415c-4.051-8.553-15.091-8.553-19.144 0L2.005 485.931c-7.858 15.66 8.874 31.685 24.438 23.909l227.066-120.826L480.576 509.84c15.687 7.867 32.2-8.374 24.447-23.912z"/>
                                </svg>`

    const trailerMarkerSVG = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="#1984c5" />
                              </svg>`
    const TruckIcon = {
      url: mapInstance.value.SvgToBase64Image(truckMarkerSVG),
      scaledSize: new google.maps.Size(30, 20)
    }

    const TrailerIcon = {
      url: mapInstance.value.SvgToBase64Image(trailerMarkerSVG),
      scaledSize: new google.maps.Size(20, 20)
    }

    let gpsData = vehicleData.vehicle_details.telematics.diagnostics?.gps
    vehicleMarkers.value[vehicleData?.vehicle_id as string] = new google.maps.Marker({
      position: { lat: gpsData.latitude, lng: gpsData.longitude },
      map: mapInstance.value?.map,
      icon: vehicleData.asset_type == 'Truck' ? TruckIcon : TrailerIcon,
    });

    var content = `<h3>Asset Details</h3>` +
      `<p><b>Asset Type: </b>${vehicleData.asset_type}</p>` +
      `<p><b>ID: </b>${vehicleData?.vehicle_id}</p>` +
      `<p><b>Entry Time: </b>${vehicleData?.entry_time}</p>`

    const infowindow = new google.maps.InfoWindow({ content: content });

    (vehicleMarkers.value[vehicleData?.vehicle_id as string] as google.maps.Marker).addListener('mouseover', () => infowindow.open(mapInstance.value?.map, vehicleMarkers.value[vehicleData?.vehicle_id as string]));
    (vehicleMarkers.value[vehicleData?.vehicle_id as string] as google.maps.Marker).addListener('mouseout', () => infowindow.close());
  }
}


const zoomToPolygon = (polygon: google.maps.Polygon) => {
  // Calculate the bounds of the polygon
  var bounds = new google.maps.LatLngBounds();
  polygon.getPath().forEach(function (latLng) {
    bounds.extend(latLng);
  });

  // Adjust the map's zoom level and center to fit the polygon bounds
  mapInstance.value?.map?.panToBounds(bounds);
  mapInstance.value?.map?.fitBounds(bounds);
}

</script>

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

.flex-grow-1 {
  flex-basis: 80%;
}

.expand-collapse {
  flex-basis: 20%;
  overflow: hidden;
  transition: flex-basis 0.3s ease-in-out;
  /* Modifier uniquement la propriété flex-basis */
}

.expand-collapse.to-expand {
  flex-basis: 0 !important;
}

.expand-collapse.to-collapse {
  flex-basis: 500px !important;
}

@keyframes to-expand {
  0% {
    flex-basis: 0;
  }

  100% {
    flex-basis: 500px;
  }
}

@keyframes to-collapse {
  0% {
    flex-basis: 500px;
  }

  100% {
    flex-basis: 0 !important;
  }
}

#button-toggle {
  position: absolute !important;
  transition: left 0.3s ease-in-out;
}

.list-items {
  height: calc(100vh - (46px + 138px)) !important;
  overflow-y: auto;
}

.card {
  cursor: pointer;
  transition: transform .2s;
}

.card:hover {
  transform: scale(1.05);
}

.card-1 {
  border-left: 8px solid #CE0053;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #424656;
}

.card-4 {
  border-left: 8px solid #6C52CD;
}
</style>