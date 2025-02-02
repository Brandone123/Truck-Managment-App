<!-- src/components/recruiting/JobEditDialog.vue -->

<template>
  <JobTemplateSelectionDialog v-model="jobTemplateSelectionDialog" @selection="loadTemplate" />
  <v-dialog v-model="dialog" max-width="900px" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ job?.id ? 'Edit Job' : 'Create Job' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-sheet style="position:sticky; top:0px;z-index: 1" class="grey-background">
        <v-tabs v-model="currentTab" align-tabs="center" color="primary">
          <v-tab value="design">Design</v-tab>
          <v-tab value="preview">Preview</v-tab>
        </v-tabs>
      </v-sheet>

      <v-card-text class="pt-0">
        <v-container style="max-width: 1000px;">
          <div class="d-flex justify-center mb-2" v-if="!currentJob.id">
            <v-btn @click="showTemplateSelector" color="primary" prepend-icon="mdi-view-list">Load Template</v-btn>
          </div>

          <v-window v-model="currentTab">
            <!-- DESIGN WINDOW -->
            <v-window-item value="design">
              <v-form ref="jobForm">
                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="currentJob.title"
                          label="Job Title" :rules="[validation.required]" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <FormAutocompleteInput :readonly="currentForm.id" persistent-hint
                          :hint="currentForm.id ? 'Job can not be updated' : ''"
                          v-model="currentJob.application_form_id" item-value="id" label="Select Form" color="primary"
                          :rules="[validation.required]" />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select variant="outlined" flat density="compact" v-model="currentJob.job_type"
                          :items="jobTypes" label="Job Type" :rules="[validation.required]" required></v-select>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select variant="outlined" flat density="compact" v-model="currentJob.status"
                          :items="jobStatuses" label="Status" :rules="[validation.required]" required></v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>



                <div class="pb-5">
                  <div class="d-flex py-5 grey-background mx-n10 px-10" style="z-index: 1; position: sticky;top:0;">
                    <v-btn @click="expandAll" class="trigger-btn mr-5" density="comfortable" variant="text"
                      size="medium">
                      <v-icon>mdi-arrow-expand-vertical</v-icon>
                      <v-tooltip activator="parent" location="top">Expand All</v-tooltip>
                    </v-btn>
                    <v-btn @click="collapseAll" class="trigger-btn" density="comfortable" variant="text" size="medium">
                      <v-icon>mdi-arrow-collapse-vertical</v-icon>
                      <v-tooltip density="compact" activator="parent" location="top">Collapse All</v-tooltip>
                    </v-btn>
                  </div>

                  <draggable v-model="currentJob.fields_definition" handle=".handle">
                    <div class="list-group-item" v-for="(item, i) in currentJob.fields_definition" :key="i">
                      <div class="d-flex">
                        <v-btn class="handle grabbable mr-3" icon="mdi-dots-grid" size="small" variant="text"></v-btn>
                        <div class="flex-grow-1">

                          <!-- General -->
                          <ExpandableItem v-if="item.default == true && item.title == 'general'" class="mb-3"
                            :expanded="isExpanded[item.id]" @update:expanded="updateExpand(item.id)">
                            <template #title>General</template>
                            <template #body>
                              <!-- <v-row>
                                  <v-col cols="12">
                                    <v-text-field variant="outlined" flat density="compact"
                                      v-model="item.data.job_title" label="Job Title*" :rules="[validation.required]"
                                      required></v-text-field>
                                  </v-col>
                                </v-row> -->

                              <v-card variant="outlined">
                                <v-card-title class="d-flex align-center">
                                  <v-checkbox color="primary" v-model="item.data.job_type.display"
                                    hide-details></v-checkbox>
                                  Job Type</v-card-title>
                                <v-card-text v-if="item.data.job_type.display">
                                  <v-row>
                                    <v-col cols="12">
                                      <v-select label="Type" variant="outlined" density="compact"
                                        :items="[{ title: 'Full-time', value: 'full-time' }, { title: 'Contract', value: 'contract' }]"
                                        v-model="item.data.job_type.value.type">
                                      </v-select>
                                    </v-col>

                                    <v-col cols="12" v-if="item.data.job_type.value.type == 'contract'">
                                      <v-select label="Contract Time Duration" variant="outlined" density="compact"
                                        :items="[{ title: 'Fixed', value: 'fixed' }, { title: 'Variable', value: 'variable' }]"
                                        v-model="item.data.job_type.value.contract_time">
                                      </v-select>
                                    </v-col>

                                    <!-- Fixed Contract Duration -->
                                    <v-col cols="12"
                                      v-if="item.data.job_type.value.type == 'contract' && item.data.job_type.value.contract_time == 'fixed'">
                                      <v-row>
                                        <v-col cols="8">
                                          <v-text-field variant="outlined" flat density="compact" type="number"
                                            v-model="item.data.job_type.value.contract_time_fixed"
                                            :rules="[validation.required]" required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col class="pl-0">
                                          <v-select variant="outlined"
                                            :items="['day(s)', 'week(s)', 'month(s)', 'year(s)']" flat density="compact"
                                            v-model="item.data.job_type.value.contract_duration"
                                            :rules="[validation.required]" required>
                                          </v-select>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <!-- END Fixed Contract Duration -->

                                    <!-- Variable Contract Duration -->
                                    <v-col cols="12" md="6"
                                      v-if="item.data.job_type.value.type == 'contract' && item.data.job_type.value.contract_time == 'variable'">
                                      <v-row>
                                        <v-col cols="7">
                                          <v-text-field variant="outlined" flat density="compact" type="number"
                                            v-model="item.data.job_type.value.contract_time_from"
                                            :rules="[validation.required]" required>
                                            <template v-slot:prepend>
                                              <span>From</span>
                                            </template>
                                          </v-text-field>
                                        </v-col>
                                        <v-col class="pl-0">
                                          <v-select variant="outlined"
                                            :items="['day(s)', 'week(s)', 'month(s)', 'year(s)']" flat density="compact"
                                            v-model="item.data.job_type.value.contract_time_from_duration"
                                            :rules="[validation.required]" required>
                                          </v-select>
                                        </v-col>
                                      </v-row>
                                    </v-col>

                                    <v-col cols="12" md="6"
                                      v-if="item.data.job_type.value.type == 'contract' && item.data.job_type.value.contract_time == 'variable'">
                                      <v-row>
                                        <v-col cols="7">
                                          <v-text-field variant="outlined" flat density="compact" type="number"
                                            v-model="item.data.job_type.value.contract_time_to"
                                            :rules="[validation.required]" required>
                                            <template v-slot:prepend>
                                              <span>To</span>
                                            </template>
                                          </v-text-field>
                                        </v-col>
                                        <v-col pl="0">
                                          <v-select variant="outlined"
                                            :items="['day(s)', 'week(s)', 'month(s)', 'year(s)']" flat density="compact"
                                            v-model="item.data.job_type.value.contract_time_to_duration"
                                            :rules="[validation.required]" required>
                                          </v-select>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <!-- END Variable Contract Duration -->
                                  </v-row>
                                </v-card-text>
                              </v-card>

                              <v-card variant="outlined" class="mt-3">
                                <v-card-title class="d-flex align-center">
                                  <v-checkbox color="primary" v-model="item.data.pay.display" hide-details></v-checkbox>
                                  Pay</v-card-title>
                                <v-card-text v-if="item.data.pay.display">
                                  <v-row>
                                    <v-col cols="12" md="6">
                                      <v-select variant="outlined" flat density="compact"
                                        v-model="item.data.pay.value.type" label="Type*" :items="['range', 'fixed']"
                                        :rules="[validation.required]" required>
                                      </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                      <v-select variant="outlined" flat density="compact"
                                        v-model="item.data.pay.value.category" label="Category"
                                        :items="['hour', 'week', 'month', 'mile']" :rules="[validation.required]"
                                        required>
                                      </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="item.data.pay.value.type == 'range'">
                                      <v-text-field variant="outlined" flat density="compact" placeholder="0.00"
                                        v-model="item.data.pay.value.pay_range_from" :rules="[validation.required]"
                                        required>
                                        <template v-slot:prepend>
                                          <span>From</span>
                                        </template>
                                        <template v-slot:prepend-inner>
                                          <span>$</span>
                                        </template>
                                        <template v-slot:append-inner>
                                          <span v-if="item.data.pay.value.category == 'hour'">hr</span>
                                          <span v-if="item.data.pay.value.category == 'week'">wk</span>
                                          <span v-if="item.data.pay.value.category == 'month'">mth</span>
                                          <span v-if="item.data.pay.value.category == 'mile'">mile</span>
                                        </template>
                                      </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="item.data.pay.value.type == 'range'">
                                      <v-text-field variant="outlined" flat density="compact" type="number"
                                        placeholder="0.00" v-model="item.data.pay.value.pay_range_to"
                                        :rules="[validation.required]" required>
                                        <template v-slot:prepend>
                                          <span>To</span>
                                        </template>
                                        <template v-slot:prepend-inner>
                                          <span>$</span>
                                        </template>
                                        <template v-slot:append-inner>
                                          <span v-if="item.data.pay.value.category == 'hour'">hr</span>
                                          <span v-if="item.data.pay.value.category == 'week'">wk</span>
                                          <span v-if="item.data.pay.value.category == 'month'">mth</span>
                                          <span v-if="item.data.pay.value.category == 'mile'">mile</span>
                                        </template>
                                      </v-text-field>
                                    </v-col>

                                    <v-col cols="12" v-if="item.data.pay.value.type == 'fixed'">
                                      <v-text-field variant="outlined" flat density="compact" type="number"
                                        v-model="item.data.pay.value.fixed_pay" placeholder="0.00"
                                        :rules="[validation.required]" required>
                                        <template v-slot:prepend-inner>
                                          <span>$</span>
                                        </template>
                                        <template v-slot:append-inner>
                                          <span v-if="item.data.pay.value.category == 'hour'">hr</span>
                                          <span v-if="item.data.pay.value.category == 'week'">wk</span>
                                          <span v-if="item.data.pay.value.category == 'month'">mth</span>
                                        </template>
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                              </v-card>

                              <v-card variant="outlined" class="mt-3">
                                <v-card-title class="d-flex align-center">
                                  <v-checkbox color="primary" v-model="item.data.shifts_and_schedules.display"
                                    hide-details></v-checkbox>
                                  Shift And Schedules</v-card-title>
                                <v-card-text v-if="item.data.shifts_and_schedules.display">
                                  <v-autocomplete hide-selected chips closable-chips variant="outlined" flat
                                    density="compact" v-model="item.data.shifts_and_schedules.value"
                                    :items="['Home Daily', 'Day Shift']" label="Select Shifts/Schedules*"
                                    :rules="[validation.required]" required multiple></v-autocomplete>
                                </v-card-text>
                              </v-card>



                              <v-card variant="outlined" class="mt-3">
                                <v-card-title class="d-flex align-center">
                                  <v-checkbox color="primary" v-model="item.data.trucking_details.display"
                                    hide-details></v-checkbox>
                                  Trucking Details</v-card-title>
                                <v-card-text v-if="item.data.trucking_details.display">
                                  <v-autocomplete hide-selected chips closable-chips variant="outlined" flat
                                    density="compact" v-model="item.data.trucking_details.value"
                                    :items="['Dedicated', 'Local', 'OTR']" label="Select Trucking Details"
                                    :rules="[validation.required]" required multiple></v-autocomplete>
                                </v-card-text>
                              </v-card>
                            </template>
                          </ExpandableItem>

                          <!-- Locations -->
                          <ExpandableItem v-else-if="item.default == true && item.title == 'locations'" class="mb-3"
                            :expanded="isExpanded[item.id]" @update:expanded="updateExpand(item.id)">
                            <template #title>Availability Locations</template>
                            <template #body>
                              <div>
                                <v-card :class="{ 'mt-2': i > 0 }" variant="outlined"
                                  v-for="(location, i) in item.data || []" :key="i">
                                  <v-card-text>
                                    <div class="d-flex justify-end">
                                      <v-btn @click="deleteLocation(item.data, i)" icon flat variant="text"
                                        color="error">
                                        <v-icon>mdi-delete</v-icon>
                                        <v-tooltip activator="parent" location="start" color="primary">
                                          Delete Location
                                        </v-tooltip>
                                      </v-btn>
                                    </div>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-radio-group density="compact" hide-details inline v-model="location.job_type"
                                          color="primary" :rules="[validation.required]">
                                          <v-radio label="On-Site" value="on-site"></v-radio>
                                          <v-radio label="Remote" value="remote"></v-radio>
                                          <v-radio label="Hybrid" value="hybrid"></v-radio>
                                        </v-radio-group>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-text-field variant="outlined" flat density="compact"
                                          v-model="location.country" label="Country*" :rules="[validation.required]"
                                          required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-text-field variant="outlined" flat density="compact" v-model="location.state"
                                          label="State*" :rules="[validation.required]" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-text-field variant="outlined" flat density="compact" v-model="location.city"
                                          label="City*" :rules="[validation.required]" required></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>

                                <div class="d-flex justify-center text-none mt-2">
                                  <v-btn @click="addLocation(item.data)" prepend-icon="mdi-plus" color="primary">
                                    Add Location
                                  </v-btn>
                                </div>
                              </div>
                            </template>
                          </ExpandableItem>

                          <!-- Job Requirements -->
                          <ExpandableItem v-else-if="item.default == true && item.title == 'job requirements'"
                            class="mb-3" :expanded="isExpanded[item.id]" @update:expanded="updateExpand(item.id)">
                            <template #title>Job Requirements</template>
                            <template #body>
                              <v-row>
                                <v-col cols="12">
                                  <QuillEditor v-model="item.data" :options="editorOptions" />
                                </v-col>
                              </v-row>
                            </template>
                          </ExpandableItem>

                          <!-- Job Responsibilities -->
                          <ExpandableItem v-else-if="item.default == true && item.title == 'job responsibilities'"
                            class="mb-3" :expanded="isExpanded[item.id]" @update:expanded="updateExpand(item.id)">
                            <template #title>Job Responsibilities</template>
                            <template #body>
                              <v-row>
                                <v-col cols="12">
                                  <QuillEditor v-model="item.data" :options="editorOptions" />
                                </v-col>
                              </v-row>
                            </template>
                          </ExpandableItem>

                          <!-- Custom Sections -->
                          <ExpandableItem v-else class="mb-3" :expanded="isExpanded[item.id]"
                            @update:expanded="updateExpand(item.id)" canDelete @delete="deleteSection(item.id)">
                            <template #title>
                              <v-text-field v-model="item.title" variant="outlined" density="compact"
                                label="Section Title*" placeholder="Enter Section Title" :rules="[validation.required]"
                                hide-details>
                              </v-text-field>
                            </template>
                            <template #body>
                              <v-row>
                                <v-col cols="12">
                                  <QuillEditor v-model="item.data" :options="editorOptions" />
                                </v-col>
                              </v-row>
                            </template>
                          </ExpandableItem>

                        </div>
                      </div>
                    </div>
                  </draggable>

                  <!-- Add Section Button -->
                  <div class="d-flex justify-center text-none">
                    <v-btn color="primary" prepend-icon="mdi-plus" @click="addSection">
                      Add Section
                    </v-btn>
                  </div>
                </div>
              </v-form>
            </v-window-item>

            <!-- PREVIEW WINDOW -->
            <v-window-item value="preview">
              <!-- Render the dynamic HTML content safely -->
              <v-card>
                <v-card-text>
                  <!-- <div class="ql-container ql-snow" style="border-width: 0;"> -->
                  <QuillPreview :html="currentJob.html || ''" />
                  <!-- </div> -->
                </v-card-text>
              </v-card>

            </v-window-item>
          </v-window>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveJob">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import type { Job } from '@/types/recruiting/jobManagement';
