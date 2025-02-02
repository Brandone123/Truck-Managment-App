<template>
    <v-menu v-model="dialog" close-on-content-click close-on-blur v-if="isHovering || dialog">
        <template v-slot:activator="{ props: menu }">
            <v-hover v-slot="{ isHovering, props: hover }">
                <v-btn v-bind="mergeProps(menu, hover)" variant="outlined" :elevation="isHovering ? 6 : 2">
                    <v-icon density="compact" class="icon">mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-hover>
        </template>

        <v-list min-width="200px">
            <v-list-item @click="$emit('edit')">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1 text-caption">Edit</span>
                    <v-icon color="primary">mdi-pencil</v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete')">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1 text-caption">Delete</span>
                    <v-icon color="red">mdi-trash-can-outline</v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-list-item>
                <v-list-item-title class="d-flex" @click="$emit('openWebForm')">
                    <span class="flex-grow-1 text-caption">Open Form</span>
                    <v-icon color="secondary">mdi-arrow-right-bold</v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { ref, mergeProps } from 'vue'

const props = defineProps({
    isHovering: {
        type: Boolean,
        required: true,
    }
})

const dialog = ref<boolean>(false)
</script>