<template>
    <div>
        <v-card>
            <v-card-text>
                <div v-for="(group, gIndex) in listData" :key="gIndex" class="mb-4">
                    <p class="font-weight-bold">
                        {{ group.dateLabel }}
                    </p>
                    <div v-for="evt in group.events" :key="evt.id" class="mb-2">
                        <v-chip class="bg-primary pa-1 rounded-xl" style="cursor: pointer;"
                            color="white" @click="handleEventClick(evt)">
                            {{ evt[eventTitleKey] }}
                            ({{ formatTime(evt[props.eventStartKey]) }}–{{ formatTime(evt[eventEndKey]) }})
                            <!-- <span v-if="evt.meetingLink"> | Link: {{ evt.meetingLink }}</span>
                            <span v-if="evt.isRecurring"> | Recurring</span>
                            <span v-if="evt.attendees && evt.attendees.length">
                                | Attendees: {{ evt.attendees.join(', ') }}
                            </span> -->
                        </v-chip>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

type MeetingEvent = Record<string, any>

const props = defineProps<{
    eventStartKey: string
    eventEndKey: string
    eventTitleKey: string
    events: MeetingEvent[]
    // We'll rely on parent's formatTime, passed in as a prop
    formatTime: (d: Date) => string
    stickyTop: boolean
    stickyTopOffset: number
}>()

const emit = defineEmits<{
    (e: 'event-click', evt: MeetingEvent): void
}>()

const headerStyle = computed(() => {
    return props.stickyTop ? { position: 'sticky', top: `${110 + props.stickyTopOffset}px`, zIndex: 1 } : {}
})

const listData = computed(() => {
    // Sort events by start time
    const sorted = props.events.slice().sort((a, b) => a[props.eventStartKey].getTime() - b[props.eventStartKey].getTime())

    // Group into a map: YYYY-MM-DD -> MeetingEvent[]
    const map: Record<string, MeetingEvent[]> = {}
    for (const e of sorted) {
        const key = e[props.eventStartKey].toISOString().split('T')[0]
        if (!map[key]) {
            map[key] = []
        }
        map[key].push(e)
    }

    // Return an array suitable for v-for
    return Object.keys(map).sort().map(dateKey => {
        const d = new Date(dateKey + 'T00:00:00')
        return {
            dateLabel: d.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            events: map[dateKey]
        }
    })
})

function handleEventClick(evt: MeetingEvent) {
    emit('event-click', evt)
}
</script>

<style scoped>
.calendar-scroll {
    overflow-x: auto;
    border: 1px solid #ddd;
    max-height: 600px;
    margin-top: 16px;
}

.calendar-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    min-width: 600px;
}

.calendar-table th,
.calendar-table td {
    border: 0.2px solid gainsboro;
    padding: 6px;
    vertical-align: top;
}

.event-block {
    margin: 2px 0;
    padding: 4px;
    color: #fff;
    font-size: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
}

/* If you have list-specific styling, put it here. */
</style>
s