//import { useValidation } from '@/composables/useValidation';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { v4 as uuidv4 } from 'uuid';
import ExpandableItem from './components/ExpandableItem.vue';
import { storeToRefs } from 'pinia';
import { buildHtml } from '~/composables/recruiting/useJobTemplateBuilder';
import JobTemplateSelectionDialog from './JobTemplateSelectionDialog.vue';
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';
import FormAutocompleteInput from '../applicationManagement/components/FormAutocompleteInput.vue';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  job: {
    type: Object as PropType<Partial<Job>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const currentTab = ref<string>('design');
const jobTemplateSelectionDialog = ref<boolean>(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(() => dialog.value, (newVal) => {
  if (newVal) {
    currentTab.value = 'design'
  }
})

const jobStore = JobManagementStore();


const { jobs } = storeToRefs(jobStore);

const currentJob = ref<Partial<Job>>({ ...props.job });

const currentForm = ref<Partial<ApplicationForm>>({});

const jobTypes = ['Driver', 'Office Staff', 'Other'];
const jobStatuses = ['Open', 'Closed', 'Pending'];


// Quill editor options
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      // [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      // [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],
      // [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],
      ['link', 'image', 'video']
    ],
  },

  // formats: [ //specify formats to preserve on pasting
  //   'bold', 'italic', 'underline', 'strike', 'list', 'bullet',
  // ]
};


