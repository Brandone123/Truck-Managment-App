<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Job Listings Management</span>
      <div>
        <RecruitingJobPostingDialog :updating="updatingJobPosting" @update:show="updateJobPostingDialog"
          :show="jobPostingDialogVisible" :item="editedJobPosting"/>
      </div>
    </div>

    <SharedUiCustomTable :headers="jobPostingHeaders" :items="jobPostingList" :search="search">
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" dense class="mr-2" @click="editJobPosting(item)">mdi-pencil</v-icon>
        <v-icon color="red" dense @click="deleteJobPosting(item.id)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <!-- <v-chip :color="getStatusColor(item.status)" @click="changeStatus(item)">{{ item.status }}</v-chip> -->
        <v-select 
         density="compact" variant="underlined" hide-details :value="item.status" :items="statuses"
                item-value="value" item-title="name">
            </v-select>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { useJobPostingStore } from '~/stores/recruiting/job_posting';
import type { JobPostingInfo } from '~/types/recruiting/job_posting';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  status: string;
}

const JobPostingListStore = useJobPostingStore();
const { jobPostingList } = storeToRefs(JobPostingListStore);

const search = ref('');

const emit = defineEmits(['editJobPosting', 'deleteJobPosting']);

const jobPostingHeaders = ref([
  { title: 'JOB POSTING ID', key: 'id', class: 'no-wrap' },
  { title: 'TITLE', key: 'title', class: 'no-wrap' },
  { title: 'DESCRIPTION', key: 'description', class: 'no-wrap' },
  { title: 'Status', key: 'status', class: 'no-wrap' },
  { title: 'ACTIONS', key: 'actions', class: 'no-wrap' },
]);

const jobPostingDialogVisible = ref(false);
const updatingJobPosting = ref(false);

const defaultJobPosting: Ref<JobPostingInfo> = ref({
  id: null,
  title: null,
  description: null,
  responsibilities: null,
  qualifications: null,
  advertisement_channels: null,
  status: null,
});

const editedJobPosting = ref(defaultJobPosting.value);

const editJobPosting = (job_posting: JobPostingInfo) => {
  editedJobPosting.value = Object.assign({}, job_posting);
  updatingJobPosting.value = true;
  jobPostingDialogVisible.value = true;
};

const updateJobPostingDialog = (value: boolean) => {
  jobPostingDialogVisible.value = value;
  editedJobPosting.value = defaultJobPosting.value as JobPostingInfo;
  updatingJobPosting.value = false;
};

const deleteJobPosting = (id: number) => {
  JobPostingListStore.deleteJobPosting(id);
};

const getStatusColor = (status: string) => {
  if (status === 'Published') {
    return 'green';
  } else if (status === 'Closed') {
    return 'red';
  } else {
    return 'default';
  }
};

const statuses = ref([
    { name: 'Draft', value: 'ignore' },
    { name: 'Published', value: 'warn' },
    { name: 'Closed', value: 'stop' }
])

const changeStatus = (jobPosting: any) => {
  if (jobPosting.status === 'Draft') {
    jobPosting.status = 'Published';
  } else if (jobPosting.status === 'Published') {
    jobPosting.status = 'Closed';
  } else if (jobPosting.status === 'Closed') {
    jobPosting.status = 'Draft';
  }
};
  
const getEditIcon = (status: string) => {
  if (status === 'Draft') {
    return 'mdi-pencil';
  } else {
    return 'mdi-eye';
  }
};

onMounted(() => {
  jobPostingList.value.forEach((jobPosting: any) => {
    jobPosting.status = 'Draft';
  });
});
</script>

<style scoped>
/* Add your styles here */
</style>