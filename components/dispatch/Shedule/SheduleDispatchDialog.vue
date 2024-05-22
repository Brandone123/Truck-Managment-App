<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import { NotesIcon } from 'vue-tabler-icons';
import Auth from '~/layouts/auth.vue';
import type { LoadDispatchInfo } from '~/types/dispatch/load_dispatch';
import type { LoadReservationInfo } from '~/types/dispatch/load_reservation';
import type { TrailerInfo } from '~/types/dispatch/trailer';
import type { TruckInfo } from '~/types/dispatch/truck';
import type { DriverInfo } from '~/types/store/driver';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const scheduleLoadStore = useScheduleLoadStore()
const layoutStore = useLayoutStore()

const truckStore = useTruckStore()
const { truckList } = storeToRefs(truckStore)

const driverStore = useDriverStore()
const { driverList } = storeToRefs(driverStore)

const trailerStore = useTrailerStore()
const { trailerList } = storeToRefs(trailerStore)

const authStore = useAuthStore()

const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
});

const showOverlay = ref<boolean>(false)

const menu = ref<string>('display')

const dialog = ref(false);

const vehicleHeaders = ref([
  { title: 'VIN', key: 'vin' },
  { title: 'LICENSE PLATE', key: 'license_plate', sortable: false },
  { title: 'SERIAL', key: 'serial' },
  { title: 'YEAR', key: 'year' },
  { title: 'ACTIONS', key: 'actions' },
])

const driverHeaders = ref([
  { title: 'Name', key: 'name' },
  { title: 'LICENSE NUMBER', key: 'license_number', sortable: false },
  { title: 'LICENSE STATE', key: 'license_state' },
  // { title: 'CDL EXPIRATION', key: 'cdl_expiration' },
  // { title: 'HAZMAT EXPIRATION', key: 'hazmat_expiration' },
  // { title: 'PHYSICAL DUE', key: 'physical_due' },
  // { title: 'MVR DUE', key: 'mvr_due' },
  { title: 'ACTIONS', key: 'actions' },
])

const selectedTruck = ref<TruckInfo | null>(null)
const selectedTrailer = ref<TrailerInfo | null>(null)
const selectedDriver = ref<DriverInfo | null>(null)
const notes = ref<string | null>(null);

const dispatch = computed(() => {
  if (props.item?.dispatch) {
    return props.item.dispatch as LoadDispatchInfo
  } else {
    return {} as LoadDispatchInfo
  }
})

const assignDriver = (driver: DriverInfo) => {
  selectedDriver.value = driver as DriverInfo
  menu.value = 'display'
};

const assignTrailer = (trailer: TrailerInfo) => {
  selectedTrailer.value = trailer as TrailerInfo
  menu.value = 'display'
};

const assignTruck = (truck: TruckInfo) => {
  selectedTruck.value = truck as TruckInfo
  menu.value = 'display'
};

const reset = () => {
  menu.value = 'display'
  selectedTruck.value = null
  selectedTrailer.value = null
  selectedDriver.value = null
}

const reservation = computed(() => {
  if (props.item?.reservation) {
    return props.item.reservation as LoadReservationInfo
  } else {
    return {} as LoadReservationInfo
  }
})


const save = async () => {
  if (selectedDriver.value || selectedTruck.value || selectedTrailer.value || (notes.value && notes.value != props.item?.dispatch?.notes)) {
    let reservationPayload = { load_id: props.item?.id } as any

    let payload = {} as any

    if (selectedDriver.value || selectedTruck.value || selectedTrailer.value) {

      if (selectedDriver.value) {
        reservationPayload.driver_id = selectedDriver.value.id
      }

      if (selectedTruck.value) {
        reservationPayload.truck_id = selectedTruck.value.id
      }

      if (selectedTrailer.value) {
        reservationPayload.trailer_id = selectedTrailer.value.id
      }
    }

    if (notes.value && notes.value != props.item?.dispatch?.notes) {

       payload = {
        load_id: props.item?.id,
        reservation_id: props.item?.reservation?.id,
        // status: 'Pending',
        dispatched_by: authStore.user?.id,
        // dispatched_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      if (notes.value) {
        payload.notes = notes.value
      }
    }

    showOverlay.value = true

    // update reservation
    if (Object.keys(reservationPayload).length > 1) {
      if (!reservation.value?.id) {
        await scheduleLoadStore.createReservation({ ...payload, status: 'Pending' })
      } else {
        await scheduleLoadStore.updateReservation({ ...payload, id: reservation.value?.id })
      }
    }

    // update dispatch
    if (Object.keys(payload).length > 0) {
      if (!dispatch.value.id) {
        payload.status = 'Pending'
        await scheduleLoadStore.createDispatch(payload as LoadDispatchInfo)
      } else {
        await scheduleLoadStore.updateDispatch({ ...payload, id: dispatch.value?.id })
      }
    }
    showOverlay.value = false
  }
}

watch(dialog, async (val) => {
  if (val && props.item?.id) {
    notes.value = props?.item?.dispatch?.notes || null
    showOverlay.value = true
    await scheduleLoadStore.fetchLoadDispatch(props.item.id)
    showOverlay.value = false
  } else {
    reset()
  }
})