const showTemplateSelector = () => {
  jobTemplateSelectionDialog.value = true;
}

const loadTemplate = (template: any) => {
  currentJob.value = {
    ...currentJob.value,
    job_type: template.job_type,
    fields_definition: template.fields_definition,
    application_form_id: template.application_form_id,
    html: template.html
  }

  let index = template.fields_definition?.findIndex((item: any) => item.title == 'general' && item.default == true) ?? -1;
  if (index > -1) {
    currentJob.value.title = template.fields_definition[index].job_title
  }

  initializeExpansion()

  jobTemplateSelectionDialog.value = false
}

// Watch for prop changes to update the form
watch(
  () => props.job,
  (newJob) => {
    currentJob.value = { ...newJob };
    initializeExpansion()
  }
);

const jobForm = ref<HTMLFormElement | null>(null);



/**
 * Watch the data array; anytime user modifies the design,
 * rebuild the HTML so the Preview tab stays updated.
 */
watch(
  () => currentJob.value,
  (newData) => {
    if (newData.fields_definition?.length) {
      let payload = newData.fields_definition
      let index = newData.fields_definition?.findIndex(item => item.title == 'general' && item.default == true) ?? -1
      if (index > -1 && newData.fields_definition?.length) {
        payload[index].data.job_title = newData.title
      }
      currentJob.value.html = buildHtml(payload);
      currentJob.value.application_form_id = newData.application_form_id
    }
  },
  { deep: true, immediate: true }
);

