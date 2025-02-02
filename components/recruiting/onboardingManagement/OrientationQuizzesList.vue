<!-- src/components/recruiting/ApplicationFormsList.vue -->

<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class=" mx-n4 px-4 pb-2 pt-1 grey-background position-sticky">
      <v-row class="mt-2">
        <v-col cols="12" md="4" lg="3" class="d-flex ml-auto">
          <v-text-field density="comfortable" v-model="search" variant="solo" placeholder="Search" clearable
            @click:clear="searchTable" @input="searchTable" @keydown.enter="searchTable">
          </v-text-field>
        </v-col>
      </v-row>
    </div>


    <v-row v-if="loading && !quizzes.length">
      <v-col cols="12" md="4" v-for="(i) in 6" :key="i">
        <v-skeleton-loader :loading="loading" type="image">
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-divider class="mb-2"></v-divider>
    <v-row>
      <v-col cols="12" md="4" v-for="(form, index) in quizzes" :key="index">
        <v-skeleton-loader :loading="loading" type="image">
          <v-responsive>
            <v-hover v-slot="{ isHovering, props }">
              <v-card :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }" v-bind="props">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <span class="font-weight-bold text-h6 form-title">
                      {{ form.name }}
                    </span>
                    <FormActions variant="hover-button" :isHovering="isHovering" :currentVersion="true"
                      :disabled="false" @editElements="editFormElements(form)" @edit="$emit('edit', form)"
                      @print="printForm(form.id)" @viewVersionDetails="viewFormDetails(form)"
                      @copy="createFormCopy(form)" @viewHistory="viewHistory(form)" @delete="deleteForm(form.id)" />
                  </div>
                  <div class="form-description ">{{ form.description || "NA" }}</div>
                </v-card-text>

                <v-list>
                  <v-list-item @click="viewDetails(form.id as number, 'quiz-form')">
                    Items
                    <template v-slot:append>
                      <v-chip>{{ form.current_version?.elements?.length ?? 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <SharedTableDynamicTechnicianItem v-if="form.created_by" :technician="form.creator" />
                    <!-- <template v-slot:append>
                      <v-chip>
                        {{ form.version }}
                      </v-chip>
                    </template> -->
                  </v-list-item>
                </v-list>
              </v-card>
            </v-hover>
          </v-responsive>
        </v-skeleton-loader>
      </v-col>
      <!-- custom display when no items present -->
      <v-col cols="12" v-if="!quizzes.length && !loading">
        <v-card class="d-inline" style="min-width: 100px">
          <v-card-text class="d-flex justify-center text-body-1">
            NO ITEMS
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex mt-4 pa-2 justify-center">
      <v-pagination :disabled="loading" :length="total_pages" v-model="pagination.page" :items="4" color="primary"
        next-icon="mdi-menu-right" prev-icon="mdi-menu-left"></v-pagination>
    </div>

    <ElementsEditDialog v-model="elementEditDialog"
      :form="selectedForm.current_version || { quiz_form_id: selectedForm.id, elements: [] }" @save="saveForm" />

    <FormVersionSelector v-model="formVersionDialog" :versions="selectedForm.versions || []"
      :currentVersionId="selectedForm.current_version?.id ?? 0" @selection="viewVersionDetails" />

    <CopyInspectionForm v-model="copyOnboardingDialog" :form="(selectedForm as any)" @save="saveFormCopy" />

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { OrientationQuiz } from '@/types/recruiting/onboardingOrientation';
import ElementsEditDialog from '~/components/recruiting/onboardingManagement/FormActions/ElementsEditDialog.vue';
import FormVersionSelector from '~/components/recruiting/onboardingManagement/FormActions/FormVersionSelector.vue';
import CopyInspectionForm from '~/components/recruiting/onboardingManagement/FormActions/CopyInspectionForm.vue';
import FormActions from '~/components/recruiting/onboardingManagement/FormActions/FormActionsMenu.vue';
import { useRouter } from 'vue-router';
import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';

const router = useRouter();

const layoutStore = useLayoutStore();

const props = defineProps({
  quizzes: {
    type: Array as PropType<OrientationQuiz[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete', 'saveCopy', 'save']);

const selectedItems = ref<Array<any>>([]);

const selectedFilters = ref<Record<string, any>>({})

const activeFilter = ref<string>('all')

const storeOnboarding = OnboardingOrientationQuizStore();

const { pagination: onboardingPagination, total_pages } = storeToRefs(storeOnboarding);


const pagination = computed({
  get() {
    return onboardingPagination.value
  },
  set(value) {
    storeOnboarding.setPagination(value);
  }
})

const search = ref('');

const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isTyping = ref<boolean>(false)

const searchTable = () => {
  isTyping.value = true

  // 1) Clear any previously scheduled timer
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }

  // 2) Start a new timer (e.g., 500ms)
  typingTimer.value = setTimeout(() => {
    // The user hasn't typed for 500ms
    isTyping.value = false
    pagination.value.search = (search.value ?? '').trim().toLowerCase();
  }, 500)
}

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
    payload['page'] = 1
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all') {
    payload['filters'].status = activeFilter.value
  }

  return payload
})

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

defineExpose({
  searchQuery,
  setSelectedItems
})

const saveForm = async (form: any) => {
  emit('save', form)
};

const viewVersionDetails = (version: any) => {
  router.push({
    path: `/recruiting/onboardingManagement/OrientationQuizzesPage/${selectedForm.value.id}`,
    query: { v: version }
  })
}

const viewDetails = (quizId: number, tabValue?: string) => {
  router.push({
    path: `/recruiting/onboardingManagement/OrientationQuizzesPage/${quizId}`,
    query: { tab: tabValue }
  })
}

//form action handlers
const selectedForm = ref<Partial<OrientationQuiz>>({})

const elementEditDialog = ref(false);
const copyOnboardingDialog = ref(false);
const formVersionDialog = ref(false);

const editFormElements = (form: OrientationQuiz) => {
  selectedForm.value = JSON.parse(JSON.stringify(form))
  elementEditDialog.value = true
}

const openWebform = (formId: number) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || "http://localhost:8000"
  window.open(`${apiUrl}/application/forms/${formId}`, '_blank');
}

const printForm = (formId: number) => {

}

const viewFormDetails = (form: OrientationQuiz) => {
  router.push({
    path: `/recruiting/onboardingManagement/OrientationQuizzesPage/${form.id}`
  })
}

const createFormCopy = (form: OrientationQuiz) => {
  selectedForm.value = form
  copyOnboardingDialog.value = true
}

const saveFormCopy = async (payload: any) => {
  emit('saveCopy', { id: selectedForm.value.id, payload })
}

const viewHistory = (form: OrientationQuiz) => {
  selectedForm.value = form
  formVersionDialog.value = true
}

const deleteForm = async (id: number) => {
  emit('delete', id)
}
</script>

<style scoped>
/* Add your styles here */

.form-title {
  /* line-height: 1.25rem;
  height: 40px; */
  /* Limit height  equals two lines of 1.25rem height , or 20px */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  /* Number of lines to show */
  line-clamp: 1;
}


.form-description {
  line-height: 1.25rem;
  height: 40px;
  /* Limit height  equals two lines of 1.25rem height , or 20px */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* Number of lines to show */
  line-clamp: 2;
  text-overflow: ellipsis;
}
</style>