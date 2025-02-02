<template>
    <div style="display: flex;background-color:white" class="rounded">
        <!-- Start Year Picker -->
        <v-menu v-model="startMenu" close-on-content-click max-width="300px" offset-y :density="density">
            <template #activator="{ props }">
                <v-text-field v-bind="props" :label="labelStart" flat v-model="yearRange.start" readonly
                    :density="density" :variant="(variant as any)" style="width: 150px" hide-details></v-text-field>
            </template>
            <v-card>
                <v-date-picker-years :min="new Date('2022-01-01T00:00:00Z')"
                    :max="new Date(yearRange.end + '-01-01T00:00:00Z')" variant="flat" v-model="yearRange.start"
                    @click:year="onStartYearSelected" color="primary" />
            </v-card>
        </v-menu>

        <v-divider vertical></v-divider>
        <!-- End Year Picker -->
        <v-menu v-model="endMenu" close-on-content-click max-width="300px" offset-y :disabled="!yearRange.start"
            :density="density">
            <template #activator="{ props }">
                <v-text-field v-bind="props" :label="labelEnd" flat v-model="yearRange.end" readonly :density="density"
                    :variant="(variant as any)" style="width: 150px" hide-details></v-text-field>
            </template>
            <v-card>
                <v-date-picker-years :min="new Date(yearRange.start + '-01-01T00:00:00Z')" :max="new Date()"
                    variant="flat" v-model="yearRange.end" @click:year="onEndYearSelected" color="primary" />
            </v-card>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Define YearRange interface
interface YearRange {
    start?: number;
    end?: number;
}

// Props definition
const props = defineProps({
    variant: {
        type: String,
        default: '',
    },
    density: {
        type: String,
        default: '',
    },
    flat: {
        type: Boolean,
        default: false,
    },
    labelStart: {
        type: String,
        default: 'Start Year',
    },
    labelEnd: {
        type: String,
        default: 'End Year',
    },
    rules: {
        type: Array as PropType<any>,
        default: [],
    },
    modelValue: {
        type: Object as PropType<YearRange>,
        required: true,
    },
});

// Emits for updating modelValue
const emit = defineEmits(['update:modelValue', 'selection']);

// Dropdown menu controls
const startMenu = ref(false);
const endMenu = ref(false);

const yearRange = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

// Event handlers for year selection
const onStartYearSelected = (year: number) => {
    startMenu.value = false; // Close menu after selection
};

const onEndYearSelected = (year: number) => {
    endMenu.value = false; // Close menu after selection
};

</script>
