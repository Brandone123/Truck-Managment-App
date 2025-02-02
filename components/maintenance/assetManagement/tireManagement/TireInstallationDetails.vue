<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Tire Rotation</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Tire Details {{ tire?.tire_model }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Model</v-col>
                  <v-col cols="12" md="6">{{ tire?.tire_model }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Brand</v-col>
                  <v-col cols="12" md="6">{{ tire?.brand }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
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
                  <v-col cols="12" md="6">{{ tire?.cost }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>Current Installation</v-card-title>
              <v-card-text>
                <!-- <v-row>
                <v-col cols="12" md="6">Vehicle</v-col>
                <v-col cols="12" md="6">
                  <SharedTableDynamicVehicleItem v-if="tire?.current_installation?.vehicle"
                    :vehicle="tire?.current_installation?.vehicle" />
                </v-col>
              </v-row> -->
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
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" class="text" @click="save">Save</v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Tire } from '@/types/maintenance/tireTypes';

const props = defineProps({
  tire: {
    type: Object as PropType<Tire>,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  }
})


const emit = defineEmits(['update:modelValue', 'save']);


const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

</script>