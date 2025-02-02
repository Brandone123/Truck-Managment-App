<!-- src/components/recruiting/ApplicationDetailDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="900px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title>Application Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Applicant Name"
                  :value="applicantName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Job Title"
                  :value="application.job?.title"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Submission Source"
                  v-model="currentApplication.submission_source"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Status"
                  :items="statusOptions"
                  v-model="currentApplication.status"
                  disabled
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Submitted At"
                  :value="formatDate(currentApplication.submitted_at)"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
  
            <v-divider class="my-4"></v-divider>
  
            <h3>Responses</h3>
            <v-data-table
              :headers="responseHeaders"
              :items="currentApplication.responses"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.field_value="{ item }">
                <span>{{ item.field_value }}</span>
              </template>
            </v-data-table>
  
            <v-divider class="my-4"></v-divider>
  
            <h3>Documents</h3>
            <v-data-table
              :headers="documentHeaders"
              :items="currentApplication.documents"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.file_path="{ item }">
                <a :href="item.file_path" target="_blank">View Document</a>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed, watch } from 'vue';
  import type { Application } from '@/types/recruiting/applicantApplication';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    application: {
      type: Object as PropType<Application | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const currentApplication = computed(() => props.application);
  
  const applicantName = computed(() => {
    if (props.application?.applicant) {
      return `${props.application.applicant.first_name} ${props.application.applicant.last_name}`;
    }
    return '';
  });
  
  const statusOptions = ['Submitted', 'Under Review', 'Interview Scheduled', 'Rejected', 'Accepted'];
  
  const responseHeaders = [
    { title: 'Field Name', key: 'field_name', sortable: true },
    { title: 'Field Value', key: 'field_value', sortable: false },
  ];
  
  const documentHeaders = [
    { title: 'Document Type', key: 'document_type', sortable: true },
    { title: 'File', key: 'file_path', sortable: false },
  ];
  
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  