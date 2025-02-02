<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title>{{ response?.id ? 'Edit Orientation Response' : 'Add Orientation Response' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="responseForm">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Result ID"
                    v-model="currentResponse.result_id"
                    :rules="[rules.required, rules.numeric]"
                    required
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Quiz ID"
                    v-model="currentResponse.quiz_form_id"
                    :rules="[rules.required, rules.numeric]"
                    required
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12">
                  <v-textarea
                    label="Response"
                    v-model="currentResponse.response"
                    :rules="[rules.required]"
                    required
                    auto-grow
                  ></v-textarea>
                </v-col>
  
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Score"
                    v-model="currentResponse.score"
                    type="number"
                    :rules="[rules.numeric]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveResponse">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed } from 'vue';
  import type { OrientationResponse } from '@/types/recruiting/onboardingOrientation';
  import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    response: {
      type: Object as PropType<OrientationResponse | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const currentResponse = ref<Partial<OrientationResponse>>({ ...props.response });
  
  const onboardingStore = OnboardingOrientationQuizStore();
  
  const rules = {
    required: (value: any) => !!value || 'Required',
    numeric: (value: any) => !isNaN(Number(value)) || 'Must be a number',
  };
  
  watch(
    () => props.response,
    (newResponse) => {
      currentResponse.value = { ...newResponse };
    },
    { immediate: true }
  );
  
  const saveResponse = async () => {
    const isValid = await ($refs.responseForm as HTMLFormElement)?.validate();
    if (!isValid) return;
  
    emit('save', currentResponse.value);
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  