<template>
    <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ props }">
            <v-btn density="comfortable" v-bind="props" color="primary" class="text-none">
                <v-icon>mdi-video-outline</v-icon>
                Live Video Feed
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" title="Live Video Feed" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <video style="width:100%;height:auto;" controls="false" autoplay loop>
                <source :src="videoFeed">
                <p>Your browser doesn't support HTML5 video</p>
            </video>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)

const videoFeed = computed(() => {
    return dialog.value ? '/videos/truck_dash_cam_footage.mp4' : ''
})
</script>