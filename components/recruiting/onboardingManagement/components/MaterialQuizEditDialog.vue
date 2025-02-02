<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ quiz?.material_id ? 'Edit Quiz' : 'Add Quiz' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="quizForm">
          <v-container>
            <v-row>
              <v-col cols="12">
                <QuizzesAutoCompleteInput v-model="currentQuizForm.quiz_form_id"
                item-value="id" label="Select Quiz Form" color="primary" :rules="[rules.required]" />
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
import { defineProps, ref, watch, computed , onMounted} from 'vue';
import type { OrientationMaterialQuiz, OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import QuizzesAutoCompleteInput from './QuizzesAutoCompleteInput.vue';

const route = useRoute();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  quiz: {
    type: Object as PropType<OrientationMaterialQuiz | null>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const materialId = parseInt(route.params.materialId as string, 10)

const storeOnboarding = OnboardingOrientationQuizStore();

const { orientationQuizzes } = storeToRefs(storeOnboarding);

const currentQuizForm = ref<Partial<OrientationMaterialQuiz>>({ ...props.quiz });
const optionsText = ref<string>('');
const quizForm = ref<HTMLFormElement | null>(null);

// if (!store.orientationMaterials.length) {
//   store.fetchOrientationMaterials();
// }

const orientationStore = OnboardingOrientationQuizStore();

const questionTypes = ['Multiple Choice', 'Text Response', 'Checkbox', 'Dropdown'];

const rules = {
  required: (value: any) => !!value || 'Required',
  // requiredIfAnswer: (value: any) => {
  //   if (isMultipleChoiceOrCheckbox(currentQuizForm.value.question_type)) {
  //     return !!value || 'Correct answer is required';
  //   }
  //   return true;
  // },
};

watch(
  () => props.quiz,
  (newQuiz) => {
    currentQuizForm.value = { ...newQuiz };
    // optionsText.value = newQuiz?.options?.join(', ') || '';
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

  const quizData: Partial<OrientationMaterialQuiz> = {
    ...currentQuizForm.value,
    material_id: materialId,
  };

  emit('save', quizData);
};

onMounted(() => {
  orientationStore.fetchOrientationQuizzes({});
});
</script>

<style scoped>
/* Add your styles here */
</style>