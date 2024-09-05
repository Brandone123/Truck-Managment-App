<template>
    <v-calendar v-model:focus="focus" :type="type" :events="events" @click:event="handleEventClick">
      <template v-slot:event="{ event }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on" class="event">{{ event.name }}</div>
          </template>
          <span>{{ event.details }}</span>
        </v-tooltip>
      </template>
    </v-calendar>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { Task } from '~/types/maintenance/taskTypes'; // Use type-only import
  
  const props = defineProps({
    tasks: {
      type: Array as () => Task[],
      required: true,
    },
  });
  
  const focus = ref(new Date().toISOString().substr(0, 10)); // Ensure the focus is in ISO format
  const type = ref('month');
  
  const events = computed(() => {
    return props.tasks.map(task => ({
      name: task.task_type,
      start: new Date(task.scheduled_datetime), // Convert to Date object
      end: new Date(task.scheduled_datetime),   // Convert to Date object
      details: `${task.asset_name} - ${task.technician}`,
    }));
  });
  
  const emit = defineEmits(['task-click']);
  
  const handleEventClick = (event) => {
    emit('task-click', event);
  };
  </script>
  
  <style scoped>
  .event {
    cursor: pointer;
  }
  </style>
  