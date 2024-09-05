<template>
    <v-col cols="12" sm="6"> 
  
        <div>
                <v-card>
                <div class="d-flex">
                    <span>
                        <v-card-title class="text-h7 font-weight-bold text-primary">Cost Of Ownership</v-card-title>
                    </span>
                    <span class="ml-auto pa-2">
                        <v-select v-model="selectedYear" variant="outlined" flat density="compact" :items="yearOptions" label="Select Year"></v-select>
                    </span>
                </div>
                <div>
                    <v-row class="pa-4">
                        <v-col cols="6">
                            <v-card class="pa-2">
                                <div>
                                    <span>Total Costs</span>
                                    <div class="font-weigth-bold text-h5">$1213</div>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="6">
                            <v-card class="pa-2">
                                <div>
                                    <span>Cost Per Meter</span>
                                    <div><span class="font-weigth-bold text-h5">0.00 </span> / mi</div>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                
                    <client-only>
                        <apexchart type="bar" height="250" :options="generalLedgerOptions" :series="generalLedgerOptions.series" />
                    </client-only>
                </div>
            
                
                <v-row>
                    <v-col v-for="(series, index) in generalLedgerOptions.series" :key="index" cols="4">
                        <div class="text-center">
                        <div>
                            <span :style="{ backgroundColor: series.color, borderRadius: '50%', display: 'inline-block', width: '12px', height: '12px', marginRight: '5px' }"></span>
                            {{ series.name }}
                        </div>
                        <div class="font-weight-bold text-center">${{ calculateTotal(series.data) }}</div>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </div>

        <v-card height="200" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Integrations</v-card-title></div>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>This vehicle has no Fuel Cards or Telematics Devices assigned</p>
            </div>
        </v-card>

        <v-card height="200" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Linked Assets</v-card-title></div>
                <div class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px">Link Asset</div>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>There are no linked Vehicles</p>
            </div>
        </v-card>

        <v-card height="400" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Last Known Location</v-card-title></div>
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
        </v-card>

        <v-card height="170" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Fuel Efficiency</v-card-title></div>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>Add Fuel Entries to this Vehicle to view fuel efficiency stats</p>
            </div>
        </v-card>
    </v-col>

    <v-col cols="12" sm="6">
        <v-card height="160">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Open Issues</v-card-title></div>
                <div class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"><v-icon>mdi-plus</v-icon>Add Issue <span class="ml-2"> View All</span></div>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p> There are no Open Issues for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="160" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Service Reminders</v-card-title></div>
                <span class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"><v-icon>mdi-plus</v-icon>Add Issue <span class="ml-2"> View All</span></span>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p> There are no Service Reminders due soon for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="170" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Renewal Reminders</v-card-title></div>
                <span class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"><v-icon>mdi-plus</v-icon>Add Renewal <span class="ml-2"> View All</span></span>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>There are no Renewal Reminders due soon for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="170" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Incomplete Work Orders</v-card-title></div>
                <span class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"><v-icon>mdi-plus</v-icon>Add Work Order <span class="ml-2"> View All</span></span>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>There are no Work Orders active for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="170" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Inspections</v-card-title></div>
                <span class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"> <span class="ml-2"> View All</span></span>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>There are no Inspections due soon for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="170" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Critical Faults</v-card-title></div>
                <span class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px"> <span class="ml-2"> View All</span></span>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
               <p>There are no Critical Faults for this Vehicle</p>
            </div>
        </v-card>

        <v-card height="200" class="mt-3">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Recalls</v-card-title></div>
            </div>

            <v-row class="pa-4">
                <v-col cols="6">
                    <v-card class="pa-2">
                        <div>
                            <span>Need Actions</span>
                            <div class="font-weigth-bold text-h5">3</div>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card class="pa-2">
                        <div>
                            <span>Open</span>
                            <div><span class="font-weigth-bold text-h5">0</span></div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-col>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import 'apexcharts/dist/apexcharts.css';
  import googleMaps from '@/composables/googleMaps'
  
  const generalLedgerOptions = computed(() => {
    const fuelCosts = [200, 220, 210, 200, 220, 230, 250, 240, 220, 220, 200, 210];
    const serviceCosts = [200, 210, 200, 220, 220, 230, 240, 250, 240, 230, 220, 220];
    const otherCosts = [200, 200, 210, 200, 220, 220, 230, 240, 230, 220, 220, 200];
  
    return {
      series: [
        {
          name: 'Fuel Costs',
          data: fuelCosts,
          color: '#1984c5',
        },
        {
          name: 'Service Costs',
          data: serviceCosts,
          color: '#22a7f0',
        },
        {
          name: 'Other Costs',
          data: otherCosts,
          color: '#63bff0',
        },
      ],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: true,
        },
        
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        title: {
          text: 'Costs',
        },
        min: 0,
        max: 300,
        tickAmount: 2,
        tickPositions: [0, 100, 200, 300],
      },
      dataLabels: {
        enabled: false,
      },
      legend: { show: false },
    };
  });
  
  const selectedYear = ref(new Date().getFullYear());
  const yearOptions = computed(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  });
  
  // Fonction pour calculer le total d'un tableau de données
  const calculateTotal = (data: any) => {
    return data.reduce((acc, val) => acc + val, 0);
  };

  const show = ref<boolean>(true)
const mapInstance = ref<googleMaps | undefined>();
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

    onMounted(() => {
        loadMap()
    });
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
</style>