<script setup lang="ts">
import { ref } from 'vue';

var tab = ref('tab-1');

</script>
<template>
      <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Truck Settings</span>
            <v-tabs v-model="tab" center-active color="primary" density="compact">
                <v-tab value="tab-1" density="compact">
                    Truck List
                </v-tab>
                <v-tab value="tab-2" density="compact">
                    Truck Types
                </v-tab>
            </v-tabs>
        </div>
        
        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="tab-1">
                <DispatchTruckList/>
            </v-window-item>
            <v-window-item value="tab-2">
                <SettingsDispatchTruckTypes/>
            </v-window-item>
        </v-window>
    </div>
</template>
