<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useJobPostingStore } from '@/stores/recruiting/job_posting'
import type { JobPostingInfo } from '@/types/recruiting/job_posting';


const jobPostingStore = useJobPostingStore()
const {jobPostingList} = storeToRefs(jobPostingStore)


const emit = defineEmits(['editJobPosting', 'deleteJobPosting'])

const jobPostingHeaders = ref([
    { title: 'JOB POSTING ID', key: 'id' ,class:"no-wrap" },
    { title: 'TITLE', key: 'title' ,class:"no-wrap" },
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"  },
    { title: 'RESPONSABILITIES', key: 'responsibilities',class:"no-wrap"  },
    { title: 'QUALIFICATIONS', key: 'qualifications',class:"no-wrap"  },
    { title: 'ADVERTISEMENT CHANNELS', key: 'advertisement_channels',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const jobPostingDialog = ref(false)
const updatingJobPosting = ref(false)


const defaultJobPosting: Ref<JobPostingInfo> = ref({
    id: null,
    title: null,
    description: null,
    responsibilities: null,
    qualifications: null,
    advertisement_channels: null,
});

const editedJobPosting = ref(defaultJobPosting.value)

const editJobPosting = (job_posting: JobPostingInfo) => {
    editedJobPosting.value = Object.assign({}, job_posting)
    updatingJobPosting.value = true
    jobPostingDialog.value = true
}

const updateJobPostingDialog = (value: boolean) => {
    jobPostingDialog.value = value
    editedJobPosting.value = defaultJobPosting.value as JobPostingInfo
    updatingJobPosting.value = false
}

const deleteJobPosting = (id: number) => {
    jobPostingStore.deleteJobPosting(id)
}

</script>
<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">Job Posting </span>
        <div>
            <RecruitingJobPostingDialog :updating="updatingJobPosting" @update:show="updateJobPostingDialog" 
            :show="jobPostingDialog" :item="editedJobPosting" />
        </div>
      </div>
        
      <SharedUiCustomTable return-object show-select :headers="jobPostingHeaders" :items="jobPostingList">
          <template v-slot:item.actions="{ item }">
              <div>
              <v-icon color="primary" dense @click="editJobPosting(item)">mdi-pencil</v-icon>
              <v-icon color="red" dense @click="deleteJobPosting(item.id)">mdi-delete</v-icon>
              </div>
          </template>
          <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="scheduledPosting(selectedItems)">
                <v-icon>mdi-clock</v-icon> Scheduled postings
            </v-btn>

            <v-btn color="primary" class="text-none mr-2" @click="publishJob(selectedItems)">
                <v-icon>mdi-send</v-icon> Publish immediately
            </v-btn>

            <v-select base-color="primary" color="primary" clearable style="width: 200px" dense hide-details variant="solo"
                flat density="compact" label="Select Job Board" :items="['Job Board 1', 'Job Board 2']"></v-select>
        </template>
      </SharedUiCustomTable>
    </div> 
</template>