<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useLoadInfoStore } from '~/stores/load_assignment'
import type { LoadInfo } from '~/types/dispatch/load'
import type { filterItem } from '~/types/layout/table';
import {useCarrierStore} from '@/stores/settings/dispatch/carrier'

const loadStore = useLoadInfoStore()
const { loadTemplateList, loading: loadLoading } = storeToRefs(loadStore)

const carrierListStore = useCarrierStore()
const {carrierList} = storeToRefs(carrierListStore)

const employeeStore = useEmployeeStore()
const {employeeList} = storeToRefs(employeeStore)

onMounted(() =>{
   carrierListStore.fetchCarrierList()
   employeeStore.fetchEmployeeList()
   loadStore.fetchLoadList()
})

var tab = ref(null);

const loadHeaders = computed(() => {
  const headers = [
    { title: 'PRO NUMBER ', key: 'id' },
    { title: 'CUSTOMER ', key: 'customer.name' },
    { title: 'ROUTE ID ', key: 'route_number' },
    { title: 'CUSTOMER REF', key: 'reference_number' },
    { title: 'TRUCK', key: 'current_truck_id' },
    { title: 'TRAILER', key: 'current_trailer_id' },
    { title: 'DRIVER', key: 'current_driver.name' },
    { title: 'STATUS', key: 'Status' }
  ];

  if (tab.value === 'tab-1') {
    headers.push({ title: 'DISPATCHER ASSIGNED', key: 'dispatcher_id' });
  }

  if (tab.value === 'tab-2') {
    headers.push({ title: 'CARRIER ASSIGNED', key: 'carrier_id' });
  }

  return headers;
});

const showDispatchers = ref(false)
const showCarriers= ref(false)

const getDispatcherName = (dispatcher_id:any) => {
   const dispatcher = employeeList.value.find((dispatcher) => dispatcher.id === dispatcher_id);
  return dispatcher ? dispatcher.full_name : '';
}

const getCarrierName = (carrier_id:any) => {
   const carrier = carrierList.value.find((carrier) => carrier.id === carrier_id);
  return carrier ? carrier.name : '';
}

const selecteDispatcher = ref(null)
const selecteCarrier = ref(null);
const showDialog = ref(false);
const LoadDispatchItems = ref<LoadInfo[]>([])
const LoadCarrierItems = ref<LoadInfo[]>([])

const assignDispatch = (selectedItems:any) => {
   showDispatchers.value = true
   showCarriers.value = false
  showDialog.value = true;
  LoadDispatchItems.value = selectedItems;
}

const assignCarrier = (selectedItems:any) => {
   showDispatchers.value = false
   showCarriers.value = true
  showDialog.value = true;
  LoadCarrierItems.value = selectedItems;
}

const validateAssignment = () => {
  if (showDispatchers.value) {
   LoadDispatchItems.value.forEach(item => {
      loadStore.updateLoadAssignment({...item, dispatcher_id: selecteDispatcher.value});
   });
  } else if (showCarriers.value) {
   LoadCarrierItems.value.forEach(item => {
      loadStore.updateLoadAssignment({...item, carrier_id: selecteCarrier.value});
   });
  }
  showDialog.value = false;
}

const filtersDispatcher = ref<filterItem[]>([]);
const filtersCarriers = ref<filterItem[]>([]);

function initializeFilters() {
  // Convertion of employeeList to filterItemOptionObject[] format
  const convertedEmployeeList = employeeList.value.map(item => ({
    value: item.id?.toString() ?? '',
    text: `${item.full_name ?? ''}`
  }));

  // Convertion of carrierList to filterItemOptionObject[] format
  const convertedCarrierList = carrierList.value.map(item => ({
    value: item.id?.toString() ?? '',
    text: item.name ?? ''
  }));

  filtersDispatcher.value = [
    {
      title: 'Select Dispatcher',
      key: 'dispatcher_id',
      items: convertedEmployeeList,
      width: '300px'
    }
  ];

  filtersCarriers.value = [
    {
      title: 'Select Carriers',
      key: 'carrier_id',
      items: convertedCarrierList,
      width: '300px'
    }
  ];
}

watchEffect(() => {
  if (employeeList.value && carrierList.value) {
    initializeFilters();
  }
});

const dispatcherItemRowBackground = (row:any) =>{
    if (row.item.dispatcher_id != null) {
      return { class: 'tab1' };
    } else {
      return {class: ''}
    }
  }

  const carrierItemRowBackground = (row:any) =>{
    if (row.item.carrier_id != null) {
      return { class: 'tab2' };
    } else {
      return {class: ''}
    }
  }

</script>
<template>
   <div>
      <div class="d-flex justify-space-between">
         <span class="text-primary text-h5">Load Assignments</span>
        
      </div>
      <div class="sticky-page-top">
         <v-tabs v-model="tab" center-active>
            <v-tab value="tab-1" density="compact" class="text-green">
                Dispatcher Loads
            </v-tab>
            <v-tab value="tab-2" density="compact" class="text-orange">
               Carrier Loads
            </v-tab>
         </v-tabs>
      </div>
      <v-window v-model="tab" style="overflow:visible;">
         <v-window-item value="tab-1">
            <SharedUiCustomTable :filters="filtersDispatcher" :loading="loadLoading" return-object show-select :headers="loadHeaders" 
            :items="loadTemplateList">
               <!-- Slot to capture bulk actions -->
               <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                  <v-btn color="primary" class="text-none mr-2" @click="assignDispatch(selectedItems)">
                     <v-icon>mdi-send</v-icon> Assign To Dispatcher
                  </v-btn>
               </template>
               <template v-slot:item.dispatcher_id="{ item }">
                  <v-btn variant="text">{{ getDispatcherName(item.dispatcher_id) }}</v-btn>
               </template>
            </SharedUiCustomTable>
         </v-window-item>
         <v-window-item value="tab-2">
            <SharedUiCustomTable :filters="filtersCarriers" :loading="loadLoading" class="custom-table" return-object show-select :headers="loadHeaders" 
            :items="loadTemplateList">
               <!-- Slot to capture bulk actions -->
               <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                  <v-btn color="primary" class="text-none mr-2" @click="assignCarrier(selectedItems)">
                     <v-icon>mdi-send</v-icon> Assign To Carrier
                  </v-btn>
               </template>
               <template v-slot:item.carrier_id="{ item }">
                  <v-btn variant="text">{{ getCarrierName(item.carrier_id) }}</v-btn>
               </template>
            </SharedUiCustomTable>
         </v-window-item>
      </v-window>
      <v-dialog v-model="showDialog" max-width="500">
         <v-card>
            <v-card-title class="text-h6">Assign</v-card-title>
            <v-card-text>
               <v-autocomplete v-if="showDispatchers" v-model="selecteDispatcher" :items="employeeList" item-title="full_name" item-value="id" label="Select Dispatcher" outlined></v-autocomplete>
               <v-autocomplete v-if="showCarriers" v-model="selecteCarrier" :items="carrierList" item-title="name" item-value="id" label="Select Carrier" outlined></v-autocomplete>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="primary" dense @click="validateAssignment">Assign</v-btn>
               <v-btn dense @click="showDialog = false">Cancel</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<style scoped>

.v-table.v-data-table :deep() .tab1 {
  background-color: #78c679 !important;
}

.v-table.v-data-table :deep() .tab2 {
  background-color: #ffb74d !important;
}
</style>