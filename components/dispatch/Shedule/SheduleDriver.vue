<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch, } from 'vue'
import type { DriverInfo } from '~/types/dispatch/driver';

const scheduleLoadStore = useScheduleLoadStore()

const driverStore = useDriverStore()

const { driverList } = storeToRefs(driverStore)

const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
});

const menu = ref<string>('details')

const dialog = ref(false);

const driverHeaders = ref([
  { title: 'ID', key: 'driver_id' },
  { title: 'NAME', key: 'driver.name' },
  { title: 'LICENSE NUMBER', key: 'driver.license_number' },
  { title: 'LICENSE PLATE', key: 'driver.license_plate', sortable: false },
  { title: 'ASSIGNED', key: 'created_at' },
  { title: 'RELIEVED', key: 'relieved_at' },
])


const addDriverHeaders = ref([
{ title: 'Name', key: 'name' },
  { title: 'LICENSE NUMBER', key: 'license_number', sortable: false },
  { title: 'LICENSE STATE', key: 'license_state' },
  // { title: 'CDL EXPIRATION', key: 'cdl_expiration' },
  // { title: 'HAZMAT EXPIRATION', key: 'hazmat_expiration' },
  // { title: 'PHYSICAL DUE', key: 'physical_due' },
  // { title: 'MVR DUE', key: 'mvr_due' },
  { title: 'ACTIONS', key: 'actions' },
])

const driver = computed(() => {
  return props.item?.current_driver
})

const selectedDriver = ref<DriverInfo | null>(null)

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const saveAssign = async (driver: DriverInfo) => {
  selectedDriver.value = driver as DriverInfo
  menu.value = 'details'
};

const save = () =>{
  if(selectedDriver.value){
    scheduleLoadStore.assignDriver({load_id: props.item?.id, driver_id: selectedDriver.value.id})
    nextTick(()=>{
      selectedDriver.value = null;
    })
  }
}

watch(dialog, (val) => {
    menu.value = 'details'
    selectedDriver.value = null
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" density="compact" style="font-size: 9px;" color="primary" flat v-bind="props" class="text-none">
        {{ item?.current_driver?.name }}
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" title="Driver Assignment" density="compact">
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
                  <v-col cols="12" v-if="selectedDriver">
                    <p class="text-h6 text-primary">Current Driver (Save to apply change)</p>
                    <div><span>ID: </span> {{ selectedDriver.id }} </div>
                    <div><span>Name: </span> {{ selectedDriver.name }}</div>
                    <div><span>License Number: </span> {{ selectedDriver.license_number }}</div>
                    <div><span>License State: </span> {{ selectedDriver.license_state }}</div>
                  </v-col>
                  <v-col cols="12" v-else-if="item?.current_driver_id">
                    <p class="text-h6 text-primary">Current Driver</p>
                    <div><span>ID: </span> {{ driver.id }} </div>
                    <div><span>Name: </span> {{ driver.name }}</div>
                    <div><span>Licese Number: </span> {{ driver.license_number }}</div>
                    <div><span>License State: </span> {{ driver.license_state }}</div>
                  </v-col>
                  <v-col cols="12" align="center">
                    <v-btn class="text-none" color="primary" density="comfortable" @click="menu = 'assign'">Assign To New
                      Driver</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-primary">Assignment History</v-card-title>
              <v-data-table :items="item?.driver_assignments || []" :headers="driverHeaders">
                <!-- hide table footer by adding slot and passing no elementss -->
                <template #bottom></template>
              </v-data-table>
            </v-card>
          </v-window-item>

          <v-window-item value="assign">
            <v-btn @click="menu = 'details'" v-if="driver" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Assignment Details</v-btn>

            <SharedUiCustomTable :items="driverList" :headers="addDriverHeaders" :showFooterInHead="false">
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
