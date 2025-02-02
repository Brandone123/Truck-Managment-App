<template>
  <div>
    <div class="pb-3 grey-background" :style="headerCardStyle">
      <v-card>
        <v-card-title density="compact" color="primary">
          <div class="d-flex justify-space-between flex-grow-1">
            <!-- Navigation Buttons -->
            <div>
              <v-btn color="primary" variant="tonal" density="compact" @click="goToday" class="mr-1">
                Today
              </v-btn>
              <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain" @click="goPrevious"
                class="mr-2" />
              <v-btn color="primary" icon="mdi-chevron-right" variant="plain" density="compact" @click="goNext" />
              <span class="ml-3">{{ titleText }}</span>
            </div>

            <!-- Layout Switcher & Print -->
            <div class="d-flex align-center">
              <v-select v-model="layoutType" :items="['month', 'week', 'day', 'list']" label="Layout" hide-details
                density="compact" style="width: 150px;" variant="outlined" class="mr-3"></v-select>

              <v-btn color="primary" variant="tonal" density="compact" @click="printCalendar">
                Print
              </v-btn>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>


    <!-- LAYOUTS -->
    <div id="calendarContainer">
      <CalendarListLayout v-if="layoutType === 'list'" :sticky-top="stickyTop" :sticky-top-offset="stickyTopOffset" :eventTitleKey="eventTitleKey" :eventStartKey="eventStartKey"
        :eventEndKey="eventEndKey" :events="props.events" :format-time="formatTime" @event-click="onEventClick" />

      <CalendarMonthLayout v-else-if="layoutType === 'month'" :sticky-top="stickyTop" :sticky-top-offset="stickyTopOffset" :eventTitleKey="eventTitleKey"
        :eventStartKey="eventStartKey" :eventEndKey="eventEndKey" :events="props.events" :current-date="currentDate"
        :days-of-week="daysOfWeek" @day-click="handleMonthDayClick" @event-click="onEventClick"
        @event-drag-start="onEventDragStart" @event-drop="onMonthCellDrop" />

      <CalendarWeekLayout v-else-if="layoutType === 'week'" :sticky-top="stickyTop" :sticky-top-offset="stickyTopOffset"
        :eventTitleKey="eventTitleKey" :eventStartKey="eventStartKey" :eventEndKey="eventEndKey" :events="props.events"
        :current-date="currentDate" :days-of-week="daysOfWeek" :day-start-hour="dayStartHour" :day-end-hour="dayEndHour"
        :format-time="formatTime" @cell-click="handleWeekCellClick" @event-click="onEventClick"
        @event-drag-start="onEventDragStart" @event-drop="onWeekCellDrop" />

      <CalendarDayLayout v-else-if="layoutType === 'day'" :sticky-top="stickyTop" :sticky-top-offset="stickyTopOffset"
        :eventTitleKey="eventTitleKey" :eventStartKey="eventStartKey" :eventEndKey="eventEndKey" :events="props.events"
        :current-date="currentDate" :day-start-hour="dayStartHour" :day-end-hour="dayEndHour" :format-time="formatTime"
        :current-date-label="currentDateLabel" @cell-click="handleDayCellClick" @event-click="onEventClick"
        @event-drag-start="onEventDragStart" @event-drop="onDayDrop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Child layouts
import CalendarListLayout from './layouts/ListLayout.vue'
import CalendarMonthLayout from './layouts/MonthLayout.vue'
import CalendarWeekLayout from './layouts/WeekLayout.vue'
import CalendarDayLayout from './layouts/DayLayout.vue'
// interface MeetingEvent {
//   id: string
//   title: string
//   start: Date
//   end: Date
//   color?: string
//   meetingLink?: string
//   isRecurring?: boolean
//   attendees?: string[]
// }



const headerCardStyle = computed(() => {
  return props.stickyTop ? { position: 'sticky', top: `${48 + props.stickyTopOffset}px`, zIndex: 2 } : {}
})


type MeetingEvent = Record<string, any>

type Layout = 'month' | 'week' | 'day' | 'list'
/**
 * PROPS / EMITS
 * 
 * and we emit 'update:events' whenever we change events internally.
 */
