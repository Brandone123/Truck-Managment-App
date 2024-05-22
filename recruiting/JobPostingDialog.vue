<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useJobPostingStore } from '@/stores/recruiting/job_posting';
import { ref, computed, watch } from 'vue';
import type { JobPostingInfo } from '@/types/recruiting/job_posting';

const emit = defineEmits(['update:show', 'addJobPosting', 'editJobPosting']);

const props = defineProps({
    item: {
        type: Object as () => JobPostingInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
});

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const jobPostingForm = ref(null);

const JobPostingListStore = useJobPostingStore();

const advertisementChannelsType = ref([
  {id: '1', text: 'Online job boards', value: 'Online job boards'},
  {id: '2', text:  'Social media', value:  'Social media'},
  {id: '3', text: 'Compagny Website', value: 'Compagny Website'},
  {id: '4', text: 'Industry Publications', value: 'Industry Publications'},
])

const advertisement_channels = ref(null)

const defaultJobPosting = ref<JobPostingInfo>({
    id: null,
    title: null,
    description: null,
    responsibilities: null,
    qualifications: null,
    advertisement_channels: null,
})

const jobPostingInfo = ref(defaultJobPosting.value);

const title = computed(() => {
  return props.updating ? 'Job Posting Info' : 'Create Job';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Job';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    JobPostingListStore.updateJobPosting(jobPostingInfo.value);
  } else {
    JobPostingListStore.createJobPosting(jobPostingInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (jobPostingForm.value) {
    (jobPostingForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    jobPostingInfo.value = Object.assign({}, props.item as JobPostingInfo)
  } else {
      resetForm()
  }
})

const showListingButton = computed(() => {
  const currentPath = window.location.pathname;
  return currentPath === '/recruiting/job_posting';
});

</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn v-if="showListingButton" density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Job
        </v-btn>
      </template>
    <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="jobPostingForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="jobPostingInfo.title" label="Title" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="jobPostingInfo.qualifications" label="Qualifications" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="jobPostingInfo.description" variant="solo" flat density="compact" label="Description" rows="2" required></v-textarea>
                </v-col>
                
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="jobPostingInfo.responsibilities" label="Responsibilities" variant="solo" flat density="compact" rows="2" :rules="[rules.required]"></v-textarea>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <!-- <v-select v-model="jobPostingInfo.advertisement_channels" :items="['Online job boards', 'Social media', 'Compagny Website', 'Industry Publications']" 
                    label="Advertiment channel" variant="solo" flat density="compact" :rules="[rules.required]"></v-select> -->

                    <v-select v-model="jobPostingInfo.advertisement_channels" label="Advertiment channel" :items="advertisementChannelsType"
                     variant="solo" item-title="text" item-value="value" flat density="compact" multiple>
                    </v-select>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
