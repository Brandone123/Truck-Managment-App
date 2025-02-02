<template>
    <!-- <div class="calendar-scroll" style="position:relative"> -->
    <table class="calendar-table day-time-grid" style="position:relative;">
        <thead>
            <tr>
                <th :style="(headerStyle as any)" class="time-axis-header">Times</th>
                <th :style="(headerStyle as any)" class="day-main-header">
                    {{ currentDateLabel }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- LEFT TIME-AXIS COLUMN -->
                <td class="time-axis-cell--large">
                    <div class="time-axis-scale">
                        <!-- Background slots -->
                        <template v-for="hour in (hoursArray as any[])" :key="'slot-' + hour">
                            <div v-if="hour <= dayEndHour" class="time-slot" :style="(styleForSlot(hour) as any)">
                            </div>
                        </template>

                        <!-- Hour lines + labels -->
                        <template v-for="hour in hoursArray" :key="'line-' + hour">
                            <div v-if="hour <= dayEndHour" class="hour-line" :style="styleForHourLine(hour)"
                                style="text-align:end; padding:2px;">
                                {{ formatHourLabel(hour) }}
                            </div>
                        </template>
                    </div>
                </td>

                <!-- MAIN DAY CELL -->
                <td class="day-cell-container">
                    <div class="day-cell-content">
                        <!-- Hour lines (dashed) for visual reference -->
                        <div v-for="hour in (hoursArray as any[])" :key="'day-line-' + hour" class="hour-line"
                            :style="(styleForHourLine(hour) as any)">
                        </div>

                        <!-- Droppable time slots -->
                        <template v-for="hour in (hoursArray as any[])" :key="'day-slot-' + hour">
                            <div v-if="hour <= dayEndHour" class="time-slot" @dragover.prevent
                                @click="onSlotClick(hour)" @dragenter="onSlotDragEnter($event, hour)"
                                @drop="onSlotDrop($event, hour)" :class="{ 'slot-hovered': isSlotHovered(hour) }"
                                :style="(styleForSlot(hour) as any)"></div>
                        </template>

                        <!-- Draggable event blocks -->
                        <div v-for="item in (eventsLayoutForDay(currentDateSafe) as any[])" :key="item.event.id"
                            class="event-block" :class="[
                                { 'drag-blocked': isDragging && hoveredEventId != item.event.id },
                                { hovered: hoveredEventId === item.event.id }
                            ]"
                            :style="[(styleForEvent(item.event) as any), styleForOverlap(item.columnIndex, item.columnCount)]"
                            draggable="true" @dragstart="onEventDragStart($event, item.event.id)"
                            @dragend="onEventDragEnd" @click.stop="onEventClick(item.event)"
                            @mouseover="onEventHover(item.event.id)" @mouseleave="onEventHoverEnd">
                            <div class="bg-primary event-item">
                                {{ item.event[eventTitleKey] }}
                                ({{ formatTime(item.event[eventStartKey]) }} – {{
                                    formatTime(item.event[eventEndKey])
                                }})
                            </div>
                            <!-- Extra info -->
                            <!-- <span v-if="item.event.meetingLink" style="display:block;font-size:0.75rem">
                                    Link: {{ item.event.meetingLink }}
                                </span>
                                <span v-if="item.event.isRecurring" style="display:block;font-size:0.75rem">
                                    Recurring
                                </span>
                                <span v-if="item.event.attendees && item.event.attendees.length"
                                    style="display:block;font-size:0.75rem">
                                    Attendees: {{ item.event.attendees.join(', ') }}
                                </span> -->
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

/** Expanded event interface */
type MeetingEvent = Record<string, any>

const props = defineProps<{
    eventStartKey: string
    eventEndKey: string
    eventTitleKey: string
    events: MeetingEvent[]
    currentDate: Date | null
    dayStartHour: number
    dayEndHour: number
    formatTime: (d: Date) => string
    /** A label string for the displayed date (e.g. "Jan 22, 2025") */
    currentDateLabel: string
    stickyTop: boolean
    stickyTopOffset: number
}>()

const emit = defineEmits<{
    (e: 'event-click', evt: MeetingEvent): void
    (e: 'event-drag-start', payload: { event: DragEvent; eventId: string }): void
    (e: 'event-drop', payload: { eventId: string; date: Date; hour: number }): void
    (e: 'cell-click', hour: number): void
}>()


const headerStyle = computed(() => {
    return props.stickyTop ? { position: 'sticky', top: `${110 + props.stickyTopOffset}px`, zIndex: 2 } : {}
})

const onSlotClick = (hour: number) => {
    emit('cell-click', hour)
}

