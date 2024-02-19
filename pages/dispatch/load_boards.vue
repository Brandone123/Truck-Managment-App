<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useLoadStore } from '@/stores/load'
import type { LoadInfo, StopInfo, CommodityInfo } from '@/types/store/load'

const loadStore = useLoadStore()
const { loadList } = storeToRefs(loadStore)

var tab = ref(null);

const defaultLoad = ref<LoadInfo>({
   id: null,
   customer_id: null,
   route_id: null,
   route: {
      id: null,
      name: null,
   },
   stops: [],
   commodities: [],
   pickup_date: null,
   pickup_time: null,
   pickup_city: null,
   pickup_state: null,
   pickup_address: null,
   delivery_date: null,
   delivery_time: null,
   delivery_city: null,
   delivery_state: null,
   delivery_address: null,
   truck_id: null,
   driver_id: null,
   trailer_id: null,
   notes: null,
   status: null,
   eta: null,
});

const editedLoad = ref(defaultLoad.value)

const loadDialog = ref(false)
const updatingLoad = ref(false)

const allLoadsCount = computed(() => {
   return loadList.value.length
})

const bookedLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'booked')?.length || 0
})

const sheduledLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'sheduled')?.length || 0
})

const enRouteLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'enroute')?.length || 0
})

const deliveredLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'delivered')?.length || 0
})

const approvedLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'approved')?.length || 0
})

const cancelledLoadsCount = computed<number>(() => {
   return loadList.value.filter(load => load.status == 'cancelled')?.length || 0
})

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
            <v-tab value="tab-1" density="compact">
               All
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-1' ? 'primary' : 'grey'" :content="allLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-2" density="compact">
               Open Loads
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-2' ? 'primary' : 'grey'" :content="bookedLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-3" density="compact">
               Sheduled
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-3' ? 'primary' : 'grey'" :content="sheduledLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-4" density="compact">
               En Route
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-4' ? 'primary' : 'grey'" :content="enRouteLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-5" density="compact">
               At Shipper
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-5' ? 'primary' : 'grey'" :content="deliveredLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-6" density="compact">
               At Consignee
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-6' ? 'primary' : 'grey'" :content="approvedLoadsCount" inline></v-badge>
               </template>
            </v-tab>
            <v-tab value="tab-7" density="compact">
               Cancelled
               <template v-slot:append>
                  <v-badge :color="tab == 'tab-7' ? 'primary' : 'grey'" :content="cancelledLoadsCount" inline></v-badge>
               </template>
            </v-tab>
         </v-tabs>
      </div>


      <v-window v-model="tab" style="overflow:visible;">
         <v-window-item value="tab-1">
            <DispatchLoads @editLoad="editLoad" />
         </v-window-item>
         <v-window-item value="tab-2">
            <DispatchLoads @editLoad="editLoad" status="open" />
         </v-window-item>
         <v-window-item value="tab-3">
            <DispatchLoads @editLoad="editLoad" status="sheduled" />
         </v-window-item>
         <v-window-item value="tab-4">
            <DispatchLoads @editLoad="editLoad" status="enroute" />
         </v-window-item>
         <v-window-item value="tab-5">
            <DispatchLoads @editLoad="editLoad" status="at_shipper" />
         </v-window-item>
         <v-window-item value="tab-6">
            <DispatchLoads @editLoad="editLoad" status="at_consignee" />
         </v-window-item>
         <v-window-item value="tab-7">
            <DispatchLoads @editLoad="editLoad" status="cancelled" />
         </v-window-item>
      </v-window>
   </div>
</template>