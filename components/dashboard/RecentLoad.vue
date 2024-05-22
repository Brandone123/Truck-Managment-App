<script setup lang="ts">
import { ref } from 'vue';
import { CircleIcon } from 'vue-tabler-icons';
import { recentTransaction } from '@/data/dashboard/dashboardData';
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'

const sheduleLoadStore = useScheduleLoadStore()
const { scheduleLoadList, loading: loadingScheduleLoad } = storeToRefs(sheduleLoadStore)

const driverStore = useDriverStore()
const {driverList} = storeToRefs(driverStore)

const enRouteLoads = computed(() => {
   return scheduleLoadList.value.filter(load => load.Status == 'enroute')
})

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

</script>
<template>
     <div class="d-flex flex-wrap">
       <span class="v-card-title px-0 font-weight-bold text-primary">Recent Load En Route</span>
     </div>
    <v-card elevation="2" class="withbg">
        <v-card-item class="pb-0">
            <div class="recent-transaction mt-10 px-3">
                <div class="text-center" v-if="loadingScheduleLoad">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <div v-else v-for="list in loadList.slice(0,5)">
                    <v-row class="d-flex mb-4">
                        <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
                            <span class=" text-no-wrap">{{ new Date(list.pickup_date).toLocaleDateString() }}</span>
                        </v-col>
                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                            <CircleIcon size="15" :class="'text-primary'" />
                            <!-- <div class="line mx-auto bg-grey100"></div> -->
                        </v-col>
                        <v-col cols="7" sm="8" class="pt-0">
                            <p  class="text-body-1"><span class="font-weight-bold">PU Address:</span> {{ list.pickup_address }}</p>
                            <p  class="text-body-1"><span class="font-weight-bold">DEL Address:</span> {{ list.delivery_address }}</p>
                            <div class="mt-n1">
                                <RouterLink to="/" class="text-body-1 text-primary text-decoration-none" v-if="list.current_driver_id">{{
                                    getDriverName(list.current_driver_id)
                                }}</RouterLink>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>
<style lang="scss">
.recent-transaction {
    .line {
        width: 2px;
        height: 35px;
    }
}
</style>