watch(dispatch.value, (val) => {
  if (val.notes) {
    console.log(val.notes)
    notes.value = val.notes
  }
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" density="compact" style="font-size: 9px;" color="primary" flat v-bind="props" class="text-none">
        Dispatch
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" title="Load Dispatch Assignment" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="position:relative;">
        <v-overlay id="loader" :model-value="showOverlay" contained class="align-center justify-center">
          <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-overlay>
        <v-window v-model="menu">
          <v-window-item value="display">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title>
                    <p class="text-h6 text-primary d-flex justify-space-between">
                      Driver
                      <v-btn class="text-none" density="comfortable" color="primary" @click="menu = 'assignDriver'">{{
                        (item?.reservation?.driver_id || selectedDriver) ? 'Reassign' : 'Assign' }}</v-btn>
                    </p>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="selectedDriver">
                      <div><span>Id:</span>{{ selectedDriver.id }}</div>
                      <div><span>name:</span>{{ selectedDriver.name }}</div>
                    </div>
                    <div v-else-if="item?.reservation?.driver_id">
                      <div><span>Id:</span>{{ item?.reservation?.driver?.id }}</div>
                      <div><span>name:</span>{{ item?.reservation?.driver?.name }}</div>
                    </div>
                    <div v-else>
                      <p>No Driver Assigned</p>
                    </div>
                  </v-card-text>

                </v-card>

              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title>
                    <p class="text-h6 d-flex justify-space-between text-primary">Truck

                      <v-btn class="text-none" density="comfortable" color="primary" @click="menu = 'assignTruck'">{{
                        (item?.reservation?.truck_id || selectedTruck) ? 'Reassign' : 'Assign' }}</v-btn>
                    </p>
                  </v-card-title>

                  <v-card-text>
                    <div v-if="selectedTruck">
                      <div><span>Id:</span>{{ selectedTruck.id }}</div>
                      <div><span>VIN:</span>{{ selectedTruck.vin }}</div>
                      <div><span>License:</span>{{ selectedTruck.license_plate }}</div>
                    </div>
                    <div v-else-if="item?.reservation?.truck_id">
                      <div><span>Id:</span>{{ item?.reservation?.truck?.id }}</div>
                      <div><span>VIN:</span>{{ item?.reservation?.truck?.vin }}</div>
                      <div><span>License:</span>{{ item?.reservation?.truck?.license_plate }}</div>
                    </div>
                    <div v-else>
                      <p>No Truck Assigned</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title>
                    <p class="text-h6 d-flex justify-space-between text-primary">Trailer
                      <v-btn class="text-none" density="comfortable" color="primary" @click="menu = 'assignTrailer'">{{
                        (item?.reservation?.trailer_id || selectedTrailer) ? 'Reassign' : 'Assign' }}</v-btn>
                    </p>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="selectedTrailer">
                      <div><span>Id:</span>{{ selectedTrailer.id }}</div>
                      <div><span>VIN:</span>{{ selectedTrailer.vin }}</div>
                      <div><span>License:</span>{{ selectedTrailer.license_plate }}</div>
                    </div>
                    <div v-else-if="item?.reservation?.trailer_id">
                      <div><span>Id:</span>{{ item?.reservation?.trailer?.id }}</div>
                      <div><span>VIN:</span>{{ item?.reservation?.trailer?.vin }}</div>
                      <div><span>License:</span>{{ item?.reservation?.trailer?.license_plate }}</div>
                    </div>
                    <div v-else>
                      <p>No Trailer Assigned</p>
                    </div>
                  </v-card-text>
                </v-card>


                <v-row class="mt-3">
                  <v-col>
                    <v-textarea label="Notes" variant="solo" v-model="notes"></v-textarea>
                  </v-col>
                </v-row>

              </v-col>

            </v-row>
          </v-window-item>

          <v-window-item value="assignTruck">
            <v-btn @click="menu = 'display'" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>

            <SharedUiCustomTable :items="truckList" :headers="vehicleHeaders" :showFooterInHead="false">
              <template #item.actions="{ item }">
                <v-btn variant="tonal" density="comfortable" color="primary" class="text-none"
                  @click="assignTruck(item as TruckInfo)">Assign</v-btn>
              </template>
            </SharedUiCustomTable>
          </v-window-item>

          <v-window-item value="assignTrailer">
            <v-btn @click="menu = 'display'" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Assignment Details</v-btn>

            <SharedUiCustomTable :items="trailerList" :headers="vehicleHeaders" :showFooterInHead="false">
              <template #item.actions="{ item }">
                <v-btn variant="tonal" density="comfortable" color="primary" class="text-none"
                  @click="assignTrailer(item as TrailerInfo)">Assign</v-btn>
              </template>
            </SharedUiCustomTable>
          </v-window-item>

          <v-window-item value="assignDriver">
            <v-btn @click="menu = 'display'" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Assignment Details</v-btn>

            <SharedUiCustomTable :items="driverList" :headers="driverHeaders" :showFooterInHead="false">
              <template #item.actions="{ item }">
                <v-btn variant="tonal" density="comfortable" color="primary" class="text-none"
                  @click="assignDriver(item as DriverInfo)">Assign</v-btn>
              </template>
            </SharedUiCustomTable>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save" :disabled="menu != 'display'">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
