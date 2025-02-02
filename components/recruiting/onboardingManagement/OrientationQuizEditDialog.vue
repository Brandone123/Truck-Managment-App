<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ quiz?.id ? 'Edit Quiz' : 'Add Quiz' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="quizForm">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Name" v-model="currentQuiz.name" :rules="[rules.required]"
                variant="outlined" density="comfortable"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Timer" v-model="currentQuiz.timer" :rules="[rules.required]"
                variant="outlined" hint="Please enter the timer in this format 00:00:00" density="comfortable" type="timer"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Pass Grade (%)" v-model="currentQuiz.pass_grade" :rules="[rules.required, rules.passGrade]"
                  variant="outlined" hint="Must be between 50 and 100" density="comfortable" type="number"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Attempts Allowed" v-model="currentQuiz.attempts_allowed" :rules="[rules.required, rules.attemptsAllowed]"
                  variant="outlined" hint="Number of attempts allowed" density="comfortable" type="number"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea variant="outlined" flat density="compact" label="Description"
                  v-model="currentQuiz.description" :rules="[rules.required]"
                  required></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveQuiz">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import type { OrientationQuiz, OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
import { OrientationMaterialStore } from '~/stores/recruiting/onboardingOrientation/orientationMaterialsStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  quiz: {
    type: Object as PropType<OrientationQuiz | null>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentQuiz = ref<Partial<OrientationQuiz>>({ ...props.quiz });
const optionsText = ref<string>('');
const quizForm = ref<HTMLFormElement | null>(null);

const store = OrientationMaterialStore();
const { orientationMaterials } = storeToRefs(store);

const materials = computed(() => store.orientationMaterials);

const rules = {
  required: (value: any) => !!value || 'Required',
  passGrade: (value: number) => (value >= 50 && value <= 100) || 'Pass grade must be between 50 and 100',
  attemptsAllowed: (value: number) => (value > 0 && Number.isInteger(value)) || 'Attempts must be a positive integer',
};

watch(
  () => props.quiz,
  (newQuiz) => {
    currentQuiz.value = { ...newQuiz };
    optionsText.value = newQuiz?.options?.join(', ') || '';
  },
  { immediate: true }
);

const saveQuiz = async () => {
  if (!quizForm.value) {
    console.error('Form reference is not defined');
    return;
  }

  const isValid = await quizForm.value.validate();
  if (!isValid) return;

  const quizData: Partial<OrientationQuiz> = {
    ...currentQuiz.value,
  };

  emit('save', quizData);
};
</script>

<style scoped>
/* Add your styles here */
</style>