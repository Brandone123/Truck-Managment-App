<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch, } from 'vue'
import type { TruckInfo } from '~/types/dispatch/truck';

const scheduleLoadStore = useScheduleLoadStore()

const truckStore = useTruckStore()

const { truckList } = storeToRefs(truckStore)

const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
});

const menu = ref<string>('details')

const dialog = ref(false);

const truckHeaders = ref([
  { title: 'ID', key: 'truck_id' },
  { title: 'VIN', key: 'truck.vin' },
  { title: 'LICENSE PLATE', key: 'truck.license_plate', sortable: false },
  { title: 'SERIAL', key: 'truck.serial' },
  { title: 'ASSIGNED', key: 'created_at' },
  { title: 'RELIEVED', key: 'relieved_at' },
])


const addTruckHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'VIN', key: 'vin' },
  { title: 'LICENSE PLATE', key: 'license_plate', sortable: false },
  { title: 'SERIAL', key: 'serial' },
  { title: 'NAME', key: 'name' },
  { title: 'YEAR', key: 'year' },
  { title: 'ACTIONS', key: 'actions' },
])

const truck = computed(() => {
  return props.item?.current_truck
})

const selectedTruck = ref<TruckInfo | null>(null)

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const saveAssign = async (truck: TruckInfo) => {
  selectedTruck.value = truck as TruckInfo
  menu.value = 'details'
};

const save = () =>{
  if(selectedTruck.value){
    scheduleLoadStore.assignTruck({load_id: props.item?.id, truck_id: selectedTruck.value.id})
    nextTick(()=>{
      selectedTruck.value = null;
    })
  }
}

watch(dialog, (val) => {
    menu.value = 'details'
    selectedTruck.value = null
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" density="compact" style="font-size: 9px;" color="primary" flat v-bind="props" class="text-none">
        {{ item?.current_truck?.name}}
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" title="Truck Assignment" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-window v-model="menu">
          <v-window-item value="details">
            <v-card class="mb-3">
              <v-card-text class="mb-3">
                <v-row>
                  <v-col cols="12" v-if="selectedTruck">
                    <p class="text-h6 text-primary">Current Truck (Save to apply change)</p>
                    <div><span>ID: </span> {{ selectedTruck.id }} </div>
                    <div><span>License Plate: </span> {{ selectedTruck.license_plate }}</div>
                    <div><span>Model: </span> {{ selectedTruck.model }}</div>
                    <div><span>Year: </span> {{ selectedTruck.year }}</div>
                    <div><span>VIN: </span> {{ selectedTruck.vin }}</div>
                    <div><span>Serial: </span> {{ selectedTruck.serial }}</div>
                  </v-col>
                  <v-col cols="12" v-else-if="item?.current_truck_id">
                    <p class="text-h6 text-primary">Current Truck</p>
                    <div><span>ID: </span> {{ truck.id }} </div>
                    <div><span>License Plate: </span> {{ truck.license_plate }}</div>
                    <div><span>Model: </span> {{ truck.model }}</div>
                    <div><span>Year: </span> {{ truck.year }}</div>
                    <div><span>VIN: </span> {{ truck.vin }}</div>
                    <div><span>Serial: </span> {{ truck.serial }}</div>
                  </v-col>
                  <v-col cols="12" align="center">
                    <v-btn class="text-none" color="primary" density="comfortable" @click="menu = 'assign'">Assign To New
                      Truck</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-primary">Assignment History</v-card-title>
              <v-data-table :items="item?.truck_assignments || []" :headers="truckHeaders">
                <!-- hide table footer by adding slot and passing no elementss -->
                <template #bottom></template>
              </v-data-table>
            </v-card>
          </v-window-item>

          <v-window-item value="assign">
            <v-btn @click="menu = 'details'" v-if="truck" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Assignment Details</v-btn>

            <SharedUiCustomTable :items="truckList" :headers="addTruckHeaders" :showFooterInHead="false">
              <template #item.actions="{ item }">
                <v-btn variant="tonal" density="comfortable" color="primary" class="text-none"
                  @click="saveAssign(item)">Assign</v-btn>
              </template>
            </SharedUiCustomTable>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="dialog = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
