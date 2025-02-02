<template>
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h6">
            {{ isEdit ? 'Edit Action' : 'New Action' }}
          </span>
        </v-card-title>
        <v-divider></v-divider>
  
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- Issue Title -->
            <v-text-field
              v-model="formData.issueTitle"
              label="Issue Title"
              :rules="[v => !!v || 'Title is required']"
              required
            />
  
            <!-- Issue Description -->
            <v-textarea
              v-model="formData.issueDescription"
              label="Issue Description"
            />
  
            <!-- Department -->
            <v-select
              v-model="formData.department"
              :items="departmentOptions"
              label="Department"
            />
  
            <!-- Status -->
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Status"
              :rules="[v => !!v || 'Status is required']"
              required
            />
  
            <!-- Due Date -->
            <v-text-field
              v-model="formData.dueDate"
              label="Due Date"
              type="date"
            />
  
            <!-- Assigned To -->
            <v-text-field
              v-model="formData.assignedTo"
              label="Assigned To"
            />
  
            <!-- Action Plan -->
            <v-textarea
              v-model="formData.actionPlan"
              label="Action Plan"
            />
  
            <!-- Resolution -->
            <v-textarea
              v-model="formData.resolution"
              label="Resolution"
            />
  
            <!-- Blockage -->
            <v-textarea
              v-model="formData.blockage"
              label="Blockage"
            />
  
            <!-- Notes -->
            <v-textarea
              v-model="formData.notes"
              label="Notes"
            />
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveAction">
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { MeetingAction } from '@/types/meeting/meetingAction';
  
  interface Props {
    isEdit: boolean;
    actionToEdit?: MeetingAction | null;
    meetingId: number; // If action is tied to a specific meeting
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', payload: Partial<MeetingAction>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  // Example department + status options
  const departmentOptions = ['Maintenance', 'Dispatch', 'Accounting', 'Safety', 'HR'];
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
  
  const formData = ref<Partial<MeetingAction>>({
    meetingId: props.meetingId,
    issueTitle: '',
    issueDescription: '',
    status: 'Open',
  });
  
  const isEdit = computed(() => props.isEdit);
  
  // Watch incoming actionToEdit
  watch(
    () => props.actionToEdit,
    (newVal) => {
      if (newVal) {
        formData.value = { ...newVal };
      } else {
        // Reset form
        formData.value = {
          meetingId: props.meetingId,
          issueTitle: '',
          issueDescription: '',
          status: 'Open',
        };
      }
    },
    { immediate: true },
  );
  
  function closeDialog() {
    dialog.value = false;
    emit('close');
  }
  
  function saveAction() {
    if (!isFormValid.value) return;
    emit('save', { ...formData.value });
    dialog.value = false;
  }
  </script>
  