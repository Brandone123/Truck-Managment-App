<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Inspection Forms</span>
      <v-btn color="primary" @click="openCreateFormDialog">Create Inspection Form</v-btn>
    </div>

    <InspectionFormDetailsDialog :modelValue="formDetailsDialog" :form="selectedForm"
      @update:modelValue="formDetailsDialog = $event" @close="closeFormDetailsDialog" />
    <InspectionFormEditDialog :modelValue="formEditDialog" :form="selectedForm"
      @update:modelValue="formEditDialog = $event" @close="closeFormEditDialog" @save="saveForm" />

    <InspectionFormPublishDialog :form="selectedForm" />

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-file-document-outline</v-icon>
              <span>Total Forms</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ formSummary.total }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-check-circle-outline</v-icon>
              <span>Active Forms</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ formSummary.active }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-file-document-edit-outline</v-icon>
              <span>Draft Forms</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ formSummary.draft }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InspectionFormList :forms="forms" :loading="loadingForms" @view="viewForm" @edit="editForm"
          @delete="deleteForm" @publish="publishForm" />
      </v-col>
    </v-row>

    <v-row>
      <!-- Notifications and Alerts Section -->
      <v-col cols="12" md="5">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Notifications and Alerts</v-card-title>
        </div>
        <v-row>
          <v-col cols="12">
            <v-card class="px-0">
              <v-card-text>
                <v-alert density="compact" class="mb-2" dense type="info" v-for="alert in notifications"
                  :key="alert.id">
                  {{ alert.message }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div>
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Form Status Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="formStatusOptions" :series="formStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->

      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Form Creation</v-card-title>
        </div>
        <v-card class="">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyFormCreationOptions"
                      :series="monthlyFormCreationOptions.series" />
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useInspectionFormStore } from '@/stores/maintenance/inspectionForm';
import InspectionFormList from '@/components/maintenance/preventiveManagement/form/InspectionFormList.vue';
import InspectionFormDetailsDialog from '@/components/maintenance/preventiveManagement/form/InspectionFormDetailsDialog.vue';
import InspectionFormEditDialog from '@/components/maintenance/preventiveManagement/form/InspectionFormEditDialog.vue';
import InspectionFormPublishDialog from '~/components/maintenance/preventiveManagement/form/InspectionFormPublishDialog.vue';
import 'apexcharts/dist/apexcharts.css';
import { v4 as uuidv4 } from 'uuid';

const inspectionFormStore = useInspectionFormStore();
const techniciansStore = useTechniciansStore();

// set initital data
inspectionFormStore.setInitialData()
const layoutStore = useLayoutStore()

onMounted(()=>{
  techniciansStore.fetchTechnicians()
  inspectionFormStore.fetchForms()
})

const { forms, loading: loadingForms, formSummary, notifications, chartData } = storeToRefs(inspectionFormStore);

const formDetailsDialog = ref(false);
const formEditDialog = ref(false);
const inspectionPublishDialog = ref(false);

const defaultForm = {
  id: null,
  name: '',
  type: '',
  status: '',
  elements: [],
  workflows: [{
    id: uuidv4(),
    trigger: {
      selected: 'item_fail',
      inspection_items: ['all'],
    },
    actions: {
      change_vehicle_status: {
        active: false,
        status: '',
      },
      send_an_email: {
        active: false,
        send_to_vehicle_watchers: false,
        users: []
      },
      create_an_issue: {
        active: true,
      }
    },

    description: 'Create issues automatically',
    active: true
  }]
}
const selectedForm = ref(JSON.parse(JSON.stringify(defaultForm)))

const monthlyFormCreationOptions = computed(() => {
  return {
    series: [
      {
        name: 'Forms Created',
        data: chartData.value.monthly.series
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: chartData.value.monthly.categories
    },
    yaxis: {
      title: {
        text: 'Number of Forms'
      }
    },
    colors: ['#22a7f0']
  }
});

const formStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.formStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const formStatusSeries = computed(() => chartData.value.formStatus.series);

const openCreateFormDialog = () => {
  selectedForm.value = JSON.parse(JSON.stringify(defaultForm))
  formEditDialog.value = true;
};

const viewForm = (form: any) => {
  selectedForm.value = form;
  formDetailsDialog.value = true;
};

const editForm = (form: any) => {
  selectedForm.value = form;
  formEditDialog.value = true;
};

const deleteForm = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this form ?")

  if (confirm) {
    await inspectionFormStore.deleteForm(id);
  }
};

const publishForm = (form: any) => {
  selectedForm.value = form;
  inspectionPublishDialog.value = true;
};

const closeFormDetailsDialog = () => {
  formDetailsDialog.value = false;
};


const closeInspectionPublishDialog = () => {
  inspectionPublishDialog.value = false;
}
const closeFormEditDialog = () => {
  formEditDialog.value = false;
};

const saveForm = async (form: any) => {
  if (form.id) {
    await inspectionFormStore.updateForm(form);
  } else {
    await inspectionFormStore.createForm(form);
  }
  formEditDialog.value = false;
};

const savePublishInspection = async (publishForm: any) => {
  // publish logic
}

onMounted(() => {
  inspectionFormStore.fetchForms();
  inspectionFormStore.fetchNotifications();
  inspectionFormStore.fetchChartData();
});
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #CE0053;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #424656;
}
</style>