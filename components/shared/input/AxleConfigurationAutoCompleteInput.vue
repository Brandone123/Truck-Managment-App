<template>
    <v-autocomplete :variant="(variant as any)" hide-details :label="label" :density="(density as any)"
        :items="axleConfigurationsList" :rules="rules" clearable v-model="selectedConfiguration" item-value="value"
        item-title="title">
        <template #item="data">
            <v-list-subheader v-if="data.props.header" class="text-primary font-weight-bold">
                {{ data.props.header }}
            </v-list-subheader>
            <v-divider v-else-if="data.props.divider" />
            <v-list-item v-else v-bind="data.props" density="compact" :title="data.item.raw.title">
                <template v-slot:append>
                    <span class="text-caption">{{ data.item.raw.description }}</span>
                </template>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    variant: {
        type: String,
        default: '',
    },
    flat: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: 'Axle Configuration',
    },
    density: {
        type: String,
        default: '',
    },
    rules: {
        type: Array as PropType<any>,
        default: [],
    },
    modelValue: {
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'selection']);

const selectedConfiguration = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedConfiguration = axleConfigurationsList.value.find(item => item.title == value)
        emit('update:modelValue', value);
        emit('selection', selectedConfiguration);
    }
});

// const commonListStore = useMaintenanceCommonListStore()

// const { loadingLocations: loading } = storeToRefs(commonListStore);

// const itemList = computed(() => {
//     return commonListStore.getLocations
// })

// onMounted(() => {
//     commonListStore.fetchList('part-locations')
// })


const axleList = computed(() => {
    return axleConfigurationsList;
})

// const noDataText = computed(() => {
//     return loading.value ? '' : 'No data available';
// })



const axleConfigurationsList = ref([
    { props: { header: 'Vehicle Axles' } },
    { title: '4x2 FWD', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions two driven (front)' },
    { title: '4x2 RWD', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions two driven (rear)' },
    { title: '4x2 RWD (Dually)', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions two driven (rear)' },
    { title: '4x2 AWD', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions AWD' },
    { title: '4x2 AWD (Dually)', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions AWD' },
    { title: '4x4', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions, 4 driven' },
    { title: '4x4 (Dually)', value: { tireLayout: 'V4X', axles: { 'axle-1': 'steer', 'axle-2': 'drive' } }, description: '4 wheel positions AWD' },
    { title: '6x2', value: { tireLayout: 'V6X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'tag' } }, description: '6 wheel positions, 2 driven' },
    { title: '6x4', value: { tireLayout: 'V6X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive' } }, description: '6 wheel positions, 4 driven' },
    { title: '6x6', value: { tireLayout: 'V6X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive' } }, description: '6 wheel positions, 6 driven' },
    { title: '8x2', value: { tireLayout: 'V8X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'dead', 'axle-4': 'drive' } }, description: '8 wheel positions, 2 driven' },
    { title: '8x4', value: { tireLayout: 'V8X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'drive', 'axle-4': 'drive' } }, description: '8 wheel positions, 4 driven' },
    { title: '8x6', value: { tireLayout: 'V8X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive', 'axle-4': 'drive' } }, description: '8 wheel positions, 6 driven' },
    { title: '8x8', value: { tireLayout: 'V8X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive', 'axle-4': 'drive' } }, description: '8 wheel positions, 8 driven' },
    { title: '10x4', value: { tireLayout: 'V10X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'dead', 'axle-4': 'drive', 'axle-5': 'drive' } }, description: '10 wheel positions, 4 driven' },
    { title: '10x6', value: { tireLayout: 'V10X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'drive', 'axle-4': 'drive', 'axle-5': 'drive' } }, description: '10 wheel positions, 4 driven' },
    { title: '10x8', value: { tireLayout: 'V10X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive', 'axle-4': 'drive', 'axle-5': 'drive' } }, description: '10 wheel positions, 4 driven' },
    { title: '10x10', value: { tireLayout: 'V10X', axles: { 'axle-1': 'steer', 'axle-2': 'drive', 'axle-3': 'drive', 'axle-4': 'drive', 'axle-5': 'drive' } }, description: '10 wheel positions, 4 driven' },
    { title: '12x4', value: { tireLayout: 'V12X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'dead', 'axle-4': 'dead', 'axle-5': 'drive', 'axle-6': 'drive' } }, description: '12 wheel positions, 4 driven' },
    { title: '12x6', value: { tireLayout: 'V12X', axles: { 'axle-1': 'steer', 'axle-2': 'dead', 'axle-3': 'dead', 'axle-4': 'drive', 'axle-5': 'drive', 'axle-6': 'drive' } }, description: '12 wheel positions, 6 driven' },
    { props: { divider: true } },
    { props: { header: 'Trailer Axles' } },

    { title: 'Single Axle', value: { tireLayout: 'T2X' }, description: '' },
    { title: 'Tandem Axle', value: { tireLayout: 'T4X' }, description: '2 Tires per Axle' },
    { title: 'Tandem Axle', value: { tireLayout: 'T4XT' }, description: '4 Tires per Axle' },

    { title: 'Tri-Axle', value: { tireLayout: 'T6X' }, description: '2 Tires per Axle' },
    { title: 'Tri-Axle', value: { tireLayout: 'T6XT' }, description: '4 Tires per Axle' }
])

</script>