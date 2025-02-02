<template>
    <v-date-input prepend-icon="" prepend-inner-icon="mdi-calendar" color="primary" :variant="(variant as any)"
        :density="(density as any)" hide-details v-model="dateRange" :label="label" multiple="range"
        style="width: 300px" :rules="rules"></v-date-input>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import moment from 'moment';

interface DateRange {
    start?: string,
    end?: string
}

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
        default: 'Select range',
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
        type: Object as PropType<DateRange>,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'selection']);

const dateRange = ref<Date[]>([]);
const setup = ref(false)

const getRange = () => {
    let today = new Date();
    let currentDate = moment(today).format('YYYY-MM-DD');
    let payload: Record<string, string> = { start: currentDate, end: currentDate }
    const length = dateRange.value?.length ?? 0;
    if (length) {
        if (length > 1) {
            payload = {
                start: moment(dateRange.value[0]).format('YYYY-MM-DD'),
                end: moment(dateRange.value[length - 1]).format('YYYY-MM-DD')
            };
        } else {
            let range = moment(dateRange.value[0]).format('YYYY-MM-DD')
            payload = {
                start: range,
                end: range
            };
        }
    }
    emit('update:modelValue', payload)
}

const getDatesBetween = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate)); // Add the current date to the array
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dates;
}

onMounted(() => {
    if (props.modelValue.start && props.modelValue.end) {
        const start = new Date(props.modelValue.start);
        const end = new Date(props.modelValue.end);
        dateRange.value = getDatesBetween(start, end);
        nextTick(() => {
            setup.value = true;
        })
    }
})

watch(() => dateRange.value, () => {
    if (setup) {
        getRange()
    }
})

</script>