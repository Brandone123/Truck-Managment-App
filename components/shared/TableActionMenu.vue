<template>
    <div>
        <v-menu v-model="menuVisible" offset-y v-if="hoveredRow == index + 1 || menuVisible" close-on-back
            close-on-content-click @blur="menuVisible = false">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props" class="custom-button" variant="outlined" density="comfortable">
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </template>
            <v-list density="compact" ref="menuContainer">
                <slot></slot>
            </v-list>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
    hoveredRow: {
        required: true
    },
    index: {
        type: Number,
        required: true,
    }
})

const menuVisible = ref(false);
const menuContainer = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
    if (menuContainer.value && !(menuContainer.value as any).$el.contains(event.target as Node)) {
        menuVisible.value = false;
    }
};

// Watch menuVisible to add/remove event listener based on its value
watch(menuVisible, (newVal) => {
    if (newVal) {
        document.addEventListener("mousedown", handleClickOutside);
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }
});

// Cleanup in case the component is destroyed while menuVisible is true
onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style>
/* Optional styling */
.custom-button {
    min-width: 0;
    width: 20px;
}
</style>