/** Safe fallback for currentDate */
const currentDateSafe = computed(() => {
    return props.currentDate ? props.currentDate : new Date()
})

/** Build an array of hours from dayStartHour..(dayEndHour+1) for slot lines */
const hoursArray = computed(() => {
    const arr: number[] = []
    for (let h = props.dayStartHour; h <= (props.dayEndHour + 1); h++) {
        arr.push(h)
    }
    return arr
})

/** Helper: do these events overlap in time? */
function eventsOverlap(a: MeetingEvent, b: MeetingEvent) {
    return a[props.eventStartKey] < b[props.eventEndKey] && a[props.eventEndKey] > b[props.eventStartKey]
}

/** Filter events that fall on the single day in question */
function eventsForDay(d: Date) {
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setHours(23, 59, 59, 999)

    return props.events.filter(evt => evt[props.eventStartKey] < dayEnd && evt[props.eventEndKey] > dayStart)
}

/**
 * Lay out events for the single day, so that overlapping events
 * can be displayed side-by-side (with columnIndex, columnCount).
 */
function layoutEventsForDay(events: MeetingEvent[]) {
    // 1) Sort by start time
    const sorted = [...events].sort((a, b) => a[props.eventStartKey].getTime() - b[props.eventStartKey].getTime())
    const columns: MeetingEvent[][] = []

    // 2) Build columns
    for (const evt of sorted) {
        let placed = false
        for (const col of columns) {
            const last = col[col.length - 1]
            // If there's no overlap with the last event in this column, place here
            if (!eventsOverlap(last, evt)) {
                col.push(evt)
                placed = true
                break
            }
        }
        // If not placed in existing columns, create a new column
        if (!placed) {
            columns.push([evt])
        }
    }

    // 3) columns.length => total columns
    const columnCount = columns.length

    // 4) Build layout array
    const layout: {
        event: MeetingEvent
        columnIndex: number
        columnCount: number
    }[] = []

    columns.forEach((col, i) => {
        col.forEach(evt => {
            layout.push({
                event: evt,
                columnIndex: i,
                columnCount
            })
        })
    })

    layout.forEach((itemA, i) => {
        const eA = itemA.event
        let overlapCount = 0

        // Compare with every other event in the day
        layout.forEach((itemB, j) => {
            if (i === j) return  // skip itself
            if (eventsOverlap(eA, itemB.event)) {
                overlapCount++
            }
        })

        switch (overlapCount) {
            case 0:
                itemA.columnCount = 1;
                break;
            case 1:
                itemA.columnCount = 2;
                break;
            default:
                //maintain column count
                break;
        }
    })


    // Optional: we could do a second pass if we need to refine columnCount
    // for partial overlaps, but the above approach typically suffices.
    return layout
}

/** Return the final array for rendering in the template */
function eventsLayoutForDay(d: Date) {
    const dayEvents = eventsForDay(d)
    return layoutEventsForDay(dayEvents)
}

/** === DRAG & DROP / HOVER STATE === */
const hoveredSlot = ref<{ hour: number | null }>({ hour: null })
const isDragging = ref(false)
const hoveredEventId = ref<string | null>(null)

function onSlotDragEnter(evt: DragEvent, hour: number) {
    if (!evt.dataTransfer) return
    // const dragType = evt.dataTransfer.getData('dragType')
    // if (dragType !== 'event') return
    hoveredSlot.value = { hour }
}

function isSlotHovered(hour: number) {
    return hoveredSlot.value.hour === hour
}

const dragType = ref<string | null>(null)
const eventId = ref<any | null>(null)

const resetEventData = () => {
    eventId.value = null
    dragType.value = null
}

function onSlotDrop(evt: DragEvent, hour: number) {
    evt.preventDefault()
    hoveredSlot.value = { hour: null }
    isDragging.value = false

    if (!evt.dataTransfer) return

    if (!dragType.value || !eventId.value) {
        resetEventData();
        return
    }

    // const dragType = evt.dataTransfer.getData('dragType')
    // if (dragType.value !== 'event') return

    // const eventId = evt.dataTransfer.getData('eventId')
    // if (!eventId.value) return

    // We emit with the day date + the hour
    emit('event-drop', {
        eventId: eventId.value,
        date: currentDateSafe.value,
        hour
    })

    resetEventData()
}

function onEventDragStart(event: DragEvent, eId: any) {
    if (!event.dataTransfer) return
    isDragging.value = true
    dragType.value = 'event'
    eventId.value = eId
    // event.dataTransfer.setData('dragType', 'event')
    // event.dataTransfer.setData('eventId', eId)
    // event.dataTransfer.effectAllowed = 'move'
    // emit('event-drag-start', { event, eventId: eId })
}

