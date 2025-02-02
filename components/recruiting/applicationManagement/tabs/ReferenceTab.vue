<!-- src/components/recruiting/applicationManagement/tabs/ReferenceTab.vue -->
<template>
  <div>
    <div class="d-flex">
      <div class="ml-auto mb-2">
        <v-btn color="primary" @click="openAddReferenceDialog">Add Reference</v-btn>
      </div>
    </div>

    <!-- Reference Edit/Create Dialog -->
    <ReferenceEditDialog :modelValue="referenceDialog" :reference="selectedReference"
      @update:modelValue="referenceDialog = $event" @close="closeReferenceDialog" @save="saveReference" />

    <!-- Send Email Dialog -->
    <SendEmailDialog :contactSelect="selectContact" :selectedItems="selectedItems" :modelValue="emailDialog" @close="closeEmailDialog"/>
    
    <ReferenceFeedbackDialog :modelValue="feedbackDialog" :feedbackReference="selectedReference"
    @update:modelValue="feedbackDialog = $event" @close="closeFeedbackDialog" @save="saveReference" />

    <!-- References Data Table -->
    <SharedUiServerTable :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false"
      :headers="referenceHeaders" :items="references" :loading="loadingReferences" show-select return-object
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      v-model="selectedItems" @hoveredRow="hoveredRow = $event;" @update:options="pagination = $event"
      :selectable="true" @update:selectedFilters="selectedFilters = $event" dynamicSearch show-expand
      v-model:expanded="expandedRows">
      <template v-slot:item.actions="{ item }">
        <v-icon small color="secondary" class="mr-2" @click="editReference(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteReference(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
      </template>

      <!-- slot for bulk actions -->
      <template v-slot:bulkActions>
        <div>
          <v-btn small class="mr-1" color="primary" @click="openEmailDialog">
            <v-icon left>mdi-email-send</v-icon>
            Send Email
          </v-btn>

          <v-btn v-model="selectContact" small class="mr-1" color="primary" @click="openContactDialog">
            <v-icon left>mdi-message-text</v-icon>
            Contact
          </v-btn>
        </div>
      </template>
      <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
        <tr>
          <td :colspan="columns.length" style="height:100px;">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6" class="feedback-column">
                   
                    <div class="d-flex">
                      <div class="font-weight-bold text-grey" >
                        Feedback: 
                      </div>
                      <div class="ml-auto">
                        <span class="text-primary" style="cursor:pointer; font-size:small; 
                          border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px; 
                            padding: 4px; background-color: transparent;" 
                          @click="openFeedback(item)">Add Feedback</span>
                      </div>
                    </div>
                 
                  <v-card-text>
                    <div v-if="item.reference_feedback && item.reference_feedback.length > 0" class="reply-container">
                      <div v-for="(feedback, index) in item?.reference_feedback" :key="index" class="reply-item"
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
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <div v-if="item.documents && item.documents.length > 0">
                  <template v-for="(document, index) in item.documents" :key="index">
                    <v-list-item class="mb-2" style="border-radius:10px;">
                      <v-icon color="secondary">mdi-paperclip</v-icon>
                      <a :href="document.src" class="truncate"
                        style="width: calc(100% - 40px); text-decoration:none; border-bottom: 1px dotted; "
                        target="_blank">{{
                          document.name
                        }}</a>
                      <template v-slot:append>
                        <v-menu>
                          <template v-slot:activator="{ props: menu }">
                            <v-tooltip location="top">
                              <template v-slot:activator="{ props: tooltip }">
                                <v-hover>
                                  <template v-slot:default="{ isHovering, props: hover }">
                                    <v-card class=" ml-3 custom-button d-flex justify-center align-center"
                                      :variant="isHovering ? 'tonal' : 'flat'" density="compact" flat
                                      v-bind="mergeProps(menu, tooltip, hover)">
                                      <v-icon size="small">mdi-dots-horizontal</v-icon>
                                    </v-card>
                                  </template>
                                </v-hover>
                              </template>
                              <span>More Actions</span>
                            </v-tooltip>
                          </template>
                          <v-list density="compact">
                            <v-list-item append-icon="mdi-delete" class="text-red"
                              @click="deleteDocument(item, index)">Delete</v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-list-item>
                  </template>

                </div>
                <div v-else>
                  <p class="text-center text-grey">No documents available for this screening.</p>
                </div>
                  </v-col>
                 
                </v-row>
               
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, mergeProps } from 'vue';
import { useRecruitmentStore } from '~/stores/recruiting/applicationManagement/recruitmentStore';
import ReferenceEditDialog from '@/components/recruiting/applicationManagement/dialogs/ReferenceEditDialog.vue';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import type { Reference } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';
import SendEmailDialog from '../dialogs/SendEmailDialog.vue';
import ReferenceFeedbackDialog from '../dialogs/ReferenceFeedbackDialog.vue';

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  }
});



