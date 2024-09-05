<template>
  <div class="mt-n5 mb-n5 ml-n5 mr-n5">
    <div class="d-flex flex-row" style="position:relative;height:calc(100vh - 48px )">
      <v-sheet class="pa-2" style="width:273px;height:100%;position:fixed;top:48px;">
        <div class="pa-3">
          <v-text-field v-model="searchText" label="Search Reports" density="compact" variant="outlined" single-line
            hide-details append-inner-icon="mdi-magnify"></v-text-field>
        </div>
        <v-list density="compact">
          <v-list-subheader>Report Type</v-list-subheader>
          <v-list-item @click="previewType = 'all'; currentReportType = 'Standard'" style="font-size:small"
            :style="{ backgroundColor: currentReportType === 'Standard' ? 'rgba(var(--v-theme-secondary), 0.1)' : '' }">
            <div class="d-flex">
              <span style="font-weight: bold;" :class="{ 'text-secondary': currentReportType === 'Standard' }">
                <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                Standard Reports
              </span>
            </div>
          </v-list-item>
          <v-divider></v-divider>
          <template v-for="(group, index) in templateGroups" :key="index">
            <v-list-item @click="previewType = group.value; currentReportType = group.title"
              style="font-size:small; font-weight: bold;"
              :style="{ backgroundColor: currentReportType === group.title ? 'rgba(var(--v-theme-secondary), 0.1)' : '' }">
              <div class="d-flex">
                <span :class="{ 'text-secondary': currentReportType === group.title }">
                  <v-icon class="mr-2">{{ getIcon(group.value) }}</v-icon>
                  {{ group.title }}
                </span>
                <div class="ml-auto">
                  <v-chip :class="{ 'text-white': currentReportType === group.title }" density="compact" variant="tonal"
                    :style="{ backgroundColor: currentReportType === group.title ? 'rgba(var(--v-theme-secondary))' : '' }">
                    {{ templateGroupStats[group.value] }}
                  </v-chip>
                </div>
              </div>
            </v-list-item>
            <v-divider v-if="index + 1 < templateGroups.length"></v-divider>
          </template>
        </v-list>
      </v-sheet>
      <div class="flex-grow-1 grey-background"
        style="position:absolute;width:calc(100% - 273px);left:273px; overflow-y:auto;">
        <div class="pa-5" style="width:100%;">
          <div class="d-flex justify-space-between mb-3">
            <div>
              <span class="text-primary text-h6">{{ currentReportType }} Reports</span>
            </div>
            <div class="ml-auto">
              <v-btn color="primary" @click="openCreateTemplateDialog">Create New Template</v-btn>
            </div>
          </div>
          <v-row>
            <v-col v-for="(template, index) in filteredTemplates" :key="index" cols="12" md="6">
              <ReportTemplateCard :template="template" @click="viewTemplate(template.name)"
                @edit="editTemplate(template)" @delete="deleteTemplate(template)" :templateGroups="templateGroups" />
            </v-col>
          </v-row>
          <div v-if="templates.length === 0" class="text-center text-grey mt-16"
            style="align-items: center; justify-content: center">
            <div>
              <v-icon size="100">mdi-file-document</v-icon>
            </div>
            <span>You haven't created any reports.</span>
          </div>
        </div>
      </div>
    </div>

    <CreateReportTemplateDialog :modelValue="createTemplateDialog" :template="currentTemplate"
      :templateGroups="templateGroups" @update:modelValue="createTemplateDialog = $event" @save="saveTemplate" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import ReportTemplateCard from '@/components/maintenance/reports/reportTemplate/ReportTemplateCard.vue';
