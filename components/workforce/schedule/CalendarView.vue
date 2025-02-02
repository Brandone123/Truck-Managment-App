<template>
  <div>
    <FullCalendar
      :plugins="calendarPlugins"
      :events="calendarEvents"
      :headerToolbar="headerToolbarConfig"
      initialView="dayGridMonth"
      :editable="false"
      :selectable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Schedule } from '@/types/workforce/schedule';

const props = defineProps({
  schedules: {
    type: Array as PropType<Schedule[]>,
    required: true,
  },
});

const calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

const headerToolbarConfig = {
  left: 'prev,next today',
  center: 'title',
  right: 'dayGridMonth,timeGridWeek,timeGridDay',
};

const calendarEvents = computed(() => {
  return props.schedules.map(schedule => ({
    id: schedule.id.toString(),
    title: `${schedule.employee?.full_name || 'Unknown'} - ${schedule.status}`,
    start: schedule.shift && schedule.schedule_date
      ? `${schedule.schedule_date}T${schedule.shift.start_time}`
      : undefined,
    end: schedule.shift && schedule.schedule_date
      ? `${schedule.schedule_date}T${schedule.shift.end_time}`
      : undefined,
    color: getStatusColor(schedule.status),
  })).filter(event => event.start && event.end); // Filter out incomplete events
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return '#1976D2'; // Blue
    case 'Completed':
      return '#4CAF50'; // Green
    case 'Cancelled':
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Grey
  }
};
</script>

<style scoped>
/* Adjust as needed */
</style>
