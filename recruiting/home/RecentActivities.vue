<template>
  <div>
     <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Recent Activities</span>
    </div>
      <v-card>
        <v-card-text>
          <v-timeline density="compact">
            <v-timeline-item v-for="(activity,index) in activities" :key="index" :dot-color="activity.color" size="small">
              <v-alert :color="activity.color" :icon="activity.icon"  :value="true" density="compact">
                {{ activity.title }}
                <div class="text-subtitle">{{ activity.date }}</div>
              </v-alert>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    <!-- <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-card class="pa-2" elevation="2">
          <div dense>
            <v-card-text v-for="activity in activities" :key="activity.id">
              <div>
                <v-icon>{{ activity.icon }}</v-icon> <span>{{ activity.title }}</span>
                <div>{{ activity.date }}</div>
              </div>
            </v-card-text>
          </div>
        </v-card>
      
      </v-col>
    </v-row> -->
  </div>
 
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  interface RecentActivity {
    id: number;
    title: string;
    date: string;
    icon: string;
    color: string;
  }
  
  export default defineComponent({
    name: 'RecentActivities',
    data() {
      return {
        activities: [
          { id: 1, title: 'New application received for Truck Driver', date: '2023-03-20', icon: 'mdi-truck', color: 'primary' },
          { id: 2, title: 'Interview scheduled with John Doe', date: '2023-03-22', icon: 'mdi-calendar-clock', color: 'green' },
          { id: 3, title: 'Job posting updated for Maintenance Technician', date: '2023-03-18', icon: 'mdi-update', color: 'primary' },
          // Add more activities as needed
        ] as RecentActivity[],
      };
    },
  });
  </script>
  
  <style scoped>
  /* Style adjustments for customization */
  </style>
  