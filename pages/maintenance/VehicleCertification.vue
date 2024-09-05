<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Vehicle and Certification Renewals Management</span>
      <v-btn color="primary" @click="openAddRenewalDialog">Add Renewal Reminder</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-calendar-check-outline</v-icon>
              <span>Total Renewals</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ renewalSummary.totalRenewals }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
              <span>Renewals Pending</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ renewalSummary.renewalsPending }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Renewals Completed</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ renewalSummary.renewalsCompleted }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <RenewalsTable :search="search" @view="viewRenewal" @edit="editRenewal" @delete="deleteRenewal" />
      </v-col>
    </v-row>

    <RenewalDetailsDialog :modelValue="detailsDialog" :renewal="selectedRenewal"
      @update:modelValue="detailsDialog = $event" />
    <RenewalEditDialog :modelValue="editDialog" :renewal="selectedRenewal" @update:modelValue="editDialog = $event"
      @save="saveRenewal" />
    <DeleteRenewalDialog :modelValue="deleteDialog" @confirm="confirmDeleteRenewal" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import RenewalsTable from '@/components/maintenance/compliance/certification/RenewalsTable.vue';
import RenewalDetailsDialog from '@/components/maintenance/compliance/certification/RenewalDetailsDialog.vue';
import RenewalEditDialog from '@/components/maintenance/compliance/certification/RenewalEditDialog.vue';
import DeleteRenewalDialog from '@/components/maintenance/compliance/certification/DeleteRenewalDialog.vue';
import { useRenewalsStore } from '@/stores/maintenance/renewalsStore';
import type { Renewal } from '@/types/maintenance/renewalTypes';

const assetStore = useAssetStore();
const renewalsStore = useRenewalsStore();
const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedRenewal = ref<Partial<Renewal>>({} as Partial<Renewal>);

const renewalSummary = computed(() => renewalsStore.renewalSummary);

onMounted(() => {
  assetStore.fetchAssets();
  renewalsStore.fetchRenewals();
});

const openAddRenewalDialog = () => {
  selectedRenewal.value = {} as Partial<Renewal>;
  editDialog.value = true;
};

const viewRenewal = (renewal: Renewal) => {
  selectedRenewal.value = renewal;
  detailsDialog.value = true;
};

const editRenewal = (renewal: Renewal) => {
  selectedRenewal.value = renewal;
  editDialog.value = true;
};

const deleteRenewal = (renewal: Renewal) => {
  selectedRenewal.value = renewal;
  deleteDialog.value = true;
};

const saveRenewal = (renewal: Renewal) => {
  if (renewal.id) {
    renewalsStore.updateRenewal(renewal);
  } else {
    renewalsStore.createRenewal(renewal);
  }
  editDialog.value = false;
};

const confirmDeleteRenewal = () => {
  if (selectedRenewal.value) {
    renewalsStore.deleteRenewal(selectedRenewal.value.id as number);
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