<template>
    <v-card outlined>
      <v-card-title>
        Upcoming Safety Meetings
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="navigateToMeetingsPage">View All</v-btn>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="meeting in upcomingMeetings" :key="meeting.id" @click="goToMeetingDetail(meeting.id)">
            <v-list-item-icon>
              <v-icon color="info">mdi-calendar-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ meeting.date }} - {{ meeting.topic }}</v-list-item-title>
              <v-list-item-subtitle>{{ meeting.summary  }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Sample data - replace with actual meeting data fetching logic
  const upcomingMeetings = ref([
    {
      id: 1,
      date: '2024-04-05',
      topic: 'Quarterly Safety Review',
      summary: 'Review of the past quarter’s safety incidents and upcoming safety initiatives.',
    },
    {
      id: 2,
      date: '2024-05-10',
      topic: 'New Safety Protocols Training',
      summary: 'Introduction and training on new safety protocols for all drivers.',
    },
    // Add more meetings as necessary
  ]);
  
  const router = useRouter();
  
  // Truncate function for long summaries
  const truncate = (text, length = 100) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };
  
  // Navigation to meeting detail view
  const goToMeetingDetail = (id) => {
    router.push({ name: 'meeting-detail', params: { id } }); // Ensure the route and params match your app's configuration
  };
  
  // Navigation to all meetings view
  const navigateToMeetingsPage = () => {
    router.push({ name: 'meetings' }); // Adjust route name as needed
  };
  </script>
  
  <script>
  export default {
    filters: {
    //  truncate,
    },
  };
  </script>
  
  <style scoped>
  /* Add styling as needed */
  </style>
  