// const props = defineProps<{
//   date: Date,
//   startHour: number,
//   endHour: number,
//   currentLayout: Layout,
//   eventStartKey: string,
//   eventEndKey: string,
//   tTitleKey: string,
//   events: MeetingEvent[],
//   stickyPosition: Boolean
// }>()
const props = defineProps({
  date: {
    type: Date,
    required: true
  },
  startHour: {
    type: Number,
    default: 6
  },
  endHour: {
    type: Number,
    default: 19
  },
  currentLayout: {
    type: Object as PropType<Layout>,
    required: true
  },
  eventStartKey: {
    type: String,
    default: 'start'
  },
  eventEndKey: {
    type: String,
    default: 'end'
  },
  eventTitleKey: {
    type: String,
    default: 'title'
  },
  events: {
    type: Array as PropType<MeetingEvent[]>,
    default: () => []
  },
  stickyTop: {
    type: Boolean,
    default: false
  },
  stickyTopOffset: {
    type: Number,
    default: 0,
  }
})

const emit = defineEmits<{
  // Let parent know we changed the events array
  (e: 'update:events', newEvents: MeetingEvent[]): void
  (e: 'click:event', evt: MeetingEvent): void
  (e: 'createEvent', date: Date): void
  (e: 'moveEvent', evt: MeetingEvent): void
  (e: 'update:date', date: Date): void
  (e: 'update:startHour', hour: number): void
  (e: 'update:endHour', hour: number): void
  (e: 'update:currentLayout', layout: string): void

}>()

/***************************************
 * LAYOUT SELECTOR
 ***************************************/
// const layoutType = ref<'month' | 'week' | 'day' | 'list'>('day')

const layoutType = computed({
  get() {
    return props.currentLayout
  },
  set(val) {
    emit('update:currentLayout', val)
  }
})

/***************************************
 * DAYS-OF-WEEK
 ***************************************/
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/***************************************
 * NAVIGATION & TIME
 ***************************************/
// const currentDate = ref<Date | null>(new Date(2025, 0, 2))
// const dayStartHour = 6
// const dayEndHour = 19
const currentDate = computed({
  get() {
    return props.date
  },
  set(val) {
    emit('update:date', val)
  }
})

const dayStartHour = computed({
  get() {
    return props.startHour
  },
  set(val) {
    emit('update:startHour', val)
  }
})


const dayEndHour = computed({
  get() {
    return props.endHour
  },
  set(val) {
    emit('update:endHour', val)
  }
})

const goToday = () => {
  currentDate.value = new Date()
}
const goPrevious = () => {
  if (!currentDate.value) return
  const d = new Date(currentDate.value)
  if (layoutType.value === 'day') {
    d.setDate(d.getDate() - 1)
  } else if (layoutType.value === 'week') {
    d.setDate(d.getDate() - 7)
  } else if (layoutType.value === 'month') {
    d.setMonth(d.getMonth() - 1)
  }
  currentDate.value = d
}
const goNext = () => {
  if (!currentDate.value) return
  const d = new Date(currentDate.value)
  if (layoutType.value === 'day') {
    d.setDate(d.getDate() + 1)
  } else if (layoutType.value === 'week') {
    d.setDate(d.getDate() + 7)
  } else if (layoutType.value === 'month') {
    d.setMonth(d.getMonth() + 1)
  }
  currentDate.value = d
}

/***************************************
 * TITLE TEXT
 ***************************************/
const titleText = computed(() => {
  if (!currentDate.value) return ''
  switch (layoutType.value) {
    case 'day': {
      return currentDate.value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    case 'week': {
      const start = getStartOfWeek(currentDate.value)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return formatDate(start) + ' - ' + formatDate(end)
    }
    case 'month': {
      return currentDate.value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long'
      })
    }
    default:
      return 'All Meetings'
  }
})

/** For Day layout header: e.g. "Thu 1/2" */
const currentDateLabel = computed(() => {
  if (!currentDate.value) return ''
  const d = currentDate.value
  const w = daysOfWeek[d.getDay()].slice(0, 3)
  const m = d.getMonth() + 1
  const dayNum = d.getDate()
  return `${w} ${m}/${dayNum}`
})

