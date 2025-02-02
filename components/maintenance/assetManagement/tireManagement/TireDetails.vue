<template>
  <v-row>
    <v-col cols="12" :md="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title>Tire Details {{ tire?.tire_model }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">Manufacturer</v-col>
            <v-col cols="12" md="6">{{ tire?.part?.manufacturer?.name }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <!-- <v-row>
            <v-col cols="12" md="6">Brand</v-col>
            <v-col cols="12" md="6">{{ tire?.brand }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider> -->
          <v-row>
            <v-col cols="12" md="6">Size</v-col>
            <v-col cols="12" md="6">{{ tire?.size }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Purchase Date:</v-col>
            <v-col cols="12" md="6">{{ tire?.purchase_date }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Cost</v-col>
            <v-col cols="12" md="6">{{ tire?.line_item_part?.subtotal }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" :md="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title>Current Installation</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">Vehicle</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicVehicleItem v-if="tire?.current_installation?.vehicle"
                :vehicle="tire?.current_installation?.vehicle" />
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Installation Date</v-col>
            <v-col cols="12" md="6">{{
              tire?.current_installation?.installation_date
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Position </v-col>
            <v-col cols="12" md="6">{{
              tire?.current_installation?.position
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Installed By</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicTechnicianItem v-if="tire?.current_installation?.installer"
                :technician="tire.current_installation.installer" />
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Pressure At Installation</v-col>
            <v-col cols="12" md="6">{{
              tire?.current_installation?.pressure
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Tread Depth At Installation:</v-col>
            <v-col cols="12" md="6">{{
              tire?.current_installation?.tread_depth
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">New Tire ? </v-col>
            <v-col cols="12" md="6">{{
              tire?.current_installation?.new_tire ? "Yes" : "No"
            }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { Tire } from '@/types/maintenance/tireTypes';

const props = defineProps({
  tire: {
    type: Object as PropType<Tire>,
    required: true,
  },
  showSidePanel: {
    type: Boolean,
    default: false,
  }
})
</script>