<template>
    <v-autocomplete v-model="selectedPosition" :items="tirePositions" :no-data-text="noDataText" :loading="loading"
        :hide-no-data="!loading" :variant="(variant as any)" :flat="flat" :density="(density as any)" :label="label"
        :rules="rules" item-title="title" item-value="value">
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template #item="data">
            <v-list-subheader v-if="data.props.header" class="font-weight-bold">
                {{ data.props.header }}
            </v-list-subheader>
            <v-divider v-else-if="data.props.divider" />
            <v-list-item v-else v-bind="data.props"
                :disabled="onlyInstalledPositions ? !installedPositions.includes(data.item.value) : installedPositions.includes(data.item.value)">
                <v-list-item-subtitle>
                    {{ data.item.value }}
                </v-list-item-subtitle>
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
        default: 'Location',
    },
    density: {
        type: String,
        default: '',
    },
    rules: {
        type: Array as PropType<any>,
        default: [],
    },
    tireLayout: {
        type: String,
        required: true
    },
    selectedAxle: {
        type: Object as any,
        required: true,
    },
    modelValue: {
        required: true,
    },
    installedPositions: {
        type: Array as PropType<string[]>,
        required: false,
        default: [],
    },
    onlyInstalledPositions: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const emit = defineEmits(['update:modelValue', 'selection']);
const selectedPosition = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedPosition = (tirePositions.value as any[]).find(item => item.value == value)
        emit('update:modelValue', value);
        emit('selection', selectedPosition);
    }
});

const commonListStore = useMaintenanceCommonListStore()

const { loadingLocations: loading } = storeToRefs(commonListStore);

const tirePositions = computed(() => {

    const match = props.tireLayout.match(/[VT](\d+)X/);
    const tirePositions = match ? parseInt(match[1]) : null;

    const assetType = match ? match[0].charAt(0) : null; // 'V' or 'T'

    let positions: Array<any> = []

    if (tirePositions) {
        const axleCount = tirePositions / 2
        let currentAxle = 2
        switch (assetType) {
            case 'V':
                positions = [
                    { props: { header: 'Front Axle' } },
                    { title: 'Left Front (LF)', value: 'LF' },
                    { title: 'Right Front (RF)', value: 'RF' },
                ]

                do {
                    if (tirePositions == 4) {
                        positions = positions.concat([
                            { props: { divider: true } },
                            { props: { header: `Axle ${currentAxle}` } },
                            { title: `Left (${currentAxle}L)`, value: `${currentAxle}L` },
                            { title: `Right (${currentAxle}R)`, value: `${currentAxle}R` },
                        ])
                    } else {
                        positions = positions.concat([
                            { props: { divider: true } },
                            { props: { header: `Axle ${currentAxle}` } },
                            { title: `Left Outer (${currentAxle}LO)`, value: `${currentAxle}LO` },
                            { title: `Left Inner (${currentAxle}LI)`, value: `${currentAxle}LI` },
                            { title: `Right Outer (${currentAxle}RO)`, value: `${currentAxle}RO` },
                            { title: `Right Inner (${currentAxle}RI)`, value: `${currentAxle}RI` },
                        ])
                    }
                    currentAxle += 1;
                } while (currentAxle <= axleCount)
                break;

            case 'T':

                const isTandem = props.tireLayout.charAt(props.tireLayout.length - 1) == 'T';
                if (isTandem) {
                    positions = [
                        { props: { header: 'Trailer Axle 1' } },
                        { title: 'Left Outer (1LO)', value: '1LF' },
                        { title: 'Left Inner(1LO)', value: '1LI' },
                        { title: 'Right Outer (1RO)', value: '1RO' },
                        { title: 'Right Innter (1RI)', value: '1RI' },
                    ]
                } else {
                    positions = [
                        { props: { header: 'Trailer Axle 1' } },
                        { title: 'Left (1L)', value: '1L' },
                        { title: 'Right (1R)', value: '1R' },
                    ]
                }

                if (currentAxle > axleCount) {
                    break;
                }

                do {
                    // if (currentAxle < axleCount) {
                    if (isTandem) {
                        positions = positions.concat([
                            { props: { divider: true } },
                            { props: { header: `Trailer Axle ${currentAxle}` } },
                            { title: `Left Outer (${currentAxle}LO)`, value: `${currentAxle}LO` },
                            { title: `Left Inner (${currentAxle}LI)`, value: `${currentAxle}LI` },
                            { title: `Right Outer (${currentAxle}RO)`, value: `${currentAxle}RO` },
                            { title: `Right Inner (${currentAxle}RI)`, value: `${currentAxle}RI` },
                        ])
                    } else {
                        positions = positions.concat([
                            { props: { divider: true } },
                            { props: { header: `Axle ${currentAxle}` } },
                            { title: `Left (${currentAxle}L)`, value: `${currentAxle}L` },
                            { title: `Right (${currentAxle}R)`, value: `${currentAxle}R` },
                        ])
                    }
                    currentAxle += 1;
                    // }
                } while (currentAxle <= axleCount)
                break;
        }
    }

    return positions
});


watch(() => props.selectedAxle?.selectedPosition, (newValue) => {
    selectedPosition.value = newValue
});

// onMounted(() => {
//     commonListStore.fetchList('part-locations')
// })

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})
</script>