h<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>
          Job Template Details
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container style="max-width: 1000px;">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">Date Created</v-col>
                <v-col cols="12" md="6">{{
                  job.created_at?.substring(0, 10)
                }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Created by</v-col>
                <v-col cols="12" md="6">
                  <SharedTableDynamicTechnicianItem v-if="job.creator" :technician="job.creator" />
                  <span v-else>N/A</span>
                </v-col>
              </v-row>

              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Status</v-col>
                <v-col cols="12" md="6">
                  <v-chip :color="statusColor(job.status)" dark>
                    {{ job.status }}
                  </v-chip>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
          <v-card class="mt-3">
            <v-card-text>
              <QuillPreview :html="job.html || ''" />
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { Job } from '@/types/recruiting/jobManagement';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  job: {
    type: Object as PropType<Partial<Job>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Helper to determine chip color based on status
const statusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'green';
    case 'Closed':
      return 'red';
    case 'Pending':
      return 'orange';
    default:
      return 'grey';
  }
};
</script>

<style scoped>
</style>
