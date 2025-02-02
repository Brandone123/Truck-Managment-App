<!-- src/components/recruiting/applicationManagement/dialogs/DecisionEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>{{ decision?.id ? 'Edit Decision' : 'Add Decision' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="decisionForm">
          <v-container>
            <v-row>
              <!-- Decision Type -->
              <v-col cols="12" md="6">
                <v-select label="Decision Type" :items="decisionTypes" v-model="currentDecision.decision_type"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-select>
              </v-col>

              <!-- Decided By -->
              <!-- <v-col cols="12" md="6">
                  <v-select
                    label="Decided By"
                    :items="users"
                    item-text="fullName"
                    item-value="id"
                    v-model="currentDecision.decided_by"
                    :rules="[rules.required]"
                    variant="outlined" density="comfortable"
                  ></v-select>
                </v-col> -->

              <!-- Decided At -->
              <v-col cols="12" md="6">
                <v-text-field v-model="currentDecision.decided_at" label="Decided At" variant="outlined"
                  density="comfortable" type="datetime-local" />
              </v-col>

              <!-- Reason -->
              <v-col cols="12">
                <v-textarea label="Reason" v-model="currentDecision.reason" variant="outlined"
                  density="comfortable"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { Decision, User } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  decision: {
    type: Object as PropType<Partial<Decision>>,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Current decision form data
const currentDecision = ref<Partial<Decision>>({ ...props.decision });

// Watch for changes in decision prop to update form data
watch(
  () => props.decision,
  (newDecision) => {
    currentDecision.value = { ...newDecision };
  }
);

// Menu for date picker
const menu = ref(false);

// Example users list; replace with dynamic data from the store
const users = ref<User[]>([
  { id: 1, first_name: 'Alice', last_name: 'Johnson', email: 'alice.johnson@example.com' },
  { id: 2, first_name: 'Bob', last_name: 'Williams', email: 'bob.williams@example.com' },
  // Add more users as needed
]);

const decisionTypes = ['Pending', 'Approve', 'Reject'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const decisionForm = ref<HTMLFormElement | null>(null);

// Submit form
const submitForm = async () => {
  const isValid = await decisionForm.value?.validate();
  if (!isValid) return;

  const auth = useAuthStore()

  emit('save', {
    ...currentDecision.value,
    decided_by: auth.user?.id,
    application_id: parseInt(route.params.applicationId as string, 10),
  });
};

// Close dialog
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
/* Add your custom styles here */
</style>