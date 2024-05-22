<script setup lang="ts">
import { ref } from 'vue';

var tab = ref(null);

</script>
<template>
    <div>
        <v-tabs v-model="tab" center-active color="primary" density="compact">
            <v-tab value="tab-1" density="compact">
                Carriers
            </v-tab>
            <v-tab value="tab-2" density="compact">
                Carrier Types
            </v-tab>

            <v-tab value="tab-3" density="compact">
                Carrier Ranking
            </v-tab>
        </v-tabs>

        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="tab-1">
              <SettingsDispatchCarrierTable/>
            </v-window-item>
            <v-window-item value="tab-2">
                <SettingsDispatchCarrierTypes/>
            </v-window-item>
            <v-window-item value="tab-3">
                <SettingsDispatchCarrierRanking/>
            </v-window-item>
        </v-window>
    </div>
</template>