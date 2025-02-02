<template>
  <v-dialog v-model="dialog" max-width="1000px" scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Schedule Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="text-primary">Summary</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Title</v-col>
                  <v-col cols="12" md="6">{{
                    schedule.title
                  }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Status</v-col>
                  <v-col cols="12" md="6">{{
                    schedule.status
                  }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Duration</v-col>
                  <v-col cols="12" md="6">{{
                    formatTime(schedule.start)
                  }} - {{
                      formatTime(schedule.end)
                    }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title class="text-primary">Applicants</v-card-title>
              <v-card-text>
                <v-data-table :items="(schedule.applications ?? [])" :headers="applicationHeaders">
                  <template v-slot:item.applicant="{ item }">
                    {{ item.applicant?.first_name }} {{ item.applicant?.middle_name }} {{ item.applicant?.last_name }}
                  </template>

                  <template v-slot:item.status="{ item }">
                    <v-chip :color="applicationStatusColor(item.status)" dark>
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false" color="error">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="edit" color="secondary">Edit</v-btn>
        <v-btn @click="deleteSchedule" color="secondary">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { OrientationSchedule } from '@/types/recruiting/onboardingOrientation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  schedule: {
    type: Object as PropType<Partial<OrientationSchedule>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'edit', 'delete']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});


const formatTime = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
};

const applicationHeaders = ref([
  { title: 'Application ID', key: 'id' },
  { title: 'Application Status', key: 'status' },
  { title: 'Applicant Name', key: 'applicant.first_name' },
  { title: 'Applicant Email', key: 'applicant.email_address' },
  { title: 'Applicant Phone', key: 'applicant.cell_phone' },
])

const applicationStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Inactive':
      return 'red';
    default:
      return 'grey';
  }
};

const edit = () => {
  dialog.value = false
  emit('edit')
}

const deleteSchedule = () => {
  emit('delete', props.schedule.id)
  dialog.value = false
}
</script>

<style scoped>
/* Add your styles here */
</style>