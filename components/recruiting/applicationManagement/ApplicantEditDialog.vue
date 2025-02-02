<!-- src/components/recruiting/ApplicantEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ applicant?.id ? 'Edit Applicant' : 'Add Applicant' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="applicantForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="First Name"
                  v-model="currentApplicant.first_name" :rules="[validation.required]" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Last Name"
                  v-model="currentApplicant.last_name" :rules="[validation.required]" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Primary Phone"
                  v-model="currentApplicant.primary_phone" :rules="[validation.required]" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Cell Phone"
                  v-model="currentApplicant.cell_phone"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Email Address"
                  v-model="currentApplicant.email_address" :rules="[validation.required, validation.email]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Current Street Address"
                  v-model="currentApplicant.current_street_address"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Country"
                  v-model="currentApplicant.country"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="City"
                  v-model="currentApplicant.city"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="State"
                  v-model="currentApplicant.state"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" flat density="compact" label="Zip"
                  v-model="currentApplicant.zip"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select variant="outlined" flat density="compact" label="Applicant Type"
                  :items="['Internal', 'External']" v-model="currentApplicant.applicant_type"
                  :rules="[validation.required]" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select variant="outlined" flat density="compact" label="Status" :items="['Active', 'Inactive']"
                  v-model="currentApplicant.status" :rules="[validation.required]" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox label="Residence Address for More Than Three Years"
                  v-model="currentApplicant.residence_address_for_more_than_three_years"></v-checkbox>
              </v-col>
            </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveApplicant">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import type { Applicant } from '@/types/recruiting/applicantApplication';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  applicant: {
    type: Object as PropType<Partial<Applicant>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const validation = useValidation();

const currentApplicant = ref<Partial<Applicant>>({ ...props.applicant });

watch(
  () => props.applicant,
  (newApplicant) => {
    currentApplicant.value = { ...newApplicant };
  }
);

const applicantForm = ref<HTMLFormElement | null>(null);

const saveApplicant = async () => {
  let formStatus = await applicantForm.value?.validate();
  if (!formStatus.valid) {
    return;
  }
  emit('save', currentApplicant.value);
};

watch(() => dialog.value, (val) => {
  currentApplicant.value = {};
})
</script>

<style scoped>
/* Add your styles here */
</style>