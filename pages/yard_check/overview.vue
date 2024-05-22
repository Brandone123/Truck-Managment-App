<template>
  <div class="d-flex justify-space-between">
    <span class="text-primary text-h5">Dashboard</span>
    <div>
      <YardCheckYardReport />
    </div>
  </div>

  <v-row class="pt-2">
    <v-col cols="12" md="4">
      <v-card class="card-1 text-center">
        <v-card-text>
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#CE0053">mdi-clock-time-eight-outline</v-icon>
            <span>Avg. Dwell Time</span>
          </v-card-title>

          <v-card-text>
            <v-progress-circular v-if="loadingStat" indeterminate color="primary"></v-progress-circular>
            <span v-else>
              <span class="font-weight-bold text-h6 mr-1">{{ averageDwellTime.split(':')[0] }}</span><span
                class="text-subtitle grey--text">hrs</span>
              <span class="font-weight-bold text-h6 mr-1 ml-2">{{ averageDwellTime.split(':')[1] }}</span><span
                class="text-subtitle grey--text">mins</span>
            </span>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="card-2 text-center">
        <v-card-text>
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#1867C0">mdi-warehouse</v-icon>
            <span>Most Populated Yard</span>
          </v-card-title>
          
          <v-card-text>
            <v-progress-circular v-if="loadingStat" indeterminate color="primary"></v-progress-circular>
            <span v-else class="font-weight-bold text-h6"> {{ capitalizeSentence(mostPopulatedYard) }}</span>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="card-3 text-center">
        <v-card-text>
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#424656">mdi-truck</v-icon>
            <span>Total Vehicles</span>
          </v-card-title>
          
          <v-card-text>
            <v-progress-circular v-if="loadingStat" indeterminate color="primary"></v-progress-circular>
            <span v-else class="font-weight-bold text-h6"> {{ totalVehicles }}</span>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="5">
      <div>
        <v-card-title class="text-h5 font-weight-bold text-primary px-0">Alerts and Notifications</v-card-title>
      </div>
      <v-card>
        <div style="height: 400px; overflow-y:auto;" class="pa-2">
          <div v-if="loadingYard" class="d-flex flex-column fill-height justify-center align-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <div v-if="yardOccupancyList.length == 0">
              <span>No Alerts</span>
            </div>
            <div v-else v-for="yardOccupancy in yardOccupancyList">
              <div v-for="alert in yardOccupancy.alerts" class="mb-3">
                <div class="d-flex">
                  <v-col cols="12" md="1"><CircleIcon size="15" class="text-primary mt-3" /></v-col>
                  <v-col cols="12" md="8">
                    <span>
                      {{ alert }}
                    </span>
                  </v-col>
                  <v-col  cols="12" md="3">
                    <div class="mr-auto"><v-chip color="red" variant="outlined" @click="dismissAlert(yardOccupancy, alert)">Dismiss</v-chip>
                    </div>
                  </v-col>
                </div>
                <v-divider></v-divider>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="7">
      <div>
        <v-card-title class="text-h5 font-weight-bold text-primary px-0">Yard Status Overview</v-card-title>
      </div>
      <v-card>
        <div style="height: 400px;">
          <v-card-item class="pa-1">
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-bold">Id</th>
                    <th class="text-subtitle-1 font-weight-bold">Yard Name</th>
                    <th class="text-subtitle-1 font-weight-bold">Location  <v-progress-circular v-if="loadingYardMapData" indeterminate color="primary"></v-progress-circular></th>
                    <th class="text-subtitle-1 font-weight-bold text-right">Capacity</th>
                    <th class="text-subtitle-1 font-weight-bold">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in yardList.slice(0,6)" class="month-item">
                    <td>
                        <p class="text-15 font-weight-medium">{{ item.id }}</p>
                    </td>
                    <td>
                      <h6 class="text-body-1 text-muted">{{ item.name }}</h6>
                    </td>
                    <td>
                        <h6 class="text-body-1 text-muted">{{ item.location }}</h6>
                    </td>
                    <td>
                        <h6 class="text-h6 text-right">{{ item.capacity }}</h6>
                    </td>
                    <td>
                      <v-chip :color="getStatusClass(item)"  size="small" >
                        {{ getStatusText(item) }}
                      </v-chip>
                    </td>
                </tr>
            </tbody>
        </v-table>
        </v-card-item>
        
        </div>
      </v-card>
    </v-col>

    <v-col cols="12">
      <OccupancyGraph />
    </v-col>

    <v-col cols="12">
      <div class="mb-3">
        <v-card-title class="text-h5 font-weight-bold text-primary px-0">Real-Time Yard Map</v-card-title>
      </div>
      <YardCheckDashboardMap />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import OccupancyGraph from '@/components/yardCheck/occupancyGraph.vue'


onMounted(() => {
  yardStore.fetchYardList();
  yardOccupancyStore.fetchYardOccupancyList();
  yardOccupancyStore.fetchQuickStats();
});

const yardStore = useYardStore()
const { yardMapData, yardList, loadingYardMapData } = storeToRefs(yardStore)

const yardOccupancyStore = useYardOccupancyStore()
const { yardOccupancyList, totalVehicles, averageDwellTime, mostPopulatedYard, loading: loadingYard,
  loadingStat: loadingStat, stationaryVehicle, loadingStationary } = storeToRefs(yardOccupancyStore)

const getStatusClass = (yard: any) => {
  const yardId = yard.id;
  const yardData = yardMapData.value.find((data) => data.yardId === yardId);
  if (yardData) {
      const vehicleCount = yardData.vehicleCount;
      const capacity = yard.capacity;
      if (vehicleCount === capacity) {
          return 'alert'; 
      } else if (vehicleCount < capacity) {
          return 'primary'; 
      } else if (vehicleCount > capacity){
          return 'error';
      } else if (!vehicleCount){
        return 'alert';
      }
  }
  return '';
}

const getStatusText = (yard: any) => {
    const yardId = yard.id;
    const yardData = yardMapData.value.find((data) => data.yardId === yardId);
    if (yardData) {
        const vehicleCount = yardData.vehicleCount;
        const capacity = yard.capacity;
        if (vehicleCount === capacity) {
            return 'Full';
        } else if (vehicleCount < capacity) {
            return 'Available';
        } else if (vehicleCount > capacity){
            return 'Overflow';
        }else if (!vehicleCount){
          return 'NaN';
        }
    }
    return '';
}

function capitalizeSentence(sentence: string) {
  return sentence.replace(/\b\w/g, (match: string) => match.toUpperCase());
}

const dismissAlert = (yardOccupancy: any, alert: any) => {
  const index = yardOccupancy.alerts.indexOf(alert);
  if (index !== -1) {
    yardOccupancy.alerts.splice(index, 1);
  }
}

</script>
<style scoped>

.alert-custom {
  background-color: #fff5f5;
  border-left: 6px solid #f44336;
  padding: 2px;
  font-size: 13px;
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
</style>~/composables/googleMapsV0
