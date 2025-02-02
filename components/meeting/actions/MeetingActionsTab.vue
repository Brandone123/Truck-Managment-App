<template>
    <v-card class="mb-4">
      <v-card-title>
        <span class="text-h6">Actions for This Meeting</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openNewActionDialog">
          <v-icon left>mdi-plus</v-icon>
          New Action
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
  
      <v-card-text>
        <!-- Data Table of actions for this meeting -->
        <v-data-table
          :headers="headers"
          :items="filteredActions"
          :loading="loading"
          class="elevation-1"
          item-key="id"
          :items-per-page="5"
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
            <v-btn variant="text" color="primary" :to="`/MeetingActions/${item.id}`">
              {{ item.issueTitle }}
            </v-btn>
          </template>
  
          <template #item.status="{ item }">
            <v-chip :color="statusColor(item.status)" small>
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
          <v-btn color="red darken-1" text @click="deleteAction">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { defineProps } from 'vue';
  import { MeetingActionStore } from '@/stores/meeting/meetingActionStore';
  import MeetingActionDialog from '@/components/meeting/actions/MeetingActionDialog.vue';
  import type { MeetingAction } from '@/types/meeting/meetingAction';
  
  /**
   * Props from MeetingDetailsPage:
   * - meetingId (e.g. 1)
   * - series (e.g. 'Daily Standup Series') if you want to filter by series as well
   */
  const props = defineProps<{
    meetingId: number;
    series?: string; // optional
  }>();
  
  const store = MeetingActionStore();
  
  const isDialogOpen = ref(false);
  const isDeleteDialogOpen = ref(false);
  const isEditMode = ref(false);
  const selectedAction = ref<MeetingAction | null>(null);
  const actionToDelete = ref<MeetingAction | null>(null);
  
  const search = ref('');
  
  // On mount, ensure store is loaded
  onMounted(async () => {
    if (!store.actions.length) {
      await store.fetchActions();
    }
  });
  
  // If you want to combine filters (meetingId + series), you can do that too:
  const filteredActions = computed(() => {
    let arr: MeetingAction[] = [];
  
    // If you only want to filter by meetingId:
    arr = store.getActionsByMeetingId(props.meetingId);
  
    // If you also want to filter by series (for recurring):
    if (props.series) {
      // Combine or decide how you want the logic:
      // 1) if an action matches the meetingId or has the same series
      arr = arr.concat(store.getActionsBySeries(props.series));
      // Optionally remove duplicates
      arr = Array.from(new Set(arr));
    }
  
    // Apply search
    if (search.value.trim()) {
      return arr.filter((a) =>
        a.issueTitle.toLowerCase().includes(search.value.toLowerCase()),
      );
    }
    return arr;
  });
  
  const loading = computed(() => store.loading);
  
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Issue', value: 'issueTitle' },
    { title: 'Status', value: 'status' },
    { title: 'Due Date', value: 'dueDate' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  /**
   * Return a color for status
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
   * Create new action
   */
  function openNewActionDialog() {
    isEditMode.value = false;
    selectedAction.value = null;
    isDialogOpen.value = true;
  }
  
  /**
   * Edit action
   */
  function openEditActionDialog(a: MeetingAction) {
    isEditMode.value = true;
    selectedAction.value = { ...a };
    isDialogOpen.value = true;
  }
  
  /**
   * Close action dialog
   */
  function closeDialog() {
    isDialogOpen.value = false;
  }
  
  /**
   * Handle saving action
   */
  async function handleSaveAction(payload: Partial<MeetingAction>) {
    if (isEditMode.value && selectedAction.value) {
      await store.updateAction(selectedAction.value.id, payload);
    } else {
      // For a new action, pass the meetingId
      await store.createAction({
        ...payload,
        meetingId: props.meetingId,
        series: props.series || '',
      });
    }
    isDialogOpen.value = false;
  }
  
  /**
   * Confirm delete
   */
  function confirmDeleteAction(a: MeetingAction) {
    actionToDelete.value = a;
    isDeleteDialogOpen.value = true;
  }
  
  /**
   * Delete action
   */
  async function deleteAction() {
    if (!actionToDelete.value) return;
    await store.deleteAction(actionToDelete.value.id);
    isDeleteDialogOpen.value = false;
    actionToDelete.value = null;
  }
  </script>
  
  <style scoped>
  .text-h6 {
    font-size: 1.125rem;
    font-weight: 600;
  }
  </style>
  