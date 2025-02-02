<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Applicant {{ applicant?.first_name }} Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card style="position: sticky; top: 0px;">
              <v-card-title>Applicant Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">First Name</v-col>
                  <v-col cols="6">{{ applicant?.first_name }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Last Name</v-col>
                  <v-col cols="6">{{ applicant?.last_name }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Email</v-col>
                  <v-col cols="6">{{ applicant?.email }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Phone Number</v-col>
                  <v-col cols="6">{{ applicant?.phone_number ? formatPhone(applicant.phone_number) : ''
                    }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Address</v-col>
                  <v-col cols="6">{{ applicant?.address }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Applicant Type</v-col>
                  <v-col cols="6">{{ applicant?.applicant_type }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Status</v-col>
                  <v-col cols="6">
                    <v-chip :color="statusColor(applicant.status)" dark>
                      {{ applicant?.status }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>Applications</v-card-title>
              <v-card-text>
                <v-data-table :headers="applicationHeaders" :items="applicant.applications" :items-per-page="5"
                  class="elevation-1">
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
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Applicant } from '@/types/recruiting/applicantApplication';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  applicant: {
    type: Object as PropType<Partial<Applicant>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const applicationHeaders = [
  { title: 'Job Title', key: 'job.title', sortable: true },
  { title: 'Submission Source', key: 'submission_source', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Submitted At', key: 'submitted_at', sortable: true },
];

const statusColor = (status: any) => {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Inactive':
      return 'red';
    default:
      return 'grey';
  }
};

const formatPhone = (phoneString: string) => {
  return phoneString.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

const applicationStatusColor = (status: string) => {
  switch (status) {
    case 'Submitted':
      return 'blue';
    case 'Under Review':
      return 'orange';
    case 'Interview Scheduled':
      return 'purple';
    case 'Rejected':
      return 'red';
    case 'Accepted':
      return 'green';
    default:
      return 'grey';
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>