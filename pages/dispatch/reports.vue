<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useLoadInfoStore } from '@/stores/load_assignment'
import {useCarrierStore} from '@/stores/settings/dispatch/carrier'

const sheduleLoadStore = useLoadInfoStore()
const { loadTemplateList, loading: loadLoading } = storeToRefs(sheduleLoadStore)

const carrierListStore = useCarrierStore()
const {carrierList} = storeToRefs(carrierListStore)

const employeeStore = useEmployeeStore()
const {employeeList} = storeToRefs(employeeStore)

onMounted(() => {
    carrierListStore.fetchCarrierList()
    employeeStore.fetchEmployeeList()
    sheduleLoadStore.fetchLoadList()
})

const loadHeaders = computed(() => {
  const headers = [
    { title: 'PRO NUMBER', key: 'id' },
    { title: 'CUSTOMER', key: 'customer.name' },
    { title: 'ROUTE ID', key: 'route_number' },
    { title: 'CUSTOMER REF', key: 'reference_number' },
    { title: 'TRUCK', key: 'current_truck_id' },
    { title: 'TRAILER', key: 'current_trailer_id' },
    { title: 'DRIVER', key: 'current_driver.name' },
    { title: 'DISPATCHER', key: 'dispatcher_id' },
    { title: 'CARRIER', key: 'carrier_id' },
    { title: 'STATUS', key: 'Status' }
  ];

  return headers;
});

const getDispatcherName = (dispatcher_id:any) => {
   const dispatcher = employeeList.value.find((dispatcher) => dispatcher.id === dispatcher_id);
  return dispatcher ? dispatcher.full_name : '';
}

const getCarrierName = (carrier_id:any) => {
   const carrier = carrierList.value.find((carrier) => carrier.id === carrier_id);
  return carrier ? carrier.name : '';
}

</script>
<template>
    <div class="d-flex justify-space-between">
         <span class="text-primary text-h5">Report</span>
        <div>
            <DispatchReportGenerator />
        </div>
      </div>
    <SharedUiCustomTable return-object show-select :headers='loadHeaders' :items='loadTemplateList' :loading="loadLoading">
        <template v-slot:item.dispatcher_id="{ item }">
            <v-btn variant="text">{{ getDispatcherName(item.dispatcher_id) }}</v-btn>
        </template>
        <template v-slot:item.carrier_id="{ item }">
            <v-btn variant="text">{{ getCarrierName(item.carrier_id) }}</v-btn>
        </template>
    </SharedUiCustomTable>
</template>
