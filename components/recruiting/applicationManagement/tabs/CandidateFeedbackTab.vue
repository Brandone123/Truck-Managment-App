<!-- src/components/recruiting/applicationManagement/tabs/CandidateFeedbackTab.vue -->
<template>
  <div class="mt-n5 mb-n5 ml-n7 mr-n5">
    <div class="d-flex flex-row" style="position:relative;height:calc(100vh - 142px);z-index: 1;">
      <!-- Sidebar Feedback List -->
      <v-sheet class="pa-2" style="width:373px;height:100%;position:fixed;top:142px;">
        <div class="pa-3">
          <v-text-field v-model="searchText" label="Search Feedback" density="compact" variant="outlined" single-line
            hide-details append-inner-icon="mdi-magnify"></v-text-field>
        </div>
        <v-list density="compact">
          <div class="d-flex justify-space-between align-center">
            <v-list-subheader class="font-weight-bold text-primary">Feedback List</v-list-subheader>
            <div class="d-flex justify-space-between align-center mb-2 px-3">
              <span class="text-caption text-grey"> {{ currentPage }} of {{ totalPages }}</span>
              <v-icon @click="prevPage" :disabled="currentPage === 1" class="cursor-pointer">mdi-chevron-left</v-icon>

              <v-icon @click="nextPage" :disabled="currentPage === totalPages"
                class="cursor-pointer">mdi-chevron-right</v-icon>
            </div>
          </div>

          <v-divider class="my-2"></v-divider>
          <div v-if="candidateFeedbacks.length > 0">
            <template v-for="(feedback, index) in paginatedFeedbacks" :key="feedback.id">
              <v-list-item :class="{
                'feedback-item': true,
                'active-feedback': selectedFeedback?.id === feedback.id,
              }" @click="selectFeedback(feedback)" style="font-size:small; font-weight: bold; cursor: pointer; "
                class="text-secondary">
                <div class="d-flex">
                  <span class="text-secondary">
                    <v-chip variant="text" :prepend-avatar="getAvatarIcon(feedback.authored_by?.full_name)">
                      <div class="d-flex flex-column align-items-start">
                        <span class="text-secondary">{{ feedback.authored_by ? feedback.authored_by.full_name : 'N/A'
                          }}</span>
                        <div style="font-size:xx-small;" class="text-grey">
                          {{ new Date(feedback.created_at).toLocaleDateString('en-US',
                            {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12:
                          true }) }}
                        </div>
                      </div>
                    </v-chip>
                  </span>

                  <!-- Dots Menu -->
                  <div class="ml-auto" style="font-size:12px;">
                    <v-menu>
                      <template v-slot:activator="{ props: menu }">
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props: tooltip }">
                            <v-card class="ml-3 custom-button d-flex justify-center align-center"
                              :variant="menu.isActive ? 'tonal' : 'flat'" density="compact" flat v-bind="menu">
                              <v-icon size="small">mdi-dots-vertical</v-icon>
                            </v-card>
                          </template>
                          <span>More Actions</span>
                        </v-tooltip>
                      </template>
                      <v-list density="compact">
                        <v-list-item class="text-primary" append-icon="mdi-pencil"
                          @click="editFeedback(feedback)">Edit</v-list-item>
                        <v-list-item class="text-red" append-icon="mdi-delete"
                          @click="deleteFeedback(feedback)">Delete</v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-list-item>
              <v-divider class="my-2"></v-divider>
            </template>
          </div>

          <div v-else class="text-center text-grey mt-16" style="align-items: center; justify-content: center">
            <p>There is no feedback yet.</p>
          </div>
        </v-list>
      </v-sheet>

      <!-- Feedback Details Section -->
      <div class="flex-grow-1 grey-background"
        style="position:absolute;width:calc(100% - 373px);left:373px; overflow-y:auto;">
        <div class="pa-4" style="width:100%;">
          <div class="d-flex justify-space-between mb-5">
            <span></span>
            <!-- <span class="text-primary text-h6">Candidate Feedback</span> -->
            <v-btn color="primary" @click="openAddFeedbackDialog">Add Feedback</v-btn>
          </div>

          <!-- Feedback Content -->
          <v-row v-if="selectedFeedback" class="d-flex flex-row" style="position:relative;height:100%; ">
            <v-card class="bg-backside" style="height:100%;width:720px;position:fixed;">
              <v-card-text style="max-height:380px;overflow-y: auto; border-radius: 8px;">
                <v-row>
                  <v-col cols="12">
                    <p>{{ selectedFeedback?.feedback_details }}</p>

                    <!-- Separator if reply exists -->
                    <v-divider v-if="selectedFeedback.replies?.length" class="my-4"></v-divider>

                    <!-- Display replies -->
                    <div v-if="selectedFeedback.replies?.length" class="reply-container">
                      <div v-for="(reply, index) in selectedFeedback?.replies" :key="index" class="reply-item"
                        style="margin-bottom: 16px;">
                        <h4 class="text-primary">{{ reply.author ? reply.author : 'N/A' }}</h4>
                        <div class="text-grey mb-1" style="font-size: x-small;">
                          {{ new Date(reply.created_at).toLocaleDateString('en-US',
                            {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12:
                          true
                          }) }}
                        </div>
                        <p>{{ reply.feedback_details }}</p>
                        <v-divider class="my-2"></v-divider>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Reply Button -->
                <div v-if="!showReplyInput">
                  <span style="position:fixed;bottom: 20px;" @click="showReplyInput = true" class="reply-button">
                    <v-icon>mdi-reply</v-icon> Reply
                  </span>
                </div>

                <!-- Reply Textarea -->
                <v-textarea style="background-color:rgb(245, 255, 242);position:fixed;bottom: 0px;width:685px"
                  v-if="showReplyInput" v-model="replyMessage" class="mt-3" :label="sending ? 'Sending...' : 'Reply to this feedback'"
                  append-inner-icon="mdi-send" density="compact" placeholder="Enter your message" rows="2"
                  variant="outlined" @click:append-inner="sendReply" :disabled="sending"></v-textarea>
              </v-card-text>
            </v-card>
          </v-row>

          <!-- No Feedback Selected -->
          <div v-else class="text-center text-grey mt-16" style="align-items: center; justify-content: center">
            <v-icon size="100" color="grey">mdi-file-document</v-icon>
            <p>There is no feedback selected.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Feedback Dialog -->
  <CandidateFeedbackEditDialog :modelValue="feedbackDialog" :feedback="selectedFeedback"
    @update:modelValue="feedbackDialog = $event" @close="closeFeedbackDialog" @save="saveFeedback" />