import CreateReportTemplateDialog from '@/components/maintenance/reports/reportTemplate/CreateReportTemplateDialog.vue';
import { useReportTemplateStore } from '@/stores/maintenance/reportTemplateStore';
import type { ReportTemplate } from '@/types/maintenance/reportTemplate';
import { useRouter, useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid';

const router = useRouter()
const route = useRoute()

const reportTemplateStore = useReportTemplateStore();
const { templates, loading } = storeToRefs(reportTemplateStore);

const layoutStore = useLayoutStore();

const createTemplateDialog = ref(false);

const currentTemplate = ref<ReportTemplate>({
  name: null,
  group: null,
  description: null,
  masterTable: null,
  masterTableColumns: [],
  relatedTables: [],
  filters: [],
  columnHeaders: [],
  masterJsonTable: null,
  masterJsonRelatedTables: [],
  masterJsonTableColumns: [],
  jsonFilters: [],
  arrayDataSelection: [],
} as any as ReportTemplate)

const openCreateTemplateDialog = () => {
  currentTemplate.value = {
    name: null,
    group: null,
    description: null,
    masterTable: null,
    masterTableColumns: [],
    relatedTables: [],
    filters: [],
    columnHeaders: [],
    masterJsonTable: null,
    masterJsonRelatedTables: [],
    masterJsonTableColumns: [],
    jsonFilters: [],
    arrayDataSelection: [],
  } as any as ReportTemplate
  createTemplateDialog.value = true;
};

const previewType = ref('all'); // Default to 'all' to show all templates
const currentReportType = ref('Standard');
const searchText = ref('');
const selectedReportType = ref('all');

const filteredTemplates = computed(() => {
  return templates.value?.filter(item => {
    const matchesGroup = previewType.value === 'all' || item.group === previewType.value;
    const matchesSearch = item.name.toLowerCase().includes(searchText.value.toLowerCase());
    return matchesGroup && matchesSearch;
  }) || [];
});


const templateGroups = ref([
  { title: 'Vehicles', value: 'vehicles' },
  { title: 'Vehicle Assignments', value: 'vehicle_assignments' },
  { title: 'Inspections', value: 'inspections' },
  { title: 'Issues', value: 'issues' },
  { title: 'Service', value: 'service' },
  { title: 'Work Orders', value: 'work_orders' },
  { title: 'Contacts', value: 'contacts' },
  { title: 'Parts', value: 'parts' },
  { title: 'Fuel', value: 'fuel' }
]);



const getIcon = (value: any) => {
  switch (value) {
    case 'vehicles':
      return 'mdi-car-outline';
    case 'vehicle_assignments':
      return 'mdi-account-plus-outline';
    case 'inspections':
      return 'mdi-clipboard-text-outline';
    case 'issues':
      return 'mdi-alert-circle-outline';
    case 'service':
      return 'mdi-wrench-outline';
    case 'work_orders':
      return 'mdi-clipboard-list-outline';
    case 'contacts':
      return 'mdi-account-group-outline';
    case 'parts':
      return 'mdi-package-variant-closed';
    case 'fuel':
      return 'mdi-gas-station-outline';
    default:
      return 'mdi-help-circle-outline';
  }
}

const editTemplate = (template: ReportTemplate) => {
  currentTemplate.value = template;
  createTemplateDialog.value = true
}

const viewTemplate = (templateName: string) => {
  const template = filteredTemplates.value.find((t: any) => t.name === templateName);
  if (template) {
    router.push({ path: `/maintenance/ReportsGeneration/details/${template.id}` })
  }
};

const templateGroupStats = computed(() => {
  return templateGroups.value.reduce((acc: Record<string, any>, item) => {
    acc[item.value] = getTemplateCount(item.value);
    return acc;
  }, {});
});

const getTemplateCount = (group: string) => {
  if (templates.value) {
    return templates.value.filter(template => template.group === group).length;
  }
  return 0;
};

const saveTemplate = async (template: ReportTemplate) => {
  if (template.id) {
    //update
    await reportTemplateStore.updateTemplate(template)
  } else {
    await reportTemplateStore.createTemplate({ ...template, id: uuidv4() })
    //create
  }
}

const deleteTemplate = async (template: ReportTemplate) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete report template ?")

  if (confirm) {
    await reportTemplateStore.deleteTemplate(template.id);
  }
}

const groupedTemplates = computed(() => {
  const groups: { [key: string]: ReportTemplate[] } = {};
  reportTemplateStore.templates.forEach(template => {
    const group = template.group || 'Ungrouped';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(template);
  });
  return groups;
});

onMounted(() => {
  reportTemplateStore.fetchTemplates();
});

</script>

<style scoped></style>
