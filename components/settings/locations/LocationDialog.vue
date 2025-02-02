<template>
  <v-dialog v-model="dialog" scrollable fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add New Location
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon> 
        </v-btn>
      </v-toolbar>
      <v-card-text>
          <v-form ref="locationForm">
              <v-row>
                  <v-col cols="12" md="6">
                      <v-row>
                          <v-col cols="12">
                              <v-card>
                                  <v-card-title class="font-weight-bold">Details</v-card-title>
                                  <v-card-text>
                                      <v-row>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.Name" variant="outlined" flat label="Name" density="compact"
                                              :rules="[validation.required]"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-select :items="['Office', 'Shop']" v-model="locationInfo.location_type" variant="outlined" flat label="Location Type" density="compact"
                                              ></v-select>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.LocationCode" variant="outlined" flat label="Location Code" density="compact"
                                              ></v-text-field>
                                          </v-col>
                                      </v-row>
                                  </v-card-text>
                              </v-card>

                              <v-card class="mt-3">
                                  <v-card-title class="font-weight-bold">Address</v-card-title>
                                  <v-card-text>
                                      <v-row>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.AddressLine" variant="outlined" flat label="Address Line" density="compact"
                                              :rules="[validation.required]"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.AddressLine_2" variant="outlined" flat label="Address Line 2" density="compact"
                                              ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.City" variant="outlined" flat label="City" density="compact"
                                              :rules="[validation.required]"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.State" variant="outlined" flat label="State" density="compact"
                                              :rules="[validation.required]"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.PostalCode" variant="outlined" flat label="Postal Code" density="compact"
                                              ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" md="6" class="pb-0">
                                              <v-text-field v-model="locationInfo.CountryCode" variant="outlined" flat label="Country Code" density="compact"
                                              ></v-text-field>
                                          </v-col>
                                      </v-row>
                                  </v-card-text>
                              </v-card>
                          </v-col>
                      </v-row>
                  </v-col>

                  <v-col cols="12" md="6">
                      <v-card>
                          <v-card-title class="font-weight-bold">Other</v-card-title>
                          <v-card-text>
                              <v-row>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.contact" variant="outlined" flat label="Contact" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.phone" variant="outlined" flat label="Phone" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.latitude" variant="outlined" flat label="Latitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.longitude" variant="outlined" flat label="Longitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.GeofenceRadius" variant="outlined" flat label="Geofence Radius (meters)" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_latitude_1" variant="outlined" flat label="Geofence Corner 1 Latitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_longitude_1" variant="outlined" flat label="Geofence Corner 1 Longitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_latitude_2" variant="outlined" flat label="Geofence Corner 2 Latitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_longitude_2" variant="outlined" flat label="Geofence Corner 2 Longitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_latitude_3" variant="outlined" flat label="Geofence Corner 3 Latitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_longitude_3" variant="outlined" flat label="Geofence Corner 3 Longitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_latitude_4" variant="outlined" flat label="Geofence Corner 4 Latitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="6" class="pb-0">
                                      <v-text-field v-model="locationInfo.geofence_longitude_4" variant="outlined" flat label="Geofence Corner 4 Longitude" density="compact"
                                      ></v-text-field>
                                  </v-col>
                              </v-row>
                          </v-card-text>
                      </v-card>
                  </v-col>
              </v-row>
          </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
      <v-btn color="primary" variant="text" @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { LocationInfo } from '@/types/attendance/location'
import { useLocationStore } from '@/stores/settings/attendance/locations'
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();
const locationStore = useLocationStore()

const emit = defineEmits(['update:show'])

const props = defineProps({
item: {
  type: Object,
  required: false,
},
updating: {
  type: Boolean,
  default: false
},
show: {
  type: Boolean,
  default: false
}
});

const dialog = computed({
get() {
  return props.show
},
set(newValue) {
  emit('update:show', newValue);
}
})

const locationForm = ref<HTMLFormElement | null>(null)
const locationInfo = ref<LocationInfo>({
id: null,
Name: '',
LocationCode: null,
AddressLine: '',
City: '',
State: '',
contact: null,
phone: null,
location_type: null,
latitude: null,
longitude: null,
geofence_latitude_1: null,
geofence_longitude_1: null,
geofence_latitude_2: null,
geofence_longitude_2: null,
geofence_latitude_3: null,
geofence_longitude_3: null,
geofence_latitude_4: null,
geofence_longitude_4: null,
GeofenceRadius: null
})

const title = computed(() => {
return props.updating ? 'Edit Location' : 'Create Location'
})

const saveButtonText = computed(() => {
return props.updating ? 'Update' : 'Save'
})

const validateForm = async () => {
let formStatus = await locationForm.value?.validate()
return formStatus.valid ? true : false
}

const save = async () => {
let validForm = await validateForm()
if (!validForm) {
  return;
}

if (props.updating) {
  locationStore.updateLocation(locationInfo.value);
} else {
  locationStore.createLocation(locationInfo.value);
}

dialog.value = false;
};

const resetForm = () => {
if (locationForm.value) {
  (locationForm.value as HTMLFormElement).reset(); // Reset the form
}
locationInfo.value = {
  id: null,
  Name: '',
  LocationCode: null,
  AddressLine: '',
  City: '',
  State: '',
  contact: null,
  phone: null,
  location_type: null,
  latitude: null,
  longitude: null,
  geofence_latitude_1: null,
  geofence_longitude_1: null,
  geofence_latitude_2: null,
  geofence_longitude_2: null,
  geofence_latitude_3: null,
  geofence_longitude_3: null,
  geofence_latitude_4: null,
  geofence_longitude_4: null,
  GeofenceRadius: null
}
}

watch(dialog, (val) => {
if (val && props.updating) {
  locationInfo.value = props.item as LocationInfo
} else {
  resetForm()
}
})
</script>
