<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useApplicationStore } from '@/stores/recruiting/application';
import { ref, computed, watch } from 'vue';
import type { ApplicationInfo } from '@/types/recruiting/application';
import { useApplicantStore } from '~/stores/recruiting/applicant';
import { useJobPostingStore } from '~/stores/recruiting/job_posting';

const emit = defineEmits(['update:show', 'addApplication', 'editApplication']);

const props = defineProps({
  item: {
    type: Object as () => ApplicationInfo,
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

const applicationForm = ref(null);

const ApplicationListStore = useApplicationStore();

const JobPostingListStore = useJobPostingStore();
const { jobPostingList } = storeToRefs(JobPostingListStore);

const ApplicantStore = useApplicantStore();
const { applicantList } = storeToRefs(ApplicantStore);

const EmployeeListStore = useEmployeeStore()
const { employeeList } = storeToRefs(EmployeeListStore)

const defaultApplication = ref<ApplicationInfo>({
  id: null,applicant_id: null,job_posting_id: null,first_name: null,last_name: null,email: null,phone_number: null,address: null,date_of_birth: null,gender: null,nationality: null,work_experience: null,education_history: null,skills: null,languages_spoken: null,references: null,cover_letter: null,resume: null,application_status: null,additional_documents: null,application_date: null,notes: null,
});

const applicationInfo = ref(defaultApplication.value);

const title = computed(() => {
  return props.updating ? 'Application Info' : 'Create Application';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Application';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    ApplicationListStore.updateApplication(applicationInfo.value);
  } else {
    ApplicationListStore.createApplication(applicationInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (applicationForm.value) {
    (applicationForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    applicationInfo.value = Object.assign({}, props.item as ApplicationInfo)
  } else {
    resetForm()
  }
})

// New code
const step1Form = ref(null);
const step2Form = ref(null);
const step3Form = ref(null);
const activeStep = ref(1);

const nextStep = () => {
  if (activeStep.value === 1) {
    if (step1Form.value && (step1Form.value as HTMLFormElement).reportValidity()) {
      activeStep.value = 2;
    }
  } else if (activeStep.value === 2) {
    if (step2Form.value && (step2Form.value as HTMLFormElement).reportValidity()) {
      activeStep.value = 3;
    }
  } else if (activeStep.value === 3) {
    if (step3Form.value && (step3Form.value as HTMLFormElement).reportValidity()) {
      save();
    }
  }
};

const previousStep = () => {
  if (activeStep.value === 2) {
    activeStep.value = 1;
  } else if (activeStep.value === 3) {
    activeStep.value = 2;
  }
};

const steps = ref([
  "Personnal Information","Professionnal Information","Document Requirement"
])

</script>

<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Application
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
        <v-card>
          <div class="step-container px-3 py-3" >
            <div :class="['step', { 'active': step === activeStep }]" step="1">
              <v-chip :disabled="activeStep === 2 || activeStep === 3">1</v-chip> 
              <v-chip :disabled="activeStep === 2 || activeStep === 3">Personnal Information</v-chip>
            </div>
            <div style="align-items: center;"   :class="['step', { 'active': step === activeStep }]" step="2">
              <v-chip :disabled="activeStep === 1 || activeStep === 3">2</v-chip>
              <v-chip :disabled="activeStep === 1 || activeStep === 3">Professionnal Information</v-chip>
            </div>
            <div   :class="['step', { 'active': step === activeStep }]" step="3">
              <v-chip :disabled="activeStep === 1 || activeStep === 2">3</v-chip>
              <v-chip :disabled="activeStep === 1 || activeStep === 2">Document Requirement</v-chip>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="step-content">
            <div step="1" v-if="activeStep === 1">
                <v-card-text>
                    <v-form ref="step1Form" v-model="step1Form" >
                        <v-row>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-autocomplete v-model="applicationInfo.applicant_id" label="Select Applicant" :items="applicantList"
                                :rules="[rules.required]" item-value="id" item-title="first_name"   density="compact">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-autocomplete v-model="applicationInfo.job_posting_id" label="Select Job Posting" :items="jobPostingList"
                                :rules="[rules.required]" item-value="id" item-title="title"   density="compact">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="applicationInfo.first_name" label="First Name" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="applicationInfo.last_name" label="Last Name" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field type="date" v-model="applicationInfo.date_of_birth"   density="compact" label="Date of Birth" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-select v-model="applicationInfo.gender" :items="['Male', 'Female']"   density="compact" label="Gender" required></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="applicationInfo.email" label="Email" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="applicationInfo.phone_number" label="Phone Number" required :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </div>
            <div step="2" v-else-if="activeStep === 2">
                <v-card-text>
                    <v-form ref="step2Form" v-model="step2Form" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.address"   density="compact" label="Address" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.nationality"   density="compact" label="Nationality" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.work_experience"   density="compact" label="Work Experience" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.education_history"   density="compact" label="Education History" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.skills"   density="compact" label="Skills" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field v-model="applicationInfo.languages_spoken"   density="compact" label="Languages Spoken" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </div>
            <div step="3" v-else-if="activeStep === 3">
                <v-card-text>
                    <v-form ref="step3Form" v-model="step3Form" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-text-field type="date" v-model="applicationInfo.application_date"   density="compact" label="Application Date" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-file-input v-model="resume"   density="compact" label="Resume" required></v-file-input>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-file-input v-model="cover_letter"   density="compact" label="Cover Letter" required></v-file-input>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-autocomplete v-model="applicationInfo.references" item-value="id" item-title="full_name" :items="employeeList"   density="compact" label="References" required></v-autocomplete>
                            </v-col>
                        
                            <v-col cols="12" md="6" class="pb-0">
                                <v-select v-model="applicationInfo.application_status" label="Status" :items="['New', 'Under Review', 'Interview', 'Rejected', 'Accepted']"
                                :rules="[rules.required]"   density="compact">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-file-input v-model="additional_documents"   density="compact" label="Additional Documents" required></v-file-input>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                                <v-textarea v-model="applicationInfo.notes"   density="compact" label="Notes" raw="2" required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </div>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <template v-if="activeStep === 1">
              <v-btn color="primary" @click="nextStep">Next</v-btn>
            </template>
            <template v-else-if="activeStep > 1 && activeStep < 3">
              <v-btn dense @click="previousStep">Previous</v-btn>
              <v-btn color="primary" @click="nextStep">Next</v-btn>
            </template>
            <template v-else-if="activeStep === 3">
              <v-btn dense @click="previousStep">Previous</v-btn>
              <v-btn color="primary" @click="nextStep">{{ saveButtonText }}</v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.step-container {
  display: flex;
  justify-content: space-between;
}

.step {
  /* width: 30px;
  height: 30px; */
  /* border-radius: 50%; */
  /* background-color: #ccc; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.step.active {
  background-color: #f00;
  color: blue;
}

.stepR {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepR.active {
  background-color: #f00;
  color: #fff;
}

.step-content {
  margin-top: 20px;
}
</style>