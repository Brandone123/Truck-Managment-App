<template>
    <!-- <div class="calendar-scroll"> -->
    <table class="calendar-table week-time-grid" style="position: relative;">
        <thead>
            <tr>
                <th :style="(headerStyle as any)" class="time-axis-header">Times</th>
                <th v-for="(day, index) in (weekColumns as any[])" :key="index" :style="(headerStyle as any)"
                    class="week-day-header">
                    {{ formatWeekdayHeader(day[eventStartKey]) }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- Left time-axis cell -->
                <td class="time-axis-cell--large">
                    <div class="time-axis-scale">
                        <!-- <div v-for="hour in hoursArray" :key="hour" class="time-axis-hour"
                                :style="styleForAxisHour(hour)">
                                {{ formatHourLabel(hour) }}
                            </div> -->
                        <template v-for="hour in (hoursArray as any[])">
                            <div v-if="hour <= dayEndHour" :key="hour" class="time-slot"
                                :style="(styleForSlot(hour) as any)">
                            </div>
                        </template>


                        <template v-for="hour in hoursArray" :key="hour">
                            <div v-if="hour <= dayEndHour" class="hour-line" :style="styleForHourLine(hour)"
                                style="text-align:end; padding:2px;">
                                {{ formatHourLabel(hour) }}
                            </div>
                        </template>

                    </div>
                </td>

                <!-- One cell per day -->
                <td v-for="(day, dIndex) in (weekColumns as any[])" :key="dIndex" class="week-day-cell">
                    <div class="day-cell-container">
                        <!-- Hour lines for visual reference -->
                        <div v-for="hour in hoursArray" :key="hour" class="hour-line"
                            :style="(styleForHourLine(hour) as any)"></div>

                        <!-- Time slots (drop targets) -->
                        <div v-for="hour in hoursArray" :key="hour">
                            <div v-if="hour <= dayEndHour" :key="hour" class="time-slot" @dragover.prevent
                                @click="onSlotClick(day[eventStartKey], hour)"
                                @dragenter="onSlotDragEnter($event, dIndex, hour)"
                                @drop="onSlotDrop($event, day[eventStartKey], dIndex, hour)"
                                :class="{ 'slot-hovered': isSlotHovered(dIndex, hour) }"
                                :style="(styleForSlot(hour) as any)">
                            </div>
                        </div>


                        <!-- Draggable event blocks -->
                        <div v-for="item in (eventsLayoutForDay(day[eventStartKey]) as any[])" :key="item.event.id"
                            class="event-block" :class="[
                                { 'drag-blocked': isDragging && hoveredEventId != item.event.id },
                                { hovered: hoveredEventId === item.event.id }
                            ]" :style="[
                                    (styleForEvent(item.event) as any),
                                    styleForOverlap(item.columnIndex, item.columnCount)
                                ]" draggable="true" @dragstart="onEventDragStart($event, item.event.id)"
                            @dragend="onEventDragEnd" @click.stop="onEventClick(item.event)"
                            @mouseover="onEventHover(item.event.id)" @mouseleave="onEventHoverEnd">
                            <div class="bg-primary event-item">
                                <div class="single-line">
                                    {{ item.event[eventTitleKey] }}
                                    ({{ formatTime(item.event[eventStartKey]) }} – {{
                                        formatTime(item.event[eventEndKey])
                                    }})
                                </div>
                            </div>
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

/** Minimal event interface */
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
    stickyTop: boolean
    stickyTopOffset: number
}>()

const emit = defineEmits<{
    (e: 'event-click', evt: MeetingEvent): void
    (e: 'event-drag-start', payload: { event: DragEvent; eventId: string }): void
    (e: 'event-drop', payload: { eventId: string; date: Date; hour: number }): void
    (e: 'cell-click', payload: { date: Date; hour: number }): void
}>()



const headerStyle = computed(() => {
    return props.stickyTop ? { position: 'sticky', top: `${110 + props.stickyTopOffset}px`, zIndex: 2 } : {}
})

const onSlotClick = (date: Date, hour: number) => {
    emit('cell-click', { date, hour })
}


/** 1) Compute the days of the current week */
function getStartOfWeek(d: Date) {
    const clone = new Date(d)
    const dow = clone.getDay() // 0 = Sunday
    clone.setHours(0, 0, 0, 0)
    clone.setDate(clone.getDate() - dow)
    return clone
}

