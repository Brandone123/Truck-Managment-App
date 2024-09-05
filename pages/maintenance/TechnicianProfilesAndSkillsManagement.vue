<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Technician Profiles and Skills Management</span>
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="primary" class="mr-3">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="openImportDialog">
              <template v-slot:append>
                <v-icon>mdi-cloud-upload-outline</v-icon>
              </template>
              <v-list-item-title>
                Import
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <template v-slot:append>
                <v-icon>mdi-cloud-download-outline</v-icon>
              </template>
              <v-list-item-title>
                Export
              </v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>
        <v-btn color="primary" @click="openAddTechnicianDialog">Add Technician</v-btn>
     </div>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-account-cog-outline</v-icon>
              <span>Total Technicians</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ technicianSummary.totalTechnicians }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-book-account</v-icon>
              <span>Total Skills</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ technicianSummary.totalSkills }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-certificate-outline</v-icon>
              <span>Total Certifications</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ technicianSummary.totalCertifications }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <TechniciansTable @view="viewTechnician" @edit="editTechnician" @delete="deleteTechnician" />
      </v-col>
    </v-row>

    <TechnicianDetailsDialog :modelValue="detailsDialog" :technician="selectedTechnician" @update:modelValue="detailsDialog = $event" />
    <TechnicianEditDialog :modelValue="editDialog" :technician="selectedTechnician" @update:modelValue="editDialog = $event" @save="saveTechnician" />
    <DeleteTechnicianDialog :modelValue="deleteDialog"  @update:modelValue="deleteDialog = $event" @confirm="confirmDeleteTechnician" />
    <ImportTechnicianProfile :modelValue="importDialog" @update:modelValue="importDialog = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import TechniciansTable from '@/components/maintenance/technician/profile/TechniciansTable.vue';
import TechnicianDetailsDialog from '@/components/maintenance/technician/profile/TechnicianDetailsDialog.vue';
import TechnicianEditDialog from '@/components/maintenance/technician/profile/TechnicianEditDialog.vue';
import DeleteTechnicianDialog from '@/components/maintenance/technician/profile/DeleteTechnicianDialog.vue';
import ImportTechnicianProfile from '@/components/maintenance/technician/profile/ImportTechnicianProfile.vue'; // Import the ImportTechnicianProfile component
import { useTechniciansStore } from '@/stores/maintenance/techniciansStore';
import type { Technician } from '@/types/maintenance/technicianTypes';

const techniciansStore = useTechniciansStore();
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedTechnician = ref<Partial<Technician>>({certifications:[], skills:[]} as Partial<Technician>);

const technicianSummary = computed(() => techniciansStore.technicianSummary);

onMounted(() => {
  techniciansStore.fetchTechnicians();
});

const openAddTechnicianDialog = () => {
  selectedTechnician.value = { certifications: [], skills: [] };
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewTechnician = (technician: Technician) => {
  selectedTechnician.value = technician;
  detailsDialog.value = true;
};

const editTechnician = (technician: Technician) => {
  selectedTechnician.value = technician;
  editDialog.value = true;
};

const deleteTechnician = (technician: Technician) => {
  selectedTechnician.value = technician;
  deleteDialog.value = true;
};

const saveTechnician = (technician: Technician) => {
  if (technician.id) {
    techniciansStore.updateTechnician(technician);
  } else {
    techniciansStore.createTechnician(technician);
  }
  editDialog.value = false;
};

const confirmDeleteTechnician = () => {
  if (selectedTechnician.value) {
    techniciansStore.deleteTechnician(selectedTechnician.value.id as number);
  }
  deleteDialog.value = false;
};
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