function onEventDragEnd() {
    isDragging.value = false
}

function onEventHover(eventId: string) {
    hoveredEventId.value = eventId
}
function onEventHoverEnd() {
    hoveredEventId.value = null
}

/** EVENT CLICK */
function onEventClick(evt: MeetingEvent) {
    emit('event-click', evt)
}

/** === STYLES & POSITIONING === */
function styleForHourLine(hour: number) {
    const totalHours = (props.dayEndHour + 1) - props.dayStartHour
    const offset = (hour - props.dayStartHour) / totalHours
    return {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${offset * 100}%`,
        borderTop: '1px dashed #ddd'
    }
}

function styleForSlot(hour: number) {
    const totalHours = (props.dayEndHour + 1) - props.dayStartHour
    const offset = hour - props.dayStartHour
    const topFrac = offset / totalHours
    const slotHeightFrac = 1 / totalHours
    return {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${topFrac * 100}%`,
        height: `${slotHeightFrac * 100}%`
    }
}

/** Vertical placement of an event in the day cell */
function styleForEvent(evt: MeetingEvent) {
    const dayStartMins = props.dayStartHour * 60
    const dayEndMins = (props.dayEndHour + 1) * 60

    const startTotalMins = evt[props.eventStartKey].getHours() * 60 + evt[props.eventStartKey].getMinutes()
    const endTotalMins = evt[props.eventEndKey].getHours() * 60 + evt[props.eventEndKey].getMinutes()

    const topMins = Math.max(startTotalMins, dayStartMins)
    const bottomMins = Math.min(endTotalMins, dayEndMins)
    const eventDurationMins = Math.max(bottomMins - topMins, 15)

    const topFrac = (topMins - dayStartMins) / (dayEndMins - dayStartMins)
    const heightFrac = eventDurationMins / (dayEndMins - dayStartMins)

    return {
        position: 'absolute',
        top: `${topFrac * 100}%`,
        height: `${heightFrac * 100}%`,
        // backgroundColor: evt.color ?? '#4285f4',
        color: '#fff',
        padding: '2px 4px',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer'
    }
}

/** If events overlap, offset horizontally & shrink width */
function styleForOverlap(columnIndex: number, columnCount: number) {
    const widthPct = 100 / columnCount
    const leftPct = columnIndex * widthPct
    return {
        width: widthPct + '%',
        left: leftPct + '%'
    }
}

/** Hour label, e.g. "9AM" or "3PM" */
function formatHourLabel(hour: number) {
    const ampm = hour < 12 ? 'AM' : 'PM'
    const h = (hour % 12) || 12
    return `${h}${ampm}`
}
</script>

<style scoped>
/* .calendar-scroll {
    overflow-x: auto;
    border: 1px solid #ddd;
    margin-top: 16px;
} */

/* Adjust as desired for vertical space */
.day-time-grid .time-axis-header {
    width: 60px;
    background-color: #f1f1f1;
    text-align: center;
    font-weight: bold;
}

.day-time-grid .day-main-header {
    background-color: #f1f1f1;
    font-weight: bold;
    text-align: center;
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
    vertical-align: top;
}

/* TIME AXIS CELL */
.time-axis-cell--large {
    width: 60px;
    position: relative;
    vertical-align: top;
    height: 600px;
    /* fixed height for example; adjust as needed */
    background-color: #fafafa;
}

.time-axis-scale {
    position: relative;
    height: 100%;
}

/* MAIN DAY CELL */
.day-cell-container {
    position: relative;
    height: 600px;
    /* match the axis cell for consistent layout */
    width: 400px;
    /* adjust as needed */
    background-color: #fff;
}

.day-cell-content {
    position: relative;
    width: 100%;
    height: 100%;
}

/* The dashed horizontal lines for hours */
.hour-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed #ddd;
}

/* The droppable "slots" for each hour block */
.time-slot {
    position: absolute;
    left: 0;
    right: 0;
}

/* Highlight a hovered slot */
.time-slot.slot-hovered {
    background-color: rgba(30, 144, 255, 0.15);
    transition: background-color 0.2s ease-out;
}

/* EVENT BLOCK */
.event-block {
    position: absolute;
    z-index: 1;
    font-size: 0.75rem;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    transition: left 0.2s, width 0.2s, z-index 0.2s;
    box-sizing: border-box;
}

.event-block.drag-blocked {
    pointer-events: none;
    /* allow drop slots to capture pointer */
}

/* Raise hovered event visually */
/* .event-block.hovered {
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
} */


.event-item {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    /* Number of lines to show */
    line-clamp: 1;

    border-radius: 4px;
    padding: 4px;
    height: 100%;
    width: 100%;
}
</style>