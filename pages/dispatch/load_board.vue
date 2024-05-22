<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import type { LoadInfo } from '~/types/dispatch/load';

const loadStore = useLoadStore()
const { loadList, loading: loadingLoads } = storeToRefs(loadStore)


const sheduleLoadStore = useScheduleLoadStore()
const {scheduleLoadList, loading} =  storeToRefs(sheduleLoadStore)

const driverStore = useDriverStore()
const truckStore = useTruckStore()
const trailerStore = useTrailerStore()
const employeeStore = useEmployeeStore()
const carrierStore = useCarrierStore()

onMounted(() => {
   driverStore.fetchDriverList()
   truckStore.fetchTruckList()
   trailerStore.fetchTrailerList()

   employeeStore.fetchEmployeeList()
   carrierStore.fetchCarrierList()
   
   sheduleLoadStore.fetchAvailableLoadList()
})

var tab = ref<string>('all');

const allLoadsCount = computed(()=>{
   return scheduleLoadList.value?.length  || 0;
})

const bookedLoadsCount = computed(() => {
   return scheduleLoadList.value.filter((load: LoadInfo) => load.Status == 'Booked')?.length || 0
})

const reservedLoadsCount = computed(() => {
   return scheduleLoadList.value.filter((load: LoadInfo) => load.Status == 'Reserved')?.length || 0
})

const dispatchedLoadsCount = computed(() => {
   return scheduleLoadList.value.filter((load: LoadInfo) => load.Status == 'Dispatched')?.length || 0
})

const defaultLoad = ref<LoadInfo>({} as LoadInfo);
const editedLoad = ref(defaultLoad.value)
const loadDialog = ref(false)
const updatingLoad = ref(false)

const editLoad = (load: LoadInfo) => {
   editedLoad.value = load
   updatingLoad.value = true
   loadDialog.value = true
}

const updateLoadDialog = (value: boolean) => {
   loadDialog.value = value
   editedLoad.value = defaultLoad.value
   updatingLoad.value = false
}

</script>
<template>
   <div>
      <!-- <div class="d-flex justify-space-between">
         <span class="text-primary text-h5">Load Shedule</span>
         <div>

            <DispatchViewLoad :show="loadDialog" @update:show="updateLoadDialog" :updating="updatingLoad"
               :item="editedLoad" />
         </div>

      </div>
       -->

       <div class="d-flex justify-space-between">
         <span class="text-primary text-h5">Load Board</span>
         <div>
            <v-btn color="primary" class="mr-2 text-none" flat>
               <v-icon>mdi-upload</v-icon>
               Bulk Upload
            </v-btn>

            <v-menu open-on-hover>
               <template v-slot:activator="{ props }">
                  <v-btn color="primary" v-bind="props">
                     <v-icon>mdi-plus</v-icon>
                     Create New Load
                     <v-icon x-small>mdi-chevron-down</v-icon>
                  </v-btn>
               </template>

               <v-list>
                  <DispatchAddLoad />
                  <DispatchSelectTemplate />
               </v-list>
            </v-menu>
            <DispatchViewLoad :show="loadDialog" @update:show="updateLoadDialog" :updating="updatingLoad"
               :item="editedLoad" />
         </div>

      </div>
      <div class="sticky-page-top">
         <v-tabs v-model="tab" center-active color="primary">
            <v-tab value="all" density="compact" style="color:grey !important;">
               All
               <template v-slot:append>
                  <v-badge color="grey" :content="allLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="booked" density="compact" style="color: #78c679 !important;">
               Booked
               <template v-slot:append>
                  <v-badge :color="tab == 'booked' ? '#78c679' : 'grey'" :content="bookedLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="reserved" density="compact" style="color: #ffb74d !important;">
               Reserved
               <template v-slot:append>
                  <v-badge :color="tab == 'reserved' ? '#ffb74d ' : 'grey'" :content="reservedLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="dispatched" density="compact" style="color: #64b5f6 !important;">
               Dispatched
               <template v-slot:append>
                  <v-badge :color="tab == 'dispatched' ? '#64b5f6' : 'grey'" :content="dispatchedLoadsCount" inline></v-badge>
               </template>
            </v-tab>
         </v-tabs>
      </div>


      <v-window v-model="tab" style="overflow:visible;">
         <v-window-item value="all">
            <DispatchSheduleLoadList @editLoad="editLoad"/>
         </v-window-item>
         <v-window-item value="booked">
            <DispatchSheduleLoadList filter="Booked" @editLoad="editLoad"/>
         </v-window-item>
         <v-window-item value="reserved">
            <DispatchSheduleLoadList filter="Reserved" @editLoad="editLoad"/>
         </v-window-item>
         <v-window-item value="dispatched">
            <DispatchSheduleLoadList filter="Dispatched" @editLoad="editLoad"/>
         </v-window-item>
      </v-window>

   </div>
</template>