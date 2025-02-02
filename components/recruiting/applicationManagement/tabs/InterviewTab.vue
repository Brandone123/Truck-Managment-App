<!-- src/components/recruiting/applicationManagement/tabs/InterviewTab.vue -->
<template>
  <div>
    <div class="d-flex">
      <div class="ml-auto mb-2">
        <v-btn color="primary" @click="openAddInterviewDialog">Add Interview</v-btn>
      </div>
    </div>

    <InterviewEditDialog :modelValue="interviewDialog" :interview="selectedInterview"
      @update:modelValue="interviewDialog = $event" @close="closeInterviewDialog" @save="saveInterview" />
   
    <InterviewFeedbackDialog :modelValue="feedbackDialog" :feedback="selectedInterview"
      @update:modelValue="feedbackDialog = $event" @close="closeFeedbackDialog" @save="saveInterview" />

    <div style="position:sticky;top:134px;z-index:1;" class="pt-2 pb-5 pa-0 position-sticky">
      <v-card class="pa-2 full-width-card no-border-radius">
        <div class="d-flex align-center">
          <v-btn color="primary" variant="tonal" density="compact" @click="resetToCurrentMonthAndWeek" class="mr-1">
            Current Month
          </v-btn>
          <v-icon color="primary" @click="previousWeek">mdi-chevron-left</v-icon>
          <span class="text-primary ml-3 mr-3">
            {{ currentWeekRange }}
          </span>
          <v-icon color="primary" @click="nextWeek">mdi-chevron-right</v-icon>
        </div>
      </v-card>
    </div>

    <v-row v-if="loadingInterviews && !interviews.length">
      <v-col cols="12" md="4" v-for="(i) in 6" :key="i">
        <v-skeleton-loader :loading="loadingInterviews" type="image">
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" class="mt-3" v-for="(item, index) in interviews" :key="index">
        <v-card class="relative  overflow-visible" height="100%">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div class="form-title text-center">
                <v-card class="small-card bg-primary">
                  <div>{{ new Date(item.interview_start_date).toLocaleDateString('en-US',
                    { day: 'numeric' }) }}
                  </div>
                  <div>{{ new Date(item.interview_start_date).toLocaleDateString('en-US',
                    { month: 'short' }) }}
                  </div>
                </v-card>
              </div>
              <div class="text-grey ml-auto">
                <v-menu>
                  <template v-slot:activator="{ props: menu }">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props: tooltip }">
                        <v-card class="ml-3 custom-button d-flex justify-center align-center" style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px; 
                        padding: 4px; background-color: transparent;"
                          :variant="menu.isActive ? 'tonal' : 'flat'" density="compact" flat v-bind="menu">
                          <v-icon size="large" density="compact" class="icon">mdi-dots-horizontal</v-icon>
                        </v-card>
                      </template>
                      <span>More Actions</span>
                    </v-tooltip>
                  </template>
                  <v-list density="compact">
                    <v-list-item class="text-primary" append-icon="mdi-pencil"
                      @click="editInterview(item)">Edit</v-list-item>
                    <v-list-item class="text-red" append-icon="mdi-delete"
                      @click="deleteInterview(item)">Delete</v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-card-text>
          <v-list class="pb-0">
            <v-list-item>
              {{ new Date(item.interview_start_date).toLocaleTimeString('en-US',
                { hour: '2-digit', minute: '2-digit', hour12: true }) }} To 
                 {{ new Date(item.interview_end_date).toLocaleTimeString('en-US',
                { hour: '2-digit', minute: '2-digit', hour12: true }) }}
              <template v-slot:append>
                <v-chip :color="getStatusColor(item.interview_status)" density="compact" variant="flat">
                  {{ item.interview_status }}
                </v-chip>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <div class="pt-0">
              <v-card-text>
                <v-col>
                  <v-row>
                    <v-col cols="6" class="pt-0" v-for="(viewer, index) in item.interviewers" :key="index">
                      <span style="border: 1 grey; border-radius: 100%;">
                        <v-icon color="primary" size="xx-small">mdi-checkbox-blank-circle</v-icon>
                      </span>
                      {{ viewer }}
                      <!-- <SharedTableDynamicTechnicianItem v-if="viewer" :technician="viewer" /> -->
                    </v-col>
                  </v-row>
                </v-col>
              </v-card-text>
            </div>
           
            <v-divider></v-divider>
            <v-expansion-panels elevation="0" density="compact">
              <v-expansion-panel>
                <v-expansion-panel-title>
                   FeedBacks
                </v-expansion-panel-title>
               
                <v-expansion-panel-text>
                  <div class="d-flex">
                     <div style="position: relative;">
                      <span class="text-primary" style="cursor:pointer; font-size:small; 
                        border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px; 
                          padding: 4px; background-color: transparent;" 
                        @click="openFeedback(item)">Add Feedback</span>
                    </div>
                  </div>
                 
                  <v-card-text>
                    <div v-if="item.interview_feedback && item.interview_feedback.length > 0" class="reply-container">
                      <div v-for="(feedback, i) in item.interview_feedback" :key="i" class="reply-item"
                        style="margin-bottom: 16px;">
                        <h4 class="text-primary">{{ feedback.author ? feedback.author : 'N/A' }}</h4>
                        <div class="text-grey mb-1" style="font-size: x-small;">
                          {{ new Date(feedback.created_at).toLocaleDateString('en-US',
                            {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12:
                          true
                          }) }}
                        </div>
                        <p>{{ feedback.feedback_details }}</p>
                        <v-divider class="my-2"></v-divider>
                      </div>
                    </div>
                    <span v-else class="text-grey" style="font-size: small;">No Feedback Yet</span>
                  </v-card-text>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-divider></v-divider>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Note
                </v-expansion-panel-title>
               
                <v-expansion-panel-text>
                  <v-card-text>
                    <span class="text-grey" style="font-size: small;" v-if="item.interview_notes">
                      {{ item.interview_notes }}
                    </span>
                    <span v-else class="text-grey" style="font-size: small;">No Note Yet</span>
                  </v-card-text>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="!interviews.length && !loadingInterviews">
        <v-card class="d-inline" style="min-width: 100px">
          <v-card-text class="d-flex justify-center text-body-1">
            NO INTERVIEW
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex mt-4 pa-2 justify-center">
      <v-pagination :disabled="loadingInterviews" :length="total_pages" v-model="pagination.page" :items="4" color="primary"
        next-icon="mdi-menu-right" prev-icon="mdi-menu-left"></v-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRecruitmentStore } from '~/stores/recruiting/applicationManagement/recruitmentStore';
