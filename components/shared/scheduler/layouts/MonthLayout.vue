<template>
    <!-- <div class="calendar-scroll" ref="calendarContainer"> -->
    <table class="calendar-table month-grid">
        <thead>
            <tr>
                <th v-for="(w, wIndex) in daysOfWeek" :key="wIndex" :style="(headerStyle as any)" class="month-header">
                    {{ w }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(week, weekIndex) in monthMatrix" :key="weekIndex">
                <template v-for="(dayObj, dIndex) in week" :key="dIndex">

                    <td v-if="dayObj.date" class="month-day-cell" @dragover.prevent
                        @click="dayObj.date && onDayCellClick(dayObj.date)" @drop="onDrop($event, dayObj.date)">
                        <div class="day-number">
                            {{ dayObj.dayNum || '' }}
                        </div>
                        <div v-for="evt in dayObj.events" :key="evt.id" class="event-block bg-primary" draggable="true"
                            @dragstart="onEventDragStart($event, evt.id)" @click.stop="handleEventClick(evt)">
                            <div class="event-item"> {{ evt[eventTitleKey] }}</div>
                            <!-- <span v-if="evt.meetingLink" style="display:block;font-size:0.7rem">
                                    Link: {{ evt.meetingLink }}
                                </span>
                                <span v-if="evt.isRecurring" style="display:block;font-size:0.7rem">
                                    Recurring
                                </span>
                                <span v-if="evt.attendees && evt.attendees.length"
                                    style="display:block;font-size:0.7rem">
                                    Attendees: {{ evt.attendees.join(', ') }}
                                </span> -->
                        </div>
                    </td>

                    <td v-else class="month-day-cell"></td>
                </template>

            </tr>
        </tbody>
    </table>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

type MeetingEvent = Record<string, any>

const props = defineProps<{
    eventStartKey: string
    eventEndKey: string
    eventTitleKey: string
    events: MeetingEvent[]
    currentDate: Date | null
    daysOfWeek: string[]
    stickyTop: boolean
    stickyTopOffset: number
}>()

const emit = defineEmits<{
    (e: 'day-click', dateObj: Date): void
    (e: 'event-click', evt: MeetingEvent): void
    (e: 'event-drag-start', payload: { event: DragEvent; eventId: string }): void
    (e: 'event-drop', payload: { eventId: string; date: Date }): void
}>()


const headerStyle = computed(() => {
    return props.stickyTop ? { position: 'sticky', top: `${110 + props.stickyTopOffset}px`, zIndex: 1 } : {}
})

/** Arrow function version of isSameDay helper. */
const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

/** Computed for building the month "matrix". */
const monthMatrix = computed(() => {
    if (!props.currentDate) return []
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()

    const firstOfMonth = new Date(year, month, 1)
    const firstDayWeekday = firstOfMonth.getDay()

    const grid: Array<Array<{
        dayNum: number | null
        date: Date | null
        events: MeetingEvent[]
    }>> = []

    let dayCursor = new Date(year, month, 1 - firstDayWeekday)

    for (let row = 0; row < 6; row++) {
        const rowArr: {
            dayNum: number | null
            date: Date | null
            events: MeetingEvent[]
        }[] = []

        for (let col = 0; col < 7; col++) {
            const rowDate = new Date(dayCursor)
            const dayNum = rowDate.getMonth() === month ? rowDate.getDate() : null

            const dayEvents = props.events.filter(evt =>
                isSameDay(evt[props.eventStartKey], rowDate)
            )

            rowArr.push({
                dayNum,
                date: dayNum ? new Date(rowDate) : null,
                events: dayEvents
            })

            // move dayCursor by one day
            dayCursor.setDate(dayCursor.getDate() + 1)
        }
        grid.push(rowArr)
    }
    return grid
})

/** Arrow function: handle day-cell click. */
const onDayCellClick = (dateObj: Date) => {
    emit('day-click', dateObj)
}


const dragType = ref<string | null>(null)
const eventId = ref<any | null>(null)

const resetEventData = () => {
    eventId.value = null
    dragType.value = null
}

function onDrop(evt: DragEvent, date: Date) {
    evt.preventDefault()
    if (!evt.dataTransfer) return

    // const dragType = evt.dataTransfer.getData('dragType')
    // if (dragType !== 'event') return

    // const eventId = evt.dataTransfer.getData('eventId')
    // if (!eventId) return

    if (!dragType.value || !eventId.value) {
        resetEventData();
        return
    }

    emit('event-drop', { eventId: eventId.value, date })
    resetEventData();
}

/** Arrow function: handle event click. */
const handleEventClick = (evt: MeetingEvent) => {
    emit('event-click', evt)
}

/** Arrow function: handle event drag start. */
// const onEventDragStart = (event: DragEvent, eventId: string) => {
//     if (!event.dataTransfer) return
//   event.dataTransfer.setData('dragType', 'event')
//   event.dataTransfer.setData('eventId', eventId)
//   event.dataTransfer.dropEffect = 'move'
//   emit('event-drag-start', { event, eventId })

// }
function onEventDragStart(event: DragEvent, eId: string) {
    if (!event.dataTransfer) return
    dragType.value = 'event'
    eventId.value = eId
    // event.dataTransfer.setData('dragType', 'event')
    // event.dataTransfer.setData('eventId', eventId)
    // event.dataTransfer.dropEffect = 'move'
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

.month-grid .month-header {
    background-color: #f1f1f1;
    font-weight: bold;
    text-align: center;
}

.month-grid .month-day-cell {
    width: 120px;
    height: 80px;
    position: relative;
    cursor: pointer;
    text-align: left;
    background-color: #fff;
}

.month-grid .day-number {
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 4px;
}

.event-item {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    /* Number of lines to show */
    line-clamp: 1;
}
</style>