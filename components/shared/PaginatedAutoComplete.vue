<template>
    <v-autocomplete v-bind="{ ...$props }" :items="items" :loading="loading"
        :menu-props="{ maxWidth: 300, maxHeight: 400 }" clearable no-filter v-model:search-input="search"
        @update:search="handleSearch">
        <template #append-item>
            <template v-if="items.length">
                <!-- <div v-if="!loading && !isTyping && pagination.page == pagination.lastPage"
                    class="text-caption d-flex justify-center text-secondar">End Of List</div> -->
                <div v-if="!loading" v-intersect="handleIntersection"></div>

                <div v-else class="text-caption d-flex justify-center text-primary">Loading more...</div>
            </template>
        </template>

        <!-- Default slots here -->
        <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
            <slot :name="name" v-bind="slotProps" v-if="name && name !== 'append-item'"></slot>
        </template>


    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, useSlots } from 'vue'

// Define the shape of each item in the items array
interface Item {
    // Replace with actual properties of your items
    id: number
    name: string
    // Add other properties as needed
}

// Define the props with TypeScript interfaces
interface Props {
    items: Item[]
    loading?: boolean
    pagination: Record<string, number>;
}

const props = defineProps<Props>()

// Access the current slots with typing
const slots = useSlots()

// Define the emitted events with TypeScript
const emit = defineEmits<{
    (e: 'intersect'): void
    (e: 'update:search-input', value: string | null): void
}>()

// Handler for the intersection observer
function handleIntersection(isIntersecting: boolean) {
    console.log('isIntersecting: ' + isIntersecting)
    if (isIntersecting) {
        emit('intersect')
    }
}

// Reactive search input
const search = ref<string | null>(null)


const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isTyping = ref<boolean>(false)



function handleSearch(value: string | null) {
    isTyping.value = true

    // 1) Clear any previously scheduled timer
    if (typingTimer.value) {
        clearTimeout(typingTimer.value)
    }

    // 2) Start a new timer (e.g., 500ms)
    typingTimer.value = setTimeout(() => {
        // The user hasn't typed for 500ms
        isTyping.value = false
        search.value = (value || "").trim()
    }, 500)
}

// Emit the search input changes
watch(() => search.value, (newVal) => {
    emit('update:search-input', newVal)
})
</script>

<style scoped>
/* Ensure the sentinel has some visibility */
.sentinel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    /* Adjust as needed */
}
</style>