import InterviewEditDialog from '@/components/recruiting/applicationManagement/dialogs/InterviewEditDialog.vue';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import type { Interview } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';
import InterviewFeedbackDialog from '../dialogs/InterviewFeedbackDialog.vue';

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const recruitmentStore = useRecruitmentStore();

const allInterviews = computed(() => recruitmentStore.interviews);
const loadingInterviews = computed(() => recruitmentStore.loadingInterviews);
const { pagination: interviewPagination, total_items, total_pages } = storeToRefs(recruitmentStore)

const interviews = computed(() => {
  return allInterviews.value.filter(interview => interview.application_id === parseInt(route.params.applicationId as string, 10));
});

const interviewDialog = ref(false);
const feedbackDialog = ref(false)
const selectedInterview = ref<Partial<Interview> | null>(null);

const openFeedback = (interview: Interview) => {
  selectedInterview.value = interview;
  feedbackDialog.value = true;
}

const openAddInterviewDialog = () => {
  selectedInterview.value = null;
  interviewDialog.value = true;
};

const editInterview = (interview: Interview) => {
  selectedInterview.value = interview;
  interviewDialog.value = true;
};

const closeInterviewDialog = () => {
  interviewDialog.value = false;
};

const closeFeedbackDialog = () => {
  feedbackDialog.value = false;
}

const saveInterview = async (interview: Partial<Interview>) => {
  interviewDialog.value = false;
  if (interview.id) {
    await recruitmentStore.updateInterview(interview.id, interview);
  } else {
    await recruitmentStore.createInterview(interview);
  }
  await recruitmentStore.fetchInterviews();
};


