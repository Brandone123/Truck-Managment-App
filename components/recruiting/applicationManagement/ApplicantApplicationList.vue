<template>
  <SharedUiCustomTable v-model="selectedVehicleIds" :showFooterInHead="false" :headers="applicationHeaders"
    :items="applicationEntries" :loading="loadingDetail" @hoveredRow="hoveredRow = $event;">
    <template v-slot:item.status="{ item }">
      <v-chip :color="applicationStatusColor(item.status)" density="compact" variant="flat">
        {{ item.status }}
      </v-chip>
    </template>

    <template v-slot:item.actions="{ item, index }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View application
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.id="{ item }">
      <span style="cursor: pointer; border-bottom: 1px dotted" class="text-secondary font-weight-bold"
        @click="$emit('view', item)">#{{ item.id }}</span>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span v-if="item.created_at"> {{ new Date(item.created_at).toLocaleDateString('en-US',
          {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12:
        true
        }) }}</span>
      <span v-else>---</span>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Application } from '@/types/recruiting/applicantApplication';
import moment from 'moment';

const props = defineProps({
  getApplications: {
    type: Array as PropType<Partial<Application[]>>,
    required: true,
  },
  loadingDetail: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});


const emit = defineEmits(['view']);

const hoveredRow = ref<number | null>(null);

const selectedVehicleIds = ref<number[]>([]);

const applicationEntries = computed(() => {
  return props.getApplications;
});

const applicationStatusColor = (status: string) => {
  switch (status) {
    case 'Received':
      return 'secondary';
    case 'Under Review':
      return 'orange';
    case 'Interview Scheduled':
      return 'purple';
    case 'Rejected':
      return 'red';
    case 'Hire':
      return 'primary';
    case 'Offer':
      return 'yellow';
    default:
      return 'grey';
  }
};

const formatDate = (dateString: string) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};

const applicationHeaders = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Job Title', key: 'job.title', sortable: true },
  { title: 'Submission Source', key: 'submission_source', sortable: true },
  { title: 'Submitted At', key: 'created_at', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];
</script>