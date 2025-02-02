<template>
  <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
    :close-on-content-click="true" open-on-hover class="rounded">
    <template v-slot:activator="{ props }">
      <div class="d-inline-flex">
        <div>
          <div class="rounded position-relative"
            style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
            <span style="font-size:xx-small;" v-if="vehicle?.type">{{
              vehicle?.type.slice(0, 3).toUpperCase() }}</span>
            <span v-else style="font-size:xx-small;">VHI</span>
            <div v-if="vehicle?.status" :class="`${'bg-' + getVehicleStatusColor(vehicle?.status)}`"
              style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
            </div>
          </div>
        </div>
        <div class="ml-auto">
          <span class="text-secondary ml-2" v-bind="props"
            style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
            {{ vehicle?.name }}
          </span>
        </div>
      </div>
    </template>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card class="rounded-lg">
          <v-card-text>
            <div class="mb-3">
              <div class="d-flex" style=" align-items: center;">
                <div>
                  <div class="rounded position-relative"
                    style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                    <span style="font-size: large;">{{ vehicle?.type.slice(0,
                      3).toUpperCase()
                      }}</span>
                  </div>
                </div>
                <div class="ml-2">
                  <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">
                    {{ vehicle?.name }}
                  </span>
                </div>
              </div>
              <v-row class="mt-2">
                <v-col cols="12" md="6">Status</v-col>
                <v-col cols="12" md="6" v-if="vehicle?.status">
                  <v-chip density="compact" variant="flat" class="text-capitalize"
                    :color="getVehicleStatusColor(vehicle?.status)">
                    {{ vehicle?.status }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Operator</v-col>
                <v-col cols="12" md="6">{{ vehicle?.odometer }}</v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Type</v-col>
                <v-col cols="12" md="6">{{ vehicle?.type }}</v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Year Make Model</v-col>
                <v-col cols="12" md="6">
                  {{ vehicle?.year }}
                  {{ vehicle?.make }}
                  {{ vehicle?.model }}
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Group</v-col>
                <v-col cols="12" md="6" v-if="vehicle?.dimensions">{{
                  vehicle?.dimensions.ground_clearance }}</v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">VIN/SN</v-col>
                <v-col cols="12" md="6">{{ vehicle?.vin }}</v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Current Meter</v-col>
                <v-col cols="12" md="6">{{ }}</v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { storeToRefs } from 'pinia';

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'id',
  },
  value: {
    type: [String, Number],
    required: false,
  }
})

const vehicle = computed(() => {
  return assetList?.value.find((vehicle) => vehicle[props.type] == props.value)
})

const getVehicleStatusColor = (status: any) => {
  switch ((status || '')) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}

</script>