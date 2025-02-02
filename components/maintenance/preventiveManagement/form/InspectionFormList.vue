<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class=" mx-n4 px-4 pb-2 pt-1 grey-background position-sticky">
      <v-row class="mt-2">
        <v-col cols="12" md="8" lg="9" class="pb-0">
          <v-tabs v-model="activeFilter" color="primary" density="compact">
            <v-tab value="active" class="text-none">
              Active
              <v-chip density="compact" class="ml-1" :color="activeFilter == 'active' ? 'primary' : ''">
                <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
                  indeterminate></v-progress-circular>
                <span v-else>{{ formSummary?.active || 0 }}</span>
              </v-chip>
            </v-tab>

            <v-tab value="archived" class="text-none">
              Archived
              <!-- <v-chip density="compact" class="ml-1 bg-primary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ inspectionSummary?.passed || 0 }}</span>
          </v-chip> -->
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" md="4" lg="3" class="pb-0">
          <v-text-field density="comfortable" v-model="search" variant="solo" label="Search" clearable
            @click:clear="searchTable">
            <template v-slot:append-inner>
              <v-btn flat color="primary" class="mr-n2" @click="searchTable"><v-icon>mdi-magnify</v-icon></v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>


    <v-row v-if="loading && !forms.length">
      <v-col cols="12" md="4" v-for="(i) in 6" :key="i">
        <v-skeleton-loader :loading="loading" type="image">
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="(form, index) in forms" :key="index">
        <v-skeleton-loader :loading="loading" type="image">
          <v-responsive>
            <v-hover v-slot="{ isHovering, props }">
              <v-card :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }" v-bind="props">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <span class="font-weight-bold text-h6">
                      {{ form.name }}
                    </span>
                    <FormActions v-if="form.status == 'active'" variant="hover-button" :isHovering="isHovering"
                      :currentVersion="true" :disabled="false" @editElements="editFormElements(form)"
                      @editWorkflows="editFormWorkFlows(form.id)" @edit="$emit('edit', form)"
                      @startInspection="openWebform(form.id)" @print="printForm(form.id)"
                      @viewVersionDetails="viewFormDetails(form)" @copy="createFormCopy(form)"
                      @viewHistory="viewHistory(form)" @archiveForm="archiveForm(form.id)" />
                    <!-- <FormMenu  :isHovering="isHovering" @edit="emit('edit', form)" @delete="emit('delete', form)" @openWebForm="openWebform(parseInt(form.id))"/> -->
                    <FormArchiveActionsMenu :isHovering="isHovering" variant="hover-button"
                      v-if="form.status == 'archived'" close-on-content-click @viewHistory="formVersionDialog = true"
                      @restore="restoreForm(form.id)" @delete="$emit('delete', form.id)" />
                  </div>
                  <div class="form-description ">{{ form.description }}</div>
                </v-card-text>

                <v-list>
                  <v-list-item @click="viewDetails(form.id as number, 'inspection-form')">
                    Items
                    <template v-slot:append>
                      <v-chip>{{ form.current_version?.elements?.length ?? 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="viewDetails(form.id as number, 'workflow')">
                    Workflows
                    <template v-slot:append>
                      <v-chip>
                        {{ form.current_version?.workflows?.length ?? 0 }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <!--  <v-divider></v-divider>

             <v-list-item @click="">
                Vehicles
                <template v-slot:append>
                  Add
                </template>
              </v-list-item>
              <v-divider></v-divider> -->

                  <!-- <v-list-item @click="">
                Submissions
                <template v-slot:append>
                  <v-chip>
                    0
                  </v-chip>
                </template>
              </v-list-item> -->
                </v-list>
              </v-card>
            </v-hover>
          </v-responsive>
        </v-skeleton-loader>
      </v-col>
      <!-- custom display when no items present -->
      <v-col cols="12" v-if="!forms.length && !loading">
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
      :form="selectedForm.current_version || { inspection_form_id: selectedForm.id, elements: [] }" @save="saveForm" />

    <FormVersionSelector v-model="formVersionDialog" :versions="selectedForm.versions || []"
      :currentVersionId="selectedForm.current_version?.id ?? 0" @selection="viewVersionDetails" />

    <CopyInspectionForm v-model="copyInspectionDialog" :form="(selectedForm as any)" @save="saveFormCopy" />

  </div>
</template>
<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import FormMenu from './InspectionFormItemMenu.vue'
import type { InspectionFormElement, Workflow, InspectionForm } from '@/types/maintenance/inspectionForm';
import ElementsEditDialog from '~/components/maintenance/preventiveManagement/form/FormActions/ElementsEditDialog.vue';
import FormVersionSelector from '~/components/maintenance/preventiveManagement/form/FormActions/FormVersionSelector.vue';
import CopyInspectionForm from '~/components/maintenance/preventiveManagement/form/FormActions/CopyInspectionForm.vue';
import FormActions from '~/components/maintenance/preventiveManagement/form/FormActions/FormActionsMenu.vue';
import FormArchiveActionsMenu from '~/components/maintenance/preventiveManagement/form/FormActions/FormArchiveActionsMenu.vue';

const router = useRouter();

const layoutStore = useLayoutStore();

const emit = defineEmits(['edit', 'delete'])

const viewDetails = (formId: number, tabValue?: string) => {
  router.push({
    path: `/maintenance/InspectionForms/${formId}`,
    query: { tab: tabValue }
  })
}

const inspectionFormStore = useInspectionFormStore();
const {
  forms,
  pagination: formPagination,
  loadingSummary,
  formSummary,
  loading,
  total_pages,
  getFormList,
} = storeToRefs(inspectionFormStore);


const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>('active')

const openWebform = (formId: number) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || "http://localhost:8000"
  window.open(`${apiUrl}/inspection/forms/${formId}`, '_blank');
}

// const filteredFormList = computed(() => {
//   const regex = new RegExp(search.value, 'i'); // 'i' flag makes it case-insensitive
//   return forms.value.filter(form => regex.test(form.name) && activeFilter.value == 'all' ? true : form.status == activeFilter.value)
// })

const pagination = computed({
  get() {
    return formPagination.value
  },
  set(value) {
    inspectionFormStore.setPagination(value);
  }
})

const search = ref('');

const searchTable = () => {
  pagination.value.search = (search.value ?? '').trim().toLowerCase();
  console.log(pagination.value.search)
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

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  inspectionFormStore.fetchForms(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  // if (!_isEqual(newVal, oldVal)) {
  selectedItems.value = [];
  inspectionFormStore.fetchForms(searchQuery.value);
  // }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  inspectionFormStore.fetchForms(searchQuery.value);
})

onMounted(() => {
  inspectionFormStore.fetchForms(searchQuery.value)
})




//form action handlers
const selectedForm = ref<Partial<InspectionForm>>({})

const elementEditDialog = ref(false);
const formVersionDialog = ref(false);
const copyInspectionDialog = ref(false);

const editFormElements = (form: InspectionForm) => {
  selectedForm.value = JSON.parse(JSON.stringify(form))
  elementEditDialog.value = true
}

const saveForm = async (form: any) => {
  await inspectionFormStore.updateForm(form);
};

const viewVersionDetails = (version: any) => {
  router.push({
    path: `/maintenance/InspectionForms/${selectedForm.value.id}`,
    query: { v: version }
  })
}


const archiveForm = async (formId: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to archive this form ?")

  if (confirm) {
    let payload = {
      id: formId,
      status: 'archived'
    }
    await inspectionFormStore.updateForm(payload as any)
    await inspectionFormStore.fetchForms(searchQuery.value)
  }
};


const restoreForm = async (formId: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to restore this form ?")

  if (confirm) {
    let payload = {
      id: formId,
      status: 'active'
    }
    await inspectionFormStore.updateForm(payload as any)
    await inspectionFormStore.fetchForms(searchQuery.value)
  }
};


const editFormWorkFlows = (formId: number) => {
  router.push({
    path: `/maintenance/InspectionForms/${formId}`,
    query: { tab: 'workflow' }
  })
}

const editForm = (form: InspectionForm) => {

}

const printForm = (formId: number) => {

}

const viewFormDetails = (form: InspectionForm) => {
  router.push({
    path: `/maintenance/InspectionForms/${form.id}`
  })
}

const createFormCopy = (form: InspectionForm) => {
  selectedForm.value = form
  copyInspectionDialog.value = true
}


const saveFormCopy = async (payload: any) => {
  await inspectionFormStore.copyInspectionForm(selectedForm.value.id as number, payload)
  await inspectionFormStore.fetchForms(searchQuery.value);
}

const viewHistory = (form: InspectionForm) => {
  selectedForm.value = form
  formVersionDialog.value = true
}

</script>

<style scoped>
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