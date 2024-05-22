<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch, } from 'vue'
import type { TrailerInfo } from '~/types/dispatch/trailer';

const scheduleLoadStore = useScheduleLoadStore()

const trailerStore = useTrailerStore()

const { trailerList } = storeToRefs(trailerStore)

const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
});

const menu = ref<string>('details')

const dialog = ref(false);

const trailerHeaders = ref([
  { title: 'ID', key: 'trailer_id' },
  { title: 'VIN', key: 'trailer.vin' },
  { title: 'LICENSE PLATE', key: 'trailer.license_plate', sortable: false },
  { title: 'SERIAL', key: 'trailer.serial' },
  { title: 'ASSIGNED', key: 'created_at' },
  { title: 'RELIEVED', key: 'relieved_at' },
])


const addTrailerHeaders = ref([
  // { title: 'ID', key: 'id' },
  { title: 'VIN', key: 'vin' },
  { title: 'LICENSE PLATE', key: 'license_plate', sortable: false },
  { title: 'SERIAL', key: 'serial' },
  // { title: 'MODEL', key: 'model' },
  { title: 'YEAR', key: 'year' },
  { title: 'ACTIONS', key: 'actions' },
])

const trailer = computed(() => {
  return props.item?.current_trailer
})

const selectedTrailer = ref<TrailerInfo | null>(null)

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const saveAssign = async (trailer: TrailerInfo) => {
  selectedTrailer.value = trailer as TrailerInfo
  menu.value = 'details'
};

const save = () =>{
  if(selectedTrailer.value){
    scheduleLoadStore.assignTrailer({load_id: props.item?.id, trailer_id: selectedTrailer.value.id})
    nextTick(()=>{
      selectedTrailer.value = null;
    })
  }
}

watch(dialog, (val) => {
    menu.value = 'details'
    selectedTrailer.value = null
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" density="compact" style="font-size: 9px;" color="primary" flat v-bind="props" class="text-none">
        {{ item?.current_trailer?.name }}
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" title="Trailer Assignment" density="compact">
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
                  <v-col cols="12" v-if="selectedTrailer">
                    <p class="text-h6 text-primary">Current Trailer (Save to apply change)</p>
                    <div><span>ID: </span> {{ selectedTrailer.id }} </div>
                    <div><span>License Plate: </span> {{ selectedTrailer.license_plate }}</div>
                    <div><span>Model: </span> {{ selectedTrailer.model }}</div>
                    <div><span>Year: </span> {{ selectedTrailer.year }}</div>
                    <div><span>VIN: </span> {{ selectedTrailer.vin }}</div>
                    <div><span>Serial: </span> {{ selectedTrailer.serial }}</div>
                  </v-col>
                  <v-col cols="12" v-else-if="item?.current_trailer_id">
                    <p class="text-h6 text-primary">Current Trailer</p>
                    <div><span>ID: </span> {{ trailer.id }} </div>
                    <div><span>License Plate: </span> {{ trailer.license_plate }}</div>
                    <div><span>Model: </span> {{ trailer.model }}</div>
                    <div><span>Year: </span> {{ trailer.year }}</div>
                    <div><span>VIN: </span> {{ trailer.vin }}</div>
                    <div><span>Serial: </span> {{ trailer.serial }}</div>
                  </v-col>
                  <v-col cols="12" align="center">
                    <v-btn class="text-none" color="primary" density="comfortable" @click="menu = 'assign'">Assign To New
                      Trailer</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-primary">Assignment History</v-card-title>
              <v-data-table :items="item?.trailer_assignments || []" :headers="trailerHeaders">
                <!-- hide table footer by adding slot and passing no elementss -->
                <template #bottom></template>
              </v-data-table>
            </v-card>
          </v-window-item>

          <v-window-item value="assign">
            <v-btn @click="menu = 'details'" v-if="trailer" density="comfortable"
              class="text-none"><v-icon>mdi-chevron-left</v-icon>Assignment Details</v-btn>

            <SharedUiCustomTable :items="trailerList" :headers="addTrailerHeaders" :showFooterInHead="false">
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