const weekColumns = computed(() => {
    if (!props.currentDate) return []
    const start = getStartOfWeek(props.currentDate)
    const arr = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        arr.push({ start: d })
    }
    return arr
})

/** 2) Build array of hours from dayStartHour..dayEndHour */
const hoursArray = computed(() => {
    const arr: number[] = []
    for (let h = props.dayStartHour; h <= (props.dayEndHour + 1); h++) {
        arr.push(h)
    }
    return arr
})

/** 3) Filter events that fall on a given date */
function eventsForDay(dayStart: Date) {
    const dayDateOnly = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth(),
        dayStart.getDate(),
        0, 0, 0, 0
    )
    const dayEnd = new Date(dayDateOnly)
    dayEnd.setHours(23, 59, 59, 999)
    return props.events.filter(
        evt => evt[props.eventStartKey] < dayEnd && evt[props.eventEndKey] > dayDateOnly
    )
}

/**
 * Place events in columns if they partially overlap
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
            // If there's no overlap, place this event in the column
            if (!eventsOverlap(last, evt)) {
                col.push(evt)
                placed = true
                break
            }
        }
        if (!placed) {
            // Couldn’t place in existing column => create a new column
            columns.push([evt])
        }
    }

    // 3) columns.length => total number of columns
    const columnCount = columns.length

    // 4) Build the initial layout array with placeholders
    const layout: {
        event: MeetingEvent
        columnIndex: number
        columnCount: number
    }[] = []

    columns.forEach((col, i) => {
        for (const e of col) {
            layout.push({
                event: e,
                columnIndex: i,
                columnCount,      // we’ll fill this in below
            })
        }
    })

    // 5) Second pass: set overlap & overlapCount
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

    return layout
}

/** Return true if event a and b partially overlap in time. */
function eventsOverlap(a: MeetingEvent, b: MeetingEvent) {
    return a[props.eventStartKey] < b[props.eventEndKey] && a[props.eventEndKey] > b[props.eventStartKey]
}

/** 
 * For each day, return array of { event, columnIndex, columnCount }
 * to render side-by-side if partial overlap.
 */
function eventsLayoutForDay(dayStart: Date) {
    const dayEvents = eventsForDay(dayStart)
    return layoutEventsForDay(dayEvents)
}

/** 
 * styleForOverlap:
 * - horizontally offset by columnIndex
 * - shrink width to 1/columnCount
 */
function styleForOverlap(columnIndex: number, columnCount: number) {
    const widthPct = 100 / columnCount
    const leftPct = columnIndex * widthPct
    return {
        width: widthPct + '%',
        left: leftPct + '%'
    }
}


