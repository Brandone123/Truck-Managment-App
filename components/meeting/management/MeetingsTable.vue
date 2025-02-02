<template>
  <v-data-table
    :headers="headers"
    :items="meetings"
    :loading="loading"
    class="elevation-1"
    :items-per-page="10"
    item-key="id"
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Search Meetings"
        append-icon="mdi-magnify"
        single-line
        hide-details
      />
    </template>

    <template #item.title="{ item }">
      <!-- If there's a route for meeting details, link here -->
      <v-btn variant="text" color="primary" :to="`/meeting/MeetingManagement/${item.id}`">
        {{ item.title }}
      </v-btn>
    </template>

    <template #item.type="{ item }">
      <span>{{ item.type }}</span>
      <span v-if="item.type === 'Departmental' && item.department">
        ({{ item.department }})
      </span>
    </template>

    <template #item.date="{ item }">
      {{ formatDate(item.date) }}
    </template>

    <template #item.actions="{ item }">
      <v-btn color="info" small @click="$emit('edit-meeting', item)">
        <v-icon left>mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn color="red" small @click="$emit('delete-meeting', item)">
        <v-icon left>mdi-delete</v-icon>
        Delete
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Meeting } from '@/types/meeting/meeting';
import { defineProps, defineEmits } from 'vue';

// Props
interface Props {
  meetings: Meeting[];
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['edit-meeting', 'delete-meeting']);

const search = ref('');

// Table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Type', value: 'type' },
  { title: 'Date', value: 'date' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// If you need filtering on the table items:
const filteredMeetings = computed(() => {
  if (!search.value.trim()) {
    return props.meetings;
  }
  return props.meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(search.value.toLowerCase()),
  );
});

/**
 * Optional: Format date to a more readable string.
 * For real apps, consider date-fns or dayjs, or use <v-menu> + <v-text-field> combos for date/time pickers.
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<style scoped>
/* Add any table-specific styling here */
</style>
