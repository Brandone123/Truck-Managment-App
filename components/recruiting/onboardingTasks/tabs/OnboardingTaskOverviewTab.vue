<template>
  <v-container>
    <v-row v-if="task">
      <v-col cols="12" md="6">
        <h3>Task Information</h3>
        <p><strong>Task Name:</strong> {{ task?.task_name || 'N/A' }}</p>
        <p><strong>Status:</strong> {{ task?.status || 'N/A' }}</p>
        <p><strong>Due Date:</strong> {{ formatDate(task?.due_date) }}</p>
        <p><strong>Description:</strong> {{ task?.description || 'N/A' }}</p>
      </v-col>
      <v-col cols="12" md="6">
        <h3>Application Details</h3>
        <p><strong>Application ID:</strong> #{{ task?.application_id || 'N/A' }}</p>
        <p><strong>Job Title:</strong> {{ getJobTitle(task?.application_id) }}</p>
        <p><strong>Applicant:</strong> {{ getApplicantName(task?.application_id) }}</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h3>Task History</h3>
        <v-data-table
          :headers="historyHeaders"
          :items="taskHistory"
          :loading="loadingTaskHistory"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <v-alert type="info" border="start" colored-border>
              No task history available.
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import type { OnboardingTask } from '@/types/recruiting/onboardingOrientation'; 
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { OnboardingOrientationTaskStore } from '~/stores/recruiting/onboardingOrientation/orientationTaskStore';

const props = defineProps({
  task: {
    type: Object as PropType<OnboardingTask | null>,
    required: true,
  },
});

const applicantApplicationStore = ApplicantApplicationStore();
const { applications, applicants } = storeToRefs(applicantApplicationStore);

const onboardingStore = OnboardingOrientationTaskStore();
const { onboardingTasks, loadingOnboardingTasks } = storeToRefs(onboardingStore);

// Headers for the task history table
const historyHeaders = [
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Task Name', key: 'task_name', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
];

// Compute the task history from the list of onboarding tasks
// For example: all tasks for the same application except the current one
const taskHistory = computed<OnboardingTask[]>(() => {
  if (!props.task || !props.task.application_id) return [];
  return onboardingTasks.value.filter(
    (t) => t.application_id === props.task!.application_id && t.id !== props.task!.id
  );
});

const loadingTaskHistory = computed(() => loadingOnboardingTasks.value);

// Function to get applicant name by application ID
const getApplicantName = (applicationId?: number) => {
  if (!applicationId) return 'N/A';
  const application = applications.value.find((app) => app.id === applicationId);
  if (application) {
    const applicant = applicants.value.find((applicant) => applicant.id === application.applicant_id);
    return applicant ? `${applicant.first_name} ${applicant.last_name}` : 'N/A';
  }
  return 'N/A';
};

// Function to get job title by application ID
const getJobTitle = (applicationId?: number) => {
  if (!applicationId) return 'N/A';
  const application = applications.value.find((app) => app.id === applicationId);
  return application && application.job ? application.job.title : 'N/A';
};

// Function to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString();
};

onMounted(async () => {
  // Fetch all onboarding tasks so we can derive the history from them
  await onboardingStore.fetchOnboardingTasks();

  // Also fetch applications and applicants if needed
  if (!applications.value.length) {
    await applicantApplicationStore.fetchApplications();
  }
  if (!applicants.value.length) {
    await applicantApplicationStore.fetchApplicants();
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
