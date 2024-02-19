// ===============================|| Auth Layout ||=============================== //
<script setup lang="ts">
const layoutStore = useLayoutStore()
const { overlay } = storeToRefs(layoutStore)
</script>
<template>
  <v-app>
    <NuxtPage />
    <v-overlay v-model="overlay" class="align-center justify-center">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </v-overlay>
  </v-app>
</template>
