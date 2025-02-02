<template>
  <SharedUiServerTable :filters="filtersTask" :items="tasks" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="totalOnboardingTasks" dynamicSearch>

    <template v-slot:item.actions="{ item, index }">
      <div class="d-flex">
        <!-- <span style="cursor: pointer;" class="mr-2">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-account-plus</v-icon>
          <v-tooltip activator="parent" location="top">
            Assign Supervisor
          </v-tooltip>
        </span> -->

        <span style="cursor: pointer;" class="mr-2">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit task
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item.id)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete task
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
    </template>

    <template v-slot:item.application_id="{ item }">
      <span style="cursor: pointer; border-bottom: 1px dotted"
      class="text-secondary font-weight-bold" @click="viewApplication(item.application_id)">#{{ item.application_id }}</span>
    </template>

    <template v-slot:item.application="{ item }">
      <DynamicApplicationItem v-if="item.application_id" :application="item.application" />
    </template>

    <!-- <template v-slot:item.assigned_to="{ item }">
      <SharedTableDynamicTechnicianItem :technician="item.assignee" v-if="item.assignee" />
    </template> -->
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import type { OnboardingTask } from '@/types/recruiting/onboardingOrientation';
import { OnboardingOrientationTaskStore } from '~/stores/recruiting/onboardingOrientation/orientationTaskStore';
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { storeToRefs } from 'pinia';
import DynamicApplicationItem from '../applicationManagement/components/DynamicApplicationItem.vue';
import { useRouter } from 'vue-router';
import type { filterItem } from '@/types/layout/table'

const router = useRouter();


const props = defineProps({
  tasks: {
    type: Array as PropType<OnboardingTask[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view', 'edit', 'delete', 'update:pagination']);

// const filtersTask = ref<filterItem[]>([]);
const selectedItems = ref<Array<any>>([]);
const hoveredRow = ref<number | null>(null);

const onboardingStore = OnboardingOrientationTaskStore();
const { pagination: onboardingTaskPagination, totalOnboardingTasks } = storeToRefs(onboardingStore);

const pagination = computed({
  get() {
    return onboardingTaskPagination.value;
  },
  set(value) {
    onboardingStore.setPagination(value);
  }
});

const selectedFilters = ref<Record<string, any>>({});
const activeFilter = ref<string>('all');

const tableHeaders = [
  { title: 'Application', key: 'application_id', sortable: true },
  { title: 'Applicant', key: 'application', sortable: true },
  { title: 'Task Name', key: 'task_name', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Due Date', key: 'due_date', sortable: true },
  // { title: 'Assigned To', key: 'assigned_to', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

const applicantApplicationStore = ApplicantApplicationStore();
const { applications, applicants } = storeToRefs(applicantApplicationStore);

// Fetch applications and applicants if not already fetched
if (!applications.value.length) {
  applicantApplicationStore.fetchApplications();
}
if (!applicants.value.length) {
  applicantApplicationStore.fetchApplicants();
}

// Function to get application details by ID
const getApplicationDetails = (applicationId: number) => {
  const application = applications.value.find(app => app.id === applicationId);
  if (application) {
    const applicant = applicants.value.find(a => a.id === application.applicant_id);
    return applicant ? `#${application.id} - ${applicant.first_name} ${applicant.last_name}` : `#${application.id}`;
  }
  return 'N/A';
};


const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  }

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0]
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all') {
    payload['filters'].status = activeFilter.value
  }

  return payload
})

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

defineExpose({
  searchQuery,
  setSelectedItems
})

// Function to determine chip color based on status
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'not started':
      return 'purple';
    case 'in progress':
      return 'secondary';
    case 'completed':
      return 'primary';
    default:
      return 'grey';
  }
};

// function initializeFilters() {
//   filtersTask.value = [
//     {
//       title: "Filter by applicant",
//       key: "application?.applicant_id",
//       items: props.tasks.map((task: OnboardingTask) => { 
//         return { 
//           text: `${task.application?.applicant?.first_name} ${task.application?.applicant?.last_name}`, 
//           value: task.application?.applicant?.id as any
//         };
//       }),
//       width: "300px",
//     },
//   ];
// }

const filtersTask = computed(() => {
    return [
        {
          title: "Filter by applicant",
          key: "application?.applicant.id",
            items: props.tasks.map((task: OnboardingTask) => { 
              return { 
                text: `${task.application?.applicant?.first_name} ${task.application?.applicant?.last_name}`, 
                value: task.application?.applicant?.id as any
              };
            }),
            width: '300px'
        },
    ] as filterItem[]
})

const viewApplication = (application_id: number) => {
  router.push(`/recruiting/applicationManagement/Applications/${application_id}`); // Ensure the route and params match your app's configuration
};

// watchEffect(() => {
//   if (props.tasks) {
//     initializeFilters();
//   }
// });
</script>

<style scoped>
/* Add your styles here */
</style>
