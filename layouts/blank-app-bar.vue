<script setup lang="ts">
const title = ref("Moonstar TMS");
useHead({
    meta: [{ content: title }],
    titleTemplate: (titleChunk) => {
        return titleChunk
            ? `${titleChunk} - Truck Management System`
            : "Moonstar - Truck Management System";
    },
});
const layoutStore = useLayoutStore()
const { overlay } = storeToRefs(layoutStore)

</script>

<template>
    <v-app>
        <v-app-bar elevation="0" density="compact">
            <LayoutLogo class="ml-2"/>
            <v-spacer></v-spacer>
            <LayoutVerticalHeaderNotificationDD />
            <LayoutVerticalHeaderProfileDD />
        </v-app-bar>
        <v-main style="background-color: #EEEEEE">

            <v-container fluid class="page-wrapper fill-height">
                <slot />
            </v-container>
        </v-main>
        <v-overlay v-model="overlay" class="align-center justify-center">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-overlay>
    </v-app>
</template>


