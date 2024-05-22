<template>
    <v-card>
      <v-card-title>Meetings Calendar</v-card-title>
      <v-card-text>
        <v-calendar
          v-model="focus"
          :events="meetings"
          :event-color="getEventColor"
          @click:event="showMeetingDetails"
        ></v-calendar>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const focus = ref(new Date().toISOString().substr(0, 10)); // Today's date for calendar focus
  const router = useRouter();
  
  const meetings = ref([
    // Example meeting events
    {
      name: 'Weekly Operations Meeting',
      start: new Date().toISOString().substr(0, 10) + 'T10:00:00',
      end: new Date().toISOString().substr(0, 10) + 'T12:00:00',
      details: 'Discuss weekly operations, logistics, and upcoming projects.',
      color: 'blue',
      id: 1,
    },
    // Add more meetings as necessary
  ]);
  
  // Function to determine the color of events on the calendar
  const getEventColor = (event) => {
    return event.color || 'green';
  };
  
  // Function to handle the event when a meeting is clicked
  const showMeetingDetails = (event) => {
    console.log('Meeting clicked:', event);
    router.push({ name: 'meeting-details', params: { id: event.id }});
  };
  </script>
  
  <style scoped>
  /* Style adjustments if needed */
  </style>
  