const layoutStore = useLayoutStore();
const deleteInterview = async (interview: Interview) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this interview ?`)
  if (confirm) {
    await recruitmentStore.deleteInterview(interview.id);
    await recruitmentStore.fetchInterviews();
  }
}

const getStatusColor = (status: any) => {
  switch (status) {
    case 'Completed':
      return 'secondary';
    case 'Scheduled':
      return 'yellow';
    case 'Canceled':
      return 'red';
    default:
      return 'grey';
  }
};

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

onMounted(() => {
  recruitmentStore.fetchInterviews(searchQuery.value);
})
const pagination = computed({
  get() {
    return interviewPagination.value
  },
  set(value) {
    recruitmentStore.setPagination(value);
  }
})

const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() => Math.ceil(interviews.value.length / itemsPerPage));

function paginate(page: number): void {
  if (page < 1 || page > totalPages.value) {
    return; // Check validity of specified page
  }
  currentPage.value = page;
}

const currentDate = ref(new Date());
const currentYear = ref(currentDate.value.getFullYear());
const currentMonth = ref(currentDate.value.getMonth());
const currentWeekStart = ref(getStartOfWeek(new Date()));
const currentWeekEnd = ref(getEndOfWeek(new Date()));

// Calcul dynamique du texte à afficher pour la plage de la semaine
const currentWeekRange = computed(() => {
  return `${formatDate(currentWeekStart.value)} To ${formatDate(currentWeekEnd.value)}`;
});

function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Commence le lundi
  start.setDate(diff);
  return start;
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Fin de la semaine (dimanche)
  return end;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}



// Modifié : Nouvelle implémentation des fonctions de navigation
function previousWeek(): void {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() - 7);
  currentWeekStart.value = newStart;

  const newEnd = new Date(currentWeekEnd.value);
  newEnd.setDate(newEnd.getDate() - 7);
  currentWeekEnd.value = newEnd;

  pagination.value.page = 1;
  fetchInterviewsForCurrentWeek();
}

function nextWeek(): void {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() + 7);
  currentWeekStart.value = newStart;

  const newEnd = new Date(currentWeekEnd.value);
  newEnd.setDate(newEnd.getDate() + 7);
  currentWeekEnd.value = newEnd;

  pagination.value.page = 1;
  fetchInterviewsForCurrentWeek();
}

function resetToCurrentMonthAndWeek(): void {
  currentDate.value = new Date();
  currentYear.value = currentDate.value.getFullYear();
  currentMonth.value = currentDate.value.getMonth();
  currentWeekStart.value = getStartOfWeek(currentDate.value);
  currentWeekEnd.value = getEndOfWeek(currentDate.value);

  pagination.value.page = 1;
  fetchInterviewsForCurrentWeek();
}

function fetchInterviewsForCurrentWeek(): void {
  const startOfWeek = currentWeekStart.value.toISOString().split('T')[0];
  const endOfWeek = currentWeekEnd.value.toISOString().split('T')[0];

  recruitmentStore.fetchInterviews({
    ...searchQuery.value,
    filters: {
      ...searchQuery.value.filters,
      application_id: parseInt(route.params.applicationId as string, 10),
      interview_start_date__gte: startOfWeek,
      interview_start_date__lte: endOfWeek
    },
  });
}

onMounted(() => {
  fetchInterviewsForCurrentWeek();
});

const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isTyping = ref<boolean>(false)


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
    payload['filters'].stage = activeFilter.value
  }

  return payload
})


watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchInterviews(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchInterviews(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchInterviews(searchQuery.value);
})
</script>

<style scoped>
.v-card {
  border-radius: 0.5rem;
}

.small-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Centre verticalement */
  align-items: center;
  font-size: 17px;

  top: -16px;
  left: 15px;
  width: 70px;
  height: 70px;
  border-radius: 8px;
  /* background-color: green; */
}

.full-width-card {
  width: calc(100% - var(--sidebar-width));
  /* Ajuste la largeur en fonction de la barre latérale */
  margin-left: var(--sidebar-width);
  /* Décale vers la droite pour éviter la barre latérale */
}

.no-border-radius {
  border-radius: 0px;
  /* Supprime les coins arrondis */
}

/* Variable CSS pour la largeur de la barre latérale */
:root {
  --sidebar-width: 280px;
  /* Ajuste cette valeur selon la largeur réelle de la barre latérale */
}

.form-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.custom-button {
  min-width: 0;
}
</style>