</template>


<script lang="ts" setup>
import { ref, computed } from 'vue';
import CandidateFeedbackEditDialog from '@/components/recruiting/applicationManagement/dialogs/CandidateFeedbackEditDialog.vue';
import type { CandidateFeedback, Replies } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  }
});

const searchText = ref('');
const sending = ref(false);
const selectedFeedback = ref<Partial<any> | null>(null);

const layoutStore = useLayoutStore();
const auth = useAuthStore()

const recruitmentStore = useRecruitmentStore();


const allCandidateFeedbacks = computed(() => recruitmentStore.candidateFeedbacks);
const loadingCandidateFeedbacks = computed(() => recruitmentStore.loadingCandidateFeedbacks);
const { pagination: feedbackPagination, total_items } = storeToRefs(recruitmentStore)

const candidateFeedbacks = computed(() => {
  return allCandidateFeedbacks.value.filter(feedback => feedback.application_id === parseInt(route.params.applicationId as string, 10));
});


// Pagination logic
const itemsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(filteredFeedbacks.value.length / itemsPerPage)
);

const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFeedbacks.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const filteredFeedbacks = computed(() =>
  candidateFeedbacks.value.filter((feedback) =>
    feedback.authored_by?.full_name.toLowerCase().includes(searchText.value.toLowerCase())
  )
);
const feedbackDialog = ref(false);
const newFeedback = ref<Partial<any> | null>(null);
const replyMessage = ref('');
const showReplyInput = ref(false);

const selectFeedback = (feedback: any) => {
  selectedFeedback.value = feedback;
};
const sendReply = async () => {
  // if (!replyMessage.value.trim()) return;
  if(!selectedFeedback.value) return;

  sending.value = true;
  const currentMessage = replyMessage.value;

  try {
    if (!selectedFeedback.value?.replies) {
      selectedFeedback.value.replies = [];
    }

    selectedFeedback.value?.replies.push({
      author: auth?.user?.name,
      feedback_details: currentMessage,
      created_at: new Date().toISOString(),
    });

    await recruitmentStore.updateCandidateFeedback(selectedFeedback.value.id as number, selectedFeedback.value);
    replyMessage.value = ''; // Efface le champ en cas de succès
    sending.value = false;
    showReplyInput.value = false
  } catch (error) {
    sending.value = false;
    replyMessage.value = currentMessage; // Repopulation en cas d'échec
  }
};

const editFeedback = (feedback: any) => {
  selectedFeedback.value = { ...feedback };
  feedbackDialog.value = true;
};

const deleteFeedback = async (feedback: CandidateFeedback) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this feedback ?`)
  if (confirm) {
    await recruitmentStore.deleteCandidateFeedback(feedback.id);
    await recruitmentStore.fetchCandidateFeedbacks();
  }
}

const openAddFeedbackDialog = () => {
  selectedFeedback.value = null;
  feedbackDialog.value = true;
};

const saveFeedback = async (feedback: Partial<CandidateFeedback>) => {
  feedbackDialog.value = false;
  if (feedback.id) {
    await recruitmentStore.updateCandidateFeedback(feedback.id, feedback);
  } else {
    await recruitmentStore.createCandidateFeedback(feedback);
  }
  await recruitmentStore.fetchCandidateFeedbacks();
};

const closeFeedbackDialog = () => {
  feedbackDialog.value = false;
};


function getAvatarIcon(label: any) {
  const size = 80;
  const circleSize = 80;

  // Générer les initiales à partir du label
  const words = Boolean(label) ? label.split(' ') : ['N', 'A'];
  const initials = words.map((word: any) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique et légère pour l'avatar
  const colorHash = (Boolean(label) ? label.split('') : ['N', 'A']).reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
  const hue = (colorHash % 360);
  const saturation = 80;
  const lightness = 70;
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Dessiner le fond avec la couleur légère
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();
}


const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

onMounted(() => {
  recruitmentStore.fetchCandidateFeedbacks(searchQuery.value);
})

const pagination = computed({
  get() {
    return feedbackPagination.value
  },
  set(value) {
    recruitmentStore.setPagination(value);
  }
})

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
  recruitmentStore.fetchCandidateFeedbacks(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchCandidateFeedbacks(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchCandidateFeedbacks(searchQuery.value);
})

watch(
  () => selectedFeedback.value,
  async (newFeedback) => {
    if (newFeedback) {
      await recruitmentStore.fetchCandidateFeedbacks();
    }
  }
);

</script>

<style scoped>
.bg-backside {
  background-color: rgb(245, 255, 242);
}

.reply-button {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #d3d6d3;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  background-color: rgb(245, 255, 242);
}

.reply-button:hover {
  background-color: #04AA6D;
  color: white;
}
</style>