/***************************************
 * PRINT
 ***************************************/
const printCalendar = async () => {

  let container: any = document.querySelector('#calendarContainer')
  if (!container) return

  html2canvas(container, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'pt', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const aspect = canvas.width / canvas.height
    const imgHeight = (pageWidth - 20) / aspect

    pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, imgHeight)
    pdf.save('meeting-schedule.pdf')
  })
}



/***************************************
 * UTILS
 ***************************************/
const getStartOfWeek = (d: Date) => {
  const newD = new Date(d)
  const dow = newD.getDay()
  newD.setHours(0, 0, 0, 0)
  newD.setDate(newD.getDate() - dow)
  return newD
}
const formatDate = (d: Date) => {
  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
const formatTime = (d: Date) => {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/***************************************
 * CHILD EVENT HANDLERS
 ***************************************/
const handleMonthDayClick = (dateObj: Date) => {
  emit('createEvent', dateObj)
}
const handleWeekCellClick = ({ date, hour }: { date: Date, hour: number }) => {
  const base = new Date(date)
  base.setHours(hour, 0, 0, 0)
  emit('createEvent', base)
}
const handleDayCellClick = (hour: number) => {
  if (!currentDate.value) return
  const base = new Date(currentDate.value)
  base.setHours(hour, 0, 0, 0)
  emit('createEvent', base)
}

/**
 * CLICK ON EXISTING EVENT -> EDIT
 */
const onEventClick = (evt: MeetingEvent) => {
  // draftEvent.value = { ...evt }
  // isEditMode.value = true
  // showEventDialog.value = true

  emit('click:event', evt)
}

/**
 * DRAG-START
 * (We just capture the event ID if needed. Actual re-dating
 * is done on drop.)
 */
const onEventDragStart = ({ event, eventId }: { event: DragEvent; eventId: string }) => {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('dragType', 'event')
  event.dataTransfer.setData('eventId', eventId)
  event.dataTransfer.dropEffect = 'move'
}


/**
 * WEEK layout drop
 */
const onMonthCellDrop = ({ eventId, date }: { eventId: string; date: Date }) => {
  const idx = props.events.findIndex(e => e.id === eventId)
  if (idx < 0) return

  const ev = { ...props.events[idx] } // copy the event we want to move
  const base = new Date(date)
  base.setHours(ev[props.eventStartKey].getHours(), 0, 0, 0)

  // reassign start/end
  const durationMs = ev[props.eventEndKey].getTime() - ev[props.eventStartKey].getTime()
  ev[props.eventStartKey] = base
  ev[props.eventEndKey] = new Date(base.getTime() + durationMs)

  // emit updated array upward
  emit('moveEvent', ev)
}

/**
 * WEEK layout drop
 */
const onWeekCellDrop = ({ eventId, date, hour }: { eventId: string; date: Date; hour: number }) => {
  const idx = props.events.findIndex(e => e.id === eventId)
  if (idx < 0) return

  const ev = { ...props.events[idx] } // copy the event we want to move
  const base = new Date(date)
  base.setHours(hour, 0, 0, 0)

  // reassign start/end
  const durationMs = ev[props.eventEndKey].getTime() - ev[props.eventStartKey].getTime()
  ev[props.eventStartKey] = base
  ev[props.eventEndKey] = new Date(base.getTime() + durationMs)

  // emit updated array upward
  emit('moveEvent', ev)
}

/**
 * DAY layout drop
 */
const onDayDrop = ({ eventId, hour }: { eventId: string; hour: number }) => {
  if (!currentDate.value) return
  const idx = props.events.findIndex(e => e.id === eventId)
  if (idx < 0) return

  const ev = { ...props.events[idx] }

  const base = new Date(currentDate.value)
  base.setHours(hour, 0, 0, 0)
  const durationMs = ev[props.eventEndKey].getTime() - ev[props.eventStartKey].getTime()
  ev[props.eventStartKey] = base
  ev[props.eventEndKey] = new Date(base.getTime() + durationMs)

  // emit updated array upward
  emit('moveEvent', ev)
}
</script>

<style scoped></style>