const emit = defineEmits(['uploadDocuments', 'deleteDocument']);

const recruitmentStore = useRecruitmentStore();

const expandedRows = ref([])

const emailDialog = ref(false)
const selectContact = ref(false)

const openEmailDialog = () => {
  emailDialog.value = true;
  selectContact.value = false
};

const openContactDialog = () => {
  emailDialog.value = true;
  selectContact.value = true
};

const closeEmailDialog = () => {
  emailDialog.value = false;
};

function findNewArrayIndex(arr1: any[], arr2: any[]) {
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      return references.value.indexOf(arr1[i])
    }
  }
  return -1
}

watch(expandedRows, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    let index = findNewArrayIndex(newVal, oldVal)
  }
})




const allReferences = computed(() => recruitmentStore.references);
const loadingReferences = computed(() => recruitmentStore.loadingReferences);
const { pagination: referencePagination, total_items } = storeToRefs(recruitmentStore)

const references = computed(() => {
  return allReferences.value.filter(reference => reference.application_id === parseInt(route.params.applicationId as string, 10));
});

const referenceDialog = ref(false);
const selectedReference = ref<Partial<Reference> | null>(null);

const feedbackDialog = ref(false)

const openAddReferenceDialog = () => {
  selectedReference.value = null;
  referenceDialog.value = true;
};

const editReference = (reference: Reference) => {
  selectedReference.value = reference;
  referenceDialog.value = true;
};

const closeReferenceDialog = () => {
  referenceDialog.value = false;
};

const openFeedback = (interview: Reference) => {
  selectedReference.value = interview;
  feedbackDialog.value = true;
}

const closeFeedbackDialog = () => {
  feedbackDialog.value = false;
}

const saveReference = async (reference: Partial<Reference>) => {
  referenceDialog.value = false;
  if (reference.id) {
    await recruitmentStore.updateReference(reference.id, reference);
  } else {
    await recruitmentStore.createReference(reference);
  }
  await recruitmentStore.fetchReferences();
};

const layoutStore = useLayoutStore();

const deleteReference = async (reference: Reference) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this reference ?`)
  if (confirm) {
    await recruitmentStore.deleteReference(reference.id);
    await recruitmentStore.fetchReferences();
  }
}

const deleteDocument = async (item: Reference, index: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this document ?`)
  
  if (confirm) {
    const filterref = references.value.find(reference => reference.id === item.id)
    filterref?.documents?.splice(index, 1)
    await recruitmentStore.updateReference(item.id, item);
    await recruitmentStore.fetchReferences();
  }
}

// Table Headers
const referenceHeaders = [
  { title: 'Type', value: 'reference_type' },
  { title: 'Contact', value: 'reference_contact' },
  { title: 'Email', value: 'reference_email' },
  { title: 'Status', value: 'status' },
  { title: 'Requested At', value: 'requested_at' },
  { title: 'Completed At', value: 'completed_at' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'Completed':
      return 'primary';
    case 'Rejected':
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
  recruitmentStore.fetchReferences(searchQuery.value);
})
const pagination = computed({
  get() {
    return referencePagination.value
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
  recruitmentStore.fetchReferences(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchReferences(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchReferences(searchQuery.value);
})


</script>

<style scoped>
/* Add your styles here */

.feedback-column {
  border-right: 2px solid rgb(var(--v-theme-primary));
  padding-right: 16px; /* Espacement pour éviter que le texte ne touche le trait */
}
</style>