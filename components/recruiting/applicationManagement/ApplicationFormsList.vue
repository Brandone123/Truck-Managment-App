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


    <v-row v-if="loading && !applicationForms.length">
      <v-col cols="12" md="4" v-for="(i) in 6" :key="i">
        <v-skeleton-loader :loading="loading" type="image">
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="(form, index) in applicationForms" :key="index">
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
                      @startApplication="openWebform(form.id)" @print="printForm(form.id)"
                      @viewVersionDetails="viewFormDetails(form)" @copy="createFormCopy(form)"
                      @viewHistory="viewHistory(form)" @delete="deleteForm(form.id)" />
                  </div>
                  <div class="form-description ">{{ form.description || "NA" }}</div>
                </v-card-text>

                <v-list>
                  <v-list-item @click="viewDetails(form.id as number, 'application-form')">
                    Items
                    <template v-slot:append>
                      <v-chip>{{ form.current_version?.elements?.length ?? 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <SharedTableDynamicTechnicianItem v-if="form.creator" :technician="form.creator" />
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
      <v-col cols="12" v-if="!applicationForms.length && !loading">
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
      :form="selectedForm.current_version || { application_form_id: selectedForm.id, elements: [] }" @save="saveForm" />

    <FormVersionSelector v-model="formVersionDialog" :versions="selectedForm.versions || []"
      :currentVersionId="selectedForm.current_version?.id ?? 0" @selection="viewVersionDetails" />

    <CopyInspectionForm v-model="copyApplicationDialog" :form="(selectedForm as any)" @save="saveFormCopy" />

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';
import ElementsEditDialog from '~/components/recruiting/applicationManagement/FormActions/ElementsEditDialog.vue';
import FormVersionSelector from '~/components/recruiting/applicationManagement/FormActions/FormVersionSelector.vue';
import CopyInspectionForm from '~/components/recruiting/applicationManagement/FormActions/CopyInspectionForm.vue';
import FormActions from '~/components/recruiting/applicationManagement/FormActions/FormActionsMenu.vue';

import { useRouter } from 'vue-router';
const router = useRouter();

const layoutStore = useLayoutStore();

const props = defineProps({
  applicationForms: {
    type: Array as PropType<ApplicationForm[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },

});

const emit = defineEmits(['edit', 'delete', 'update:pagination']);

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

const selectedFilters = ref<Record<string, any>>({})

const activeFilter = ref<string>('all')

const applicantStore = ApplicantApplicationStore();

const { pagination: applicantionFormPagination, total_pages, totalApplicationForms, applicationForms } = storeToRefs(applicantStore);


const pagination = computed({
  get() {
    return applicantionFormPagination.value
  },
  set(value) {
    applicantStore.setPagination(value);
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

  // if (activeFilter.value != 'all') {
  //   payload['filters'].status = activeFilter.value
  // }

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
  await applicantStore.updateApplicationForm(form.id, form);
};

const viewVersionDetails = (version: any) => {
  router.push({
    path: `/recruiting/applicationManagement/ApplicationForms/${selectedForm.value.id}`,
    query: { v: version }
  })
}

const viewDetails = (formId: number, tabValue?: string) => {
  router.push({
    path: `/recruiting/applicationManagement/ApplicationForms/${formId}`,
    query: { tab: tabValue }
  })
}

//form action handlers
const selectedForm = ref<Partial<ApplicationForm>>({})

const elementEditDialog = ref(false);
const copyApplicationDialog = ref(false);
const formVersionDialog = ref(false);

const editFormElements = (form: ApplicationForm) => {
  selectedForm.value = JSON.parse(JSON.stringify(form))
  elementEditDialog.value = true
}

const openWebform = (formId: number) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || "http://localhost:8000"
  window.open(`${apiUrl}/recruiting/application/forms/${formId}`, '_blank');
}

const printForm = (formId: number) => {

}

const viewFormDetails = (form: ApplicationForm) => {
  router.push({
    path: `/recruiting/applicationManagement/ApplicationForms/${form.id}`
  })
}

const createFormCopy = (form: ApplicationForm) => {
  selectedForm.value = form
  copyApplicationDialog.value = true
}

const saveFormCopy = async (payload: any) => {
  await applicantStore.copyApplicationForm(selectedForm.value.id as number, payload)
  await applicantStore.fetchApplicationForms(searchQuery.value);
}

const viewHistory = (form: ApplicationForm) => {
  selectedForm.value = form
  formVersionDialog.value = true
}

const deleteForm = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this form application ?`)
  if (confirm) {
    await applicantStore.deleteApplicationForm(id);
  }
}

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  applicantStore.fetchApplicationForms(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  // if (!_isEqual(newVal, oldVal)) {
  selectedItems.value = [];
  applicantStore.fetchApplicationForms(searchQuery.value);
  // }
}, { deep: true })

// watch(() => activeFilter.value, () => {
//   selectedItems.value = [];
//   applicantStore.fetchApplicationForms(searchQuery.value);
// })

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