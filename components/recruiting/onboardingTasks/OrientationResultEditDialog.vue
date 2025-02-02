<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title>{{ result?.id ? 'Edit Orientation Result' : 'Add Orientation Result' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="resultForm">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Application ID"
                    v-model="currentResult.application_id"
                    :rules="[rules.required, rules.numeric]"
                    required
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Quiz ID"
                    v-model="currentResult.quiz_form_id"
                    :rules="[rules.required, rules.numeric]"
                    required
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Score"
                    v-model="currentResult.score"
                    type="number"
                    :rules="[rules.required, rules.minValue(0)]"
                    required
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-select
                    label="Passed"
                    :items="passedOptions"
                    v-model="currentResult.passed"
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedCompletedAt"
                        label="Completed At"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[rules.required]"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="currentResult.completed_at" @input="menu = false">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="saveDate">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveResult">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed } from 'vue';
  import type { OrientationResult } from '@/types/recruiting/onboardingOrientation';
  import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    result: {
      type: Object as PropType<OrientationResult | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const currentResult = ref<Partial<OrientationResult>>({ ...props.result });
  
  const menu = ref(false);
  const formattedCompletedAt = ref('');
  
  const onboardingStore = OnboardingOrientationQuizStore();
  
  const passedOptions = [
    { text: 'Passed', value: true },
    { text: 'Failed', value: false },
  ];
  
  const rules = {
    required: (value: any) => !!value || 'Required',
    numeric: (value: any) => !isNaN(Number(value)) || 'Must be a number',
    minValue: (min: number) => (value: any) =>
      Number(value) >= min || `Must be at least ${min}`,
  };
  
  watch(
    () => props.result,
    (newResult) => {
      currentResult.value = { ...newResult };
      if (newResult?.completed_at) {
        formattedCompletedAt.value = new Date(newResult.completed_at).toLocaleDateString();
      } else {
        formattedCompletedAt.value = '';
      }
    },
    { immediate: true }
  );
  
  // Combine date selection
  const saveDate = () => {
    if (currentResult.value.completed_at) {
      formattedCompletedAt.value = new Date(currentResult.value.completed_at).toLocaleDateString();
    }
  };
  
  const saveResult = async () => {
    const isValid = await ($refs.resultForm as HTMLFormElement)?.validate();
    if (!isValid) return;
  
    emit('save', currentResult.value);
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  