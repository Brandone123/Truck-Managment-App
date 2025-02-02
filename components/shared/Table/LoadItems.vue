<template>
    <v-menu location="bottom" max-height="400px" width="400px" location-strategy="connected"
        :close-on-content-click="true" class="rounded" open-on-hover>
        <template v-slot:activator="{ props }">
            <div>
                <span v-bind="props" class="text-secondary ml-1" style="cursor: pointer; border-bottom: 1px dotted;">
                    {{ load?.id || 'N/A' }}
                </span>
            </div>
        </template>
        <v-card class="rounded-lg text-caption">
            <v-card-text>
                <v-list>
                    <!-- <v-list-item>
                        <v-avatar size="small" :color="avatarColor">
                            {{ initials }}
                        </v-avatar>
                        <span class="text-secondary ml-1">
                            {{ load?.weight || 'N/A' }}
                        </span>
                    </v-list-item> -->
                    <v-list-item class="mt-3">
                        <v-row>
                            <v-col cols="4">Weight</v-col>
                            <v-col cols="8" v-if="load?.weight">{{ load?.weight }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="mt-3">
                        <v-row>
                            <v-col cols="4">Reference Number</v-col>
                            <v-col cols="8" v-if="load?.referenceNumber">{{ load?.referenceNumber }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="mt-3">
                        <v-row>
                            <v-col cols="4">Miles</v-col>
                            <v-col cols="8" v-if="load?.miles">{{ load?.miles }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="mt-3">
                        <v-row>
                            <v-col cols="4">Tail Gated Loads</v-col>
                            <v-col cols="8" v-if="load?.tailgatedLoads">{{ load?.tailgatedLoads.length }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Pickup State</v-col>
                            <v-col cols="8" v-if="load?.pickupState">
                                {{ load?.pickupState}}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <!-- <v-list-item>
                        <v-row>
                            <v-col cols="4">Classification</v-col>
                            <v-col cols="8">{{ load?.classification }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider> -->
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Pickup City</v-col>
                            <v-col cols="8">{{ load?.pickupCity }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Delivery State</v-col>
                            <v-col cols="8">{{ load?.deliveryState }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Delivery City</v-col>
                            <v-col cols="8">{{ load?.deliveryCity }}</v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-menu>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadsStore } from '~/stores/dispatch/useLoadStore';

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

const loadStore = useLoadsStore()
const loads = computed(() => loadStore.getLoadList)

const load = computed(() => {
    return loads.value.find((load: any) => load[props.type] == props.value) || null
})


// const initials = computed(() => {
//     return load.value?.full_name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
// })

// const avatarColor = computed(() => {
//     if (initials.value == 'N/A') {
//         return 'grey'
//     }

//     const hue = initials.value?.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
//     return `hsl(${hue}, 80%, 70%)`;
// })
</script>