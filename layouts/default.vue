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
const { overlay , message} = storeToRefs(layoutStore)

</script>

<template>
    <v-app>
        <LayoutMain />
        <v-main class="grey-background">
            <v-container fluid class="page-wrapper">
                <slot />
            </v-container>
        </v-main>
        <v-overlay v-model="overlay" class="align-center justify-center">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-overlay>
        <v-snackbar v-model="message.show" :timeout="2000" :color="message.color" variant="tonal" :text="message.text">
            {{ message.text }}
        </v-snackbar>
    </v-app>
</template>

<style>
.sticky-page-top {
    position: sticky;
    top: 48px;
    z-index: 2;
    background-color: #EEEEEE;
}

.grey-background {
    background-color: #EEEEEE;
    /* background-color: rgba(var(--v-theme-primary), var(--v-border-opacity)) */
    /* background-color: rgba(var(--v-theme-primary), 0.05) */
}

.no-wrap{
    white-space: nowrap !important; 
}
</style>

