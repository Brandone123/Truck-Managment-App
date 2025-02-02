<template>
  <v-card class="mb-4">
    <v-card-title>
      <span class="text-h6">Actions</span>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openNewActionDialog">
        <v-icon left>mdi-plus</v-icon>
        New Action
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <!-- Actions Table -->
      <v-data-table
        :headers="headers"
        :items="actionsForMeeting"
        :loading="loading"
        item-key="id"
        :items-per-page="5"
        class="elevation-1"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Search actions"
            append-icon="mdi-magnify"
            single-line
            hide-details
          />
        </template>

        <template #item.issueTitle="{ item }">
          <!-- Link to details page -->
          <v-btn variant="text" color="primary" :to="`/meeting/MeetingActions/${item.id}`">
            {{ item.issueTitle }}
          </v-btn>
        </template>

        <template #item.status="{ item }">
          <!-- Display status with possible color or chip styling -->
          <v-chip :color="statusColor(item.status)" class="ma-1" small>
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn color="info" small @click="openEditActionDialog(item)">
            <v-icon left>mdi-pencil</v-icon>
            Edit
          </v-btn>
          <v-btn color="red" small @click="confirmDeleteAction(item)">
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <!-- Action Dialog (create/edit) -->
  <MeetingActionDialog
    v-if="isDialogOpen"
    :is-edit="isEditMode"
    :action-to-edit="selectedAction"
    :meeting-id="meetingId"
    @close="closeDialog"
    @save="handleSaveAction"
  />

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirm Delete</v-card-title>
      <v-card-text>
        Are you sure you want to delete the action:
        "<strong>{{ actionToDelete?.issueTitle }}</strong>"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isDeleteDialogOpen = false">Cancel</v-btn>
        <v-btn color="red darken-1" text @click="deleteAction">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { MeetingActionStore } from '@/stores/meeting/meetingActionStore';
import MeetingActionDialog from '@/components/meeting/actions/MeetingActionDialog.vue';
import type { MeetingAction } from '@/types/meeting/meetingAction';

// Props
import { defineProps } from 'vue';
const props = defineProps<{
  meetingId: number; // The parent page can pass the current meeting's ID
}>();

// Store
const actionStore = MeetingActionStore();

// Local state
const isDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditMode = ref(false);
const selectedAction = ref<MeetingAction | null>(null);
const actionToDelete = ref<MeetingAction | null>(null);

const search = ref('');

// On mount, ensure we have actions loaded
onMounted(async () => {
  if (!actionStore.actions.length) {
    await actionStore.fetchActions();
  }
});

// Computed: filter actions to the current meeting
const actionsForMeeting = computed(() => {
  const allActions = actionStore.getActionsByMeetingId(props.meetingId);
  if (!search.value.trim()) {
    return allActions;
  }
  return allActions.filter((a) =>
    a.issueTitle.toLowerCase().includes(search.value.toLowerCase()),
  );
});

// Loading state
const loading = computed(() => actionStore.loading);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Issue', value: 'issueTitle' },
  { title: 'Status', value: 'status' },
  { title: 'Due Date', value: 'dueDate' },
  { title: 'Actions', value: 'actions', sortable: false },
];

/**
 * Return a color for the status chip
 */
function statusColor(status: string) {
  switch (status) {
    case 'Open':
      return 'red';
    case 'In Progress':
      return 'blue';
    case 'Resolved':
      return 'green';
    case 'Closed':
      return 'grey';
    default:
      return 'primary';
  }
}

/**
 * Open dialog for creating a new action
 */
function openNewActionDialog() {
  isEditMode.value = false;
  selectedAction.value = null;
  isDialogOpen.value = true;
}

/**
 * Open dialog for editing an existing action
 */
function openEditActionDialog(action: MeetingAction) {
  isEditMode.value = true;
  selectedAction.value = { ...action };
  isDialogOpen.value = true;
}

/**
 * Close the dialog
 */
function closeDialog() {
  isDialogOpen.value = false;
}

/**
 * Handle save from the dialog
 */
async function handleSaveAction(payload: Partial<MeetingAction>) {
  try {
    if (isEditMode.value && selectedAction.value) {
      // update
      await actionStore.updateAction(selectedAction.value.id, payload);
    } else {
      // create
      await actionStore.createAction({ meetingId: props.meetingId, ...payload });
    }
    isDialogOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Confirm delete
 */
function confirmDeleteAction(action: MeetingAction) {
  actionToDelete.value = action;
  isDeleteDialogOpen.value = true;
}

/**
 * Actually delete the action
 */
async function deleteAction() {
  if (!actionToDelete.value) return;
  await actionStore.deleteAction(actionToDelete.value.id);
  isDeleteDialogOpen.value = false;
  actionToDelete.value = null;
}
</script>