function styleForHourLine(hour: number) {
    const totalHours = (props.dayEndHour + 1) - props.dayStartHour
    const offset = (hour - props.dayStartHour) / totalHours
    return {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${offset * 100}%`,
        borderTop: '1px solid #ddd'
    }
}

function styleForSlot(hour: number) {
    const totalHours = (props.dayEndHour + 1) - props.dayStartHour
    const offset = hour - props.dayStartHour
    const topFrac = offset / totalHours
    const slotHeightFrac = 1 / totalHours
    return {
        position: 'absolute',
        top: `${topFrac * 100}%`,
        height: `${slotHeightFrac * 100}%`
    }
}

/** 6) Drag/Drop state, highlighting */
const hoveredSlot = ref<{ dayIndex: number | null; hour: number | null }>({
    dayIndex: null,
    hour: null
})
const isDragging = ref(false)  // So we can disable pointer on events
const hoveredEventId = ref<string | null>(null)  // So we can raise z-index of hovered event

function onSlotDragEnter(evt: DragEvent, dIndex: number, hour: number) {
    if (!evt.dataTransfer) return
    // const dragType = evt.dataTransfer.getData('dragType')
    // if (dragType !== 'event') return
    hoveredSlot.value = { dayIndex: dIndex, hour }
}

function isSlotHovered(dIndex: number, hour: number) {
    return (
        hoveredSlot.value.dayIndex === dIndex &&
        hoveredSlot.value.hour === hour
    )
}

const dragType = ref<string | null>(null)
const eventId = ref<any | null>(null)

const resetEventData = () => {
    eventId.value = null
    dragType.value = null
}

function onSlotDrop(evt: DragEvent, dayStart: Date, dIndex: number, hour: number) {
    evt.preventDefault()
    hoveredSlot.value = { dayIndex: null, hour: null }
    isDragging.value = false

    if (!evt.dataTransfer) return
    // const dragType = evt.dataTransfer.getData('dragType')

    // if (dragType !== 'event') return

    // const eventId = evt.dataTransfer.getData('eventId')
    // if (!eventId) return

    if (!dragType.value || !eventId.value) {
        resetEventData();
        return
    }

    emit('event-drop', { eventId: eventId.value, date: dayStart, hour })
    resetEventData();
}

/** 7) DRAGSTART: store data, set isDragging */
const onEventDragStart = (event: DragEvent, eId: string) => {
    if (!event.dataTransfer) return
    isDragging.value = true
    dragType.value = 'event'
    eventId.value = eId
    // event.dataTransfer.setData('dragType', 'event')
    // event.dataTransfer.setData('eventId', eId)
    // // event.dataTransfer.effectAllowed = 'move'
    // event.dataTransfer.dropEffect = 'move'
}

/** 8) DRAGEND: restore isDragging */
function onEventDragEnd(evt: DragEvent) {
    isDragging.value = false
}

/** 9) Hovering an event => bring to front via z-index */
function onEventHover(eventId: string) {
    hoveredEventId.value = eventId
}
function onEventHoverEnd() {
    hoveredEventId.value = null
}

/** styleForEvent: vertical position */
function styleForEvent(evt: MeetingEvent) {
    const dayStartHour = props.dayStartHour
    const dayEndHour = (props.dayEndHour + 1)
    const dayStartMins = dayStartHour * 60
    const dayEndMins = dayEndHour * 60

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
        backgroundColor: 'transparent',
        color: '#fff',
        borderRadius: '4px',
        padding: '2px 4px',
        overflow: 'hidden',
        cursor: 'pointer'
    }
}

/** EVENT CLICK */
function onEventClick(evt: MeetingEvent) {
    emit('event-click', evt)
}

/** FORMATTERS */
function formatWeekdayHeader(d: Date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `${days[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`
}
function formatHourLabel(hour: number) {
    const ampm = hour < 12 ? 'AM' : 'PM'
    const h = (hour % 12) || 12
    return `${h}${ampm}`
}
</script>

<style scoped>
.calendar-scroll {
    overflow-x: auto;
    border: 1px solid #ddd;
    /* max-height: 600px;
    margin-top: 16px; */
}

.calendar-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    min-width: 900px;
}

.calendar-table th,
.calendar-table td {
    border: 0.2px solid gainsboro;
    vertical-align: top;
}

/* HEADERS */
.week-time-grid .time-axis-header {
    width: 60px;
    background-color: #f1f1f1;
    text-align: center;
    font-weight: bold;
}

.week-time-grid .week-day-header {
    background-color: #f1f1f1;
    font-weight: bold;
    text-align: center;
}

/* Day cell area (600px tall) */
.week-day-cell {
    position: relative;
    height: 600px;
    width: 120px;
}

.day-cell-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
}

/* Dashed lines for each hour */
.hour-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed #ddd;
}

/* Left side hours column */
.time-axis-cell--large {
    width: 60px;
    position: relative;
    vertical-align: top;
    height: 600px;
    background-color: #fafafa;
}

.time-axis-scale {
    position: relative;
    height: 100%;
}

.time-axis-hour {
    font-size: 0.8rem;
    pointer-events: none;
}

/* The droppable "slots" for each hour block */
.time-slot {
    position: absolute;
    left: 0;
    right: 0;
}

.time-slot.slot-hovered {
    background-color: rgba(30, 144, 255, 0.15);
    transition: background-color 0.2s ease-out;
}

/* EVENT BLOCKS */
.event-block {
    position: absolute;
    z-index: 1;
    /* normal */
    font-size: 0.75rem;
    /* border-radius: 4px; */
    padding: 10px;
    color: #fff;
    cursor: pointer;
    transition: left 0.2s, width 0.2s, z-index 0.2s;
}

/* While dragging an event, disable pointer events on all events so drop slots are accessible. */
.event-block.drag-blocked {
    pointer-events: none;
}

/* On hover, bring event to front with high z-index */
/* .event-block.hovered {
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
} */

.event-item {
    border-radius: 4px;
    padding: 4px;
    height: 100%;
    width: 100%;
}

.single-line {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    /* Number of lines to show */
    line-clamp: 1;
}
</style>