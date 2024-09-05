<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Service Reminders</span>
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
        <v-btn color="primary" @click="openCreateReminderDialog">Create Service Reminder</v-btn>
      </div>
    </div>

    <ServiceReminderDetailsDialog :modelValue="detailsDialog" :serviceReminder="selectedReminder"
      @update:modelValue="detailsDialog = $event" @close="closeDetailsDialog" />

    <ServiceReminderEditDialog :modelValue="editDialog" :serviceReminder="selectedReminder"
      @update:modelValue="editDialog = $event" @close="closeEditDialog" @save="saveReminder" />

    <ServiceReminderUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-calendar-alert</v-icon>
              <span>Total Service Reminders</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reminderSummary.totalReminders }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-alert-circle</v-icon>
              <span>Upcoming Service Reminders</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reminderSummary.upcomingReminders }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-calendar-remove</v-icon>
              <span>Overdue Service Reminders</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ reminderSummary.overdueReminders }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ServiceReminderList :serviceReminders="serviceReminderList" :loading="loading" @view="viewReminder" @edit="editReminder" @delete="deleteReminder" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useServiceReminderStore } from '@/stores/maintenance/serviceReminders';
import ServiceReminderList from '@/components/maintenance/management/reminder/ServiceReminderList.vue';
import ServiceReminderDetailsDialog from '@/components/maintenance/management/reminder/ServiceReminderDetailsDialog.vue';
import ServiceReminderEditDialog from '@/components/maintenance/management/reminder/ServiceReminderEditDialog.vue';
import ServiceReminderUpload from '@/components/maintenance/management/reminder/ServiceReminderUpload.vue'; // Import the ServiceReminderUpload component
import type { ServiceReminder } from '@/types/maintenance/serviceReminders';

const serviceReminderStore = useServiceReminderStore();
serviceReminderStore.setInitialData()

const { serviceReminderList, loading, reminderSummary, notifications, chartData } = storeToRefs(serviceReminderStore);

const detailsDialog = ref(false);
const editDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedReminder = ref<Partial<ServiceReminder>>({} as Partial<ServiceReminder>);

const openCreateReminderDialog = () => {
  selectedReminder.value = {} as Partial<ServiceReminder>;
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewReminder = (reminder: any) => {
  selectedReminder.value = reminder;
  detailsDialog.value = true;
};

const editReminder = (reminder: any) => {
  selectedReminder.value = reminder;
  editDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteReminder = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this service reminder ?")

  if (confirm) {
    await serviceReminderStore.deleteReminder(id);
  }
};

const closeDetailsDialog = () => {
  detailsDialog.value = false;
};

const closeEditDialog = () => {
  editDialog.value = false;
};

const saveReminder = async (reminder: any) => {
  if (reminder.id) {
    await serviceReminderStore.updateReminder(reminder);
  } else {
    await serviceReminderStore.createReminder(reminder);
  }
  editDialog.value = false;
};

onMounted(() => {
  serviceReminderStore.fetchReminders();
  serviceReminderStore.fetchNotifications();
  serviceReminderStore.fetchChartData();
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
