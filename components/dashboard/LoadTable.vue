<script setup lang="ts">
import {productPerformance} from '@/data/dashboard/dashboardData';
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'
import SheduleLoadList from '../dispatch/Shedule/SheduleLoadList.vue';

const sheduleLoadStore = useScheduleLoadStore()
const { scheduleLoadList, loading: loadingScheduleLoad } = storeToRefs(sheduleLoadStore)

const driverStore = useDriverStore()
const {driverList} = storeToRefs(driverStore)

const loadList = computed(() => {
    return scheduleLoadList.value.map((load: LoadInfo) => {
            const pickup = load.stops ? load.stops[0] : {} as StopInfo
            const delivery = load.stops ? load.stops[load.stops.length - 1] : {} as StopInfo
            return {
                ...load,
                pickup_date: `${pickup?.earliest_date} ${pickup?.earliest_time}`,
                pickup_city: pickup?.location?.City,
                pickup_state: pickup?.location?.State,
                pickup_address: pickup?.location?.AddressLine,
                delivery_date: `${delivery?.earliest_date} ${delivery?.earliest_time}`,
                delivery_city: delivery?.location?.City,
                delivery_state: delivery?.location?.State,
                delivery_address: delivery?.location?.AddressLine,
            }
        })
})

const getDriverName = (driver_id:any) => {
    const driverName = driverList.value.find((driver) => driver.id === driver_id)
    return driverName ? driverName.name : '' 
} 

const getStatusClass = (Status:any) => {
    switch (Status) {
      case 'Dispatched':
        return 'primary';
      case 'Booked':
        return 'error';
      case 'Reserved':
        return 'secondary';
      default:
        return '';
    }
  }

</script>
<template>
    <div class="d-flex flex-wrap">
       <span class="v-card-title px-0 font-weight-bold text-primary">Recent Load</span>
     </div>
    <v-card elevation="2" class="">
        <v-card-item class="pa-1">
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-bold">Id</th>
                    <th class="text-subtitle-1 font-weight-bold">Driver Name</th>
                    <th class="text-subtitle-1 font-weight-bold">Truck</th>
                    <th class="text-subtitle-1 font-weight-bold text-right">Trailer</th>
                    <th class="text-subtitle-1 font-weight-bold">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in loadList.slice(0,4)" class="month-item">
                    <td>
                        <p class="text-15 font-weight-medium">{{ item.id }}</p>
                    </td>
                    <td>
                        <div class="">
                                <h6 class="text-subtitle-1 font-weight-bold">{{ getDriverName(item.current_driver_id) }}</h6>
                                <div class="text-13 mt-1 text-muted">{{ item.reference_number }}</div>
                        </div>
                    </td>
                    <td>
                        <h6 class="text-body-1 text-muted">{{ item.current_truck_id }}</h6>
                    </td>
                    <td>
                        <h6 class="text-h6 text-right">{{ item.current_trailer_id }}</h6>
                    </td>
                    <td>
                        <v-chip :color="getStatusClass(item.Status)"  size="small" >{{
                            item.Status
                        }}</v-chip>
                    </td>
                </tr>
                <tr v-if="loadingScheduleLoad" class="month-item">
                    <td colspan="5" class="text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </td>
                </tr>
            </tbody>
        </v-table>
        </v-card-item>
    </v-card>
</template>