/**
 * ADD/DELETE Locations
 */
const addLocation = (array: any[]) => {
  if (!Array.isArray(array)) array = [];
  array.push({
    job_type: 'on-site',
    country: '',
    state: '',
    city: ''
  });
};

const deleteLocation = (locationsArray: any[], index: number) => {
  if (Array.isArray(locationsArray)) {
    locationsArray.splice(index, 1);
  }
};

const initializeExpansion = () => {
  isExpanded.value = (currentJob.value?.fields_definition || [])?.reduce((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {} as { [key: string]: boolean })
}
/**
 * Collapse/Expand logic
 */
const isExpanded = ref<Record<string, boolean>>({});

const expandAll = () => {
  Object.keys(isExpanded.value).forEach((key) => {
    isExpanded.value[key] = true;
  });
};

const collapseAll = () => {
  Object.keys(isExpanded.value).forEach((key) => {
    isExpanded.value[key] = false;
  });
};

const updateExpand = (id: string | number) => {
  isExpanded.value[id] = !isExpanded.value[id];
};

/**
 * ADD / DELETE sections
 */
const addSection = () => {
  let section = {
    id: uuidv4(),
    default: false,
    title: '',
    data: '',
  };
  isExpanded.value[section.id] = true;
  currentJob.value.fields_definition?.push(section);
};

const deleteSection = (sectionId: number | string) => {
  let idx = currentJob.value.fields_definition?.findIndex(
    (item) => item.id == sectionId && !item.default
  );
  if (idx !== undefined && idx > -1) {
    currentJob.value.fields_definition?.splice(idx, 1);
  }
};

const saveJob = async () => {
  let formStatus = await jobForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', currentJob.value);
};

</script>

<style scoped>
/* Add your styles here */
</style>