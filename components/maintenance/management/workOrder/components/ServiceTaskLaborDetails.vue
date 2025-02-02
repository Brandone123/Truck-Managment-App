<template>
    <v-row class="pl-5">
        <v-col cols="5" class="py-1">
            <span class="text-caption">
                <span>
                    <v-icon>mdi-account</v-icon>
                    {{ getTechnicianName(laborDetail.user_id)?.full_name }}
                </span>
                <br />
                <span v-if="laborDetail.notes" class="text-caption">
                    <v-icon size="small"></v-icon> <span>{{ laborDetail.notes }} </span>
                </span>
            </span>
        </v-col>
        <v-col cols="4" class="py-1 text-caption">
            <div class="text-primary" v-if="workInProgress">
                <div>In Progress</div>
                <div><v-icon class="mr-2">mdi-calendar</v-icon> {{ laborDetail.start_time }}</div>
                <div><v-icon class="mr-2">mdi-timer-outline</v-icon> {{ timeDiffString }}</div>
            </div>
            <div class="text-secondary" v-else>
                <div v-if="laborDetail.start_time && laborDetail.end_time">{{
                    getTimeDifference(laborDetail.start_time, laborDetail.end_time) }}</div>
                <div>
                    <v-icon class="mr-2" size="x-small">mdi-timer</v-icon><span>{{
                        laborDetail.hour }}hrs x ${{
                            laborDetail.hourly_labor_rate }}</span>
                </div>
            </div>
        </v-col>
        <v-col cols="3" class="py-1">
            <span v-if="!workInProgress">${{
                laborDetail.subtotal }}</span>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import moment from 'moment'
import type { Labor } from '@/types/maintenance/workOrder'


const props = defineProps({
    laborDetail: {
        type: Object as PropType<Partial<Labor>>,
        required: true,
        default: {} as Labor
    },
    getTechnicianName: {
        type: Function,
        required: true
    },
    getTimeDifference: {
        type: Function,
        required: true,
    },
    formatTimeDifference: {
        type: Function,
        required: true
    },
    dialog: {
        type: Boolean,
        required: true,
    }
})

const timeDiffString: Ref<string> = ref('');
const continuedTimer: Ref<NodeJS.Timeout | null> = ref(null);

const workInProgress = computed(() => {
    return Boolean(props.laborDetail?.start_time) && !Boolean(props.laborDetail?.end_time) && props.laborDetail.user_id
})

const startTimer = () => {
    // Convert the start time string to a Moment object
    const start = moment(props.laborDetail.start_time);

    // Get the current time as a Moment object
    const now = moment();

    // Calculate the initial elapsed time
    const initialElapsedTime = now.diff(start);

    // Initialize the timer value
    let timerValue = initialElapsedTime;

    // Start the timer
    continuedTimer.value = setInterval(() => {
        timerValue += 1000; // Increment the timer by 1 second
        timeDiffString.value = props.formatTimeDifference(timerValue);
    }, 1000);
}

const stopTimer = () => {
    if (continuedTimer.value !== null) {
        clearInterval(continuedTimer.value);
        continuedTimer.value = null;
    }
};

if (continuedTimer.value == null && workInProgress.value) {
    startTimer()
}

onUnmounted(() => {
    if (continuedTimer.value !== null) {
        stopTimer()
    }
})

watch(() => props.dialog, (newVal) => {
    if (newVal) {
        if (continuedTimer.value !== null && workInProgress) {
            startTimer()
        }
    } else {
        if (continuedTimer.value != null) {
            stopTimer()
        }
    }
})

</script>