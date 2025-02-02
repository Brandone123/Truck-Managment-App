<!-- src/components/recruiting/ApplicantsList.vue -->

<template>
  <SharedUiServerTable class="custom-table" :items="schedules" :headers="tableHeaders"
    :loading="loadingOrientationSchedules" :show-footer-in-head="false" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="applicantScheduleTotalItems" show-expand dynamicSearch>

    <template v-slot:filters>
      <div class="d-inline-flex">
        <SharedDateRangePicker color="primary" variant="solo" density="compact" hide-details v-model="dateRange"
          label="Select Range" style="width: 300px" />
      </div>
    </template>


    <template v-slot:item.upcoming_schedule="{ item }">
      <div class="d-inline-flex">
        <v-chip v-for="(upcomingSchedule, i) in getUpcomingSchedules(item.applications)">
          {{ upcomingSchedule.title }} ({{ formatTime(upcomingSchedule.start) }} - {{
            formatTime(upcomingSchedule.end) }})
        </v-chip>
      </div>
    </template>

    <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
      <tr class="grey-background nested-row">
        <td :colspan="columns.length" class="grey-background">
          <v-card flat>
            <v-card-title>Schedules</v-card-title>
            <v-data-table class="nested-table" :headers="scheduleHeaders" :items="getSchedules(item.applications)">
              <template v-slot:item.start="{ item }">{{ formatTime(item.start) }}</template>
              <template v-slot:item.end="{ item }">{{ formatTime(item.end) }}</template>
            </v-data-table>
          </v-card>
        </td>
      </tr>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import type { Applicant } from '@/types/recruiting/applicantApplication';
import { storeToRefs } from 'pinia';
import moment from 'moment';

interface DateRange {
  start: String
  end: String
}
const props = defineProps({
  applicantSchedules: {
    type: Array as PropType<Applicant[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view', 'edit', 'delete', 'update:pagination']);

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

// Create a Date for 7:00 AM today
const startDate = new Date()
startDate.setHours(7, 0, 0, 0)  // 7:00 AM, zero out minutes/seconds/ms

// Create a Date for 7 days from now at 7:00 PM
const endDate = new Date()
endDate.setDate(endDate.getDate() + 7)  // Add 7 days
endDate.setHours(19, 0, 0, 0)          // 7:00 PM, zero out minutes/seconds/ms

// Store them in a ref
const dateRange = ref<DateRange>({
  start: startDate.toISOString(),
  end: endDate.toISOString(),
})

const orientationStore = OnboardingOrientationScheduleStore();
const { loadingOrientationSchedules, applicantSchedulePagination, applicantScheduleTotalItems } = storeToRefs(orientationStore);

const pagination = computed({
  get() {
    return applicantSchedulePagination.value;
  },
  set(value) {
    orientationStore.setApplicantSchedulePagination(value);
  },
});

const schedules = computed(() => {
  return (props.applicantSchedules || []).map((applicant: Record<string, any>) => {
    // Calculate total schedules across all applications for this applicant
    const schedulesCount = applicant.applications.reduce((sum: number, application: Record<string, any>) => {
      return sum + application.schedules.length;
    }, 0);

    // Return a new object with all original fields plus the schedulesCount
    return {
      ...applicant,
      schedules_count: schedulesCount
    };
  });
})

const selectedFilters = ref<Record<string, any>>({});

const activeFilter = ref<string>('all');

const formatTime = (d: string) => {
  return moment(d).format('MMM Do, h:mm A')
}

const tableHeaders = [
  { title: 'First Name', key: 'first_name', sortable: true },
  { title: 'Middle Name', key: 'middle_name', sortable: true },
  { title: 'Last Name', key: 'last_name', sortable: true },
  { title: 'Email', key: 'email_address', sortable: true },
  { title: 'Primary Phone', key: 'primary_phone', sortable: true },
  { title: 'Schedules Count', key: 'schedules_count', sortable: false },
  { title: 'Upcoming Schedule', key: 'upcoming_schedule', sortale: false }
];

const scheduleHeaders = ref([
  { title: 'Application ID', key: 'application_id', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Start', key: 'start', sortable: true },
  { title: 'End', key: 'end', sortable: true },
  // { title: 'Actions', key: 'actions', sortable: false, width: '150px', align: 'end' },
]);


const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  };

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0];
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search;
  }

  payload['filters'] = {};

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value;
  }

  return payload;
});



const getSchedules = (applications: any[]) => {
  return (applications || []).flatMap(app =>
    app.schedules.map((schedule: any) => ({
      ...schedule,
      application_id: app.id
    }))
  );
}

const getUpcomingSchedules = (applications: any[]) => {
  const now = new Date();

  return (applications || []).flatMap(app => {
    if (!app.schedules || app.schedules.length === 0) {
      return []; // No schedules for this application
    }

    // Filter schedules that are in the future
    const upcomingSchedules = app.schedules.filter((schedule: any) => new Date(schedule.start) >= now);

    if (upcomingSchedules.length === 0) {
      return []; // No upcoming schedules for this application
    }

    // Find the schedule with the closest start date
    const closestSchedule = upcomingSchedules.reduce((prev: any, current: any) => {
      return new Date(prev.start) < new Date(current.start) ? prev : current;
    });

    return closestSchedule ? [{
      ...closestSchedule,
      application_id: app.id
    }] : []
  });
}

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
};

defineExpose({
  searchQuery,
  setSelectedItems,
  dateRange
});
</script>

<style scoped>
/* Make expand table button sticky */
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}

/* prevent nested schedules table from having sticky last row */
.nested-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.nested-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: relative !important;
  width: auto !important;
}
</style>