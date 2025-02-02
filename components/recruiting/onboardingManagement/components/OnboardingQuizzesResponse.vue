<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <v-card class="grey-background" style="display: flex; flex-direction: column; height: 100vh;">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Quizzes</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip @click="toggleTimer">
                    <v-icon class="mr-2">{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
                    {{ formattedTime }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn icon @click="cancelQuiz">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-container max-width="800">
                    <div v-if="!form || form.length === 0" class="text-center">
                        <v-card>
                            <v-card-text>
                                <v-icon size="60" color="grey">mdi-file-document-outline</v-icon>
                                <p>No form elements available for this material quiz.</p>
                            </v-card-text>
                        </v-card>
                    </div>
                    <div v-else>
                        <v-card-text>
                            <v-form ref="quizForm">
                                <v-card-text style="flex: 1; overflow-y: auto; padding: 0;">
                                    <v-container max-width="800">
                                        <v-card class="mb-2">
                                            <v-card-text>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <ApplicationAutocompleteInput :readonly="currentSubmission.id"
                                                            persistent-hint
                                                            :hint="currentSubmission.id ? 'Application can not be updated' : ''"
                                                            v-model="currentSubmission.application_id" item-value="id"
                                                            label="Select Application" color="primary"
                                                            :rules="[validation.required]" />
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>

                                        <v-card class="mt-3 pt-3">
                                            <v-col cols="12" v-for="(item, index) in (form as any[])" :key="index"
                                                class="pt-0">
                                                <!-- Free Text -->
                                                <div v-if="item.type == 'free_text'">
                                                    <h3 class="text-h5 py-0">{{ item.label }}</h3>
                                                    <QuillPreview :html="item.description || ''" />
                                                </div>

                                                <!-- Section -->
                                                <div v-else-if="item.type === 'section'" class="py-0">
                                                    <h3 class="text-h5 py-0">{{ item.text }}</h3>
                                                    <v-divider></v-divider>
                                                    <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                                </div>

                                                <!-- Radio -->
                                                 <div v-else-if="item.type === 'radio'">
                                                    <h3> {{ `${item.text} ${item.required ? ' *' : ''}` }}</h3>
                                                    <v-radio-group 
                                                        v-model="responses[item.id]" density="comfortable"
                                                        :rules="item.required ? [validation.required] : []"
                                                        :required="item.required" class="mt-0 mb-1">
                                                        <h6 class="text-grey text-caption py-0">{{ item.description }}</h6>
                                                        <v-radio v-for="(option, i) in item.options" :key="i"
                                                            :label="option.text" :value="option.text" color="primary" />
                                                </v-radio-group>
                                                 </div>
                                               

                                                <!-- Checkbox -->
                                                <div v-else-if="item.type === 'checkbox'">
                                                    <h3> {{ `${item.text} ${item.required ? ' *' : ''}` }}</h3>
                                                    <h6 class="text-grey text-caption py-0">{{ item.description }}</h6>
                                                    <v-checkbox v-model="responses[item.id]"
                                                        v-for="(option, index) in item.options" :key="index"
                                                        :label="option.text" :value="option.text" color="primary"
                                                        density="compact" hide-details />
                                                </div>

                                                <!-- Dropdown -->
                                                 <div v-else-if="item.type === 'dropdown'">
                                                    <p  class="text-grey text-caption py-0">{{ item.description }}</p>
                                                    <v-select 
                                                    v-model="responses[item.id]"
                                                    :rules="item.required ? [validation.required] : []"
                                                    :items="item.options.map((option: any) => option.text)"
                                                    :label="`${item.text} ${item.required ? ' *' : ''}`"
                                                    variant="outlined" density="comfortable" class="mt-0 mb-1"></v-select>
                                                 </div>
                                                
                                               
                                            </v-col>
                                        </v-card>
                                    </v-container>
                                </v-card-text>
                            </v-form>
                        </v-card-text>
                    </div>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn color="primary" @click="cancelQuiz">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveQuiz">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed, onMounted, onUnmounted } from 'vue';
import { useValidation } from '~/composables/formValidation';
import ApplicationAutocompleteInput from '../../applicationManagement/components/ApplicationAutocompleteInput.vue';
import type { Application } from '@/types/recruiting/applicantApplication';
import type { OrientationQuizResult, OrientationQuiz } from '@/types/recruiting/onboardingOrientation';
import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    form: {
        type: Array,
        required: true,
    },
    selectedQuiz: {
        type: Object as PropType<Partial<OrientationQuiz>>,
        required: true,
    },
    existingResponses: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['update:responses', 'update:modelValue']);

const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const selectedApplication = ref<any>(null);
const responses = ref({ ...props.existingResponses });
const currentSubmission = ref<Partial<OrientationQuizResult>>({});
const currentQuiz = ref<Partial<OrientationQuiz>>({ ...props.selectedQuiz });
const quizForm = ref<HTMLFormElement | null>(null);

const storeOnboarding = OnboardingOrientationQuizStore();

// Timer Logic
const parseTimeToSeconds = (timeString: string) => {
    if (!timeString) {
        console.error("timeString is undefined or empty");
        return 0; // ou une autre valeur par défaut
    }
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

const timer = ref(parseTimeToSeconds(currentQuiz.value.timer as string));

const formattedTime = computed(() => {
    const hours = Math.floor(timer.value / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timer.value % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timer.value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
});

let timerInterval: any = null;
const isPaused = ref(false);

const startTimer = () => {
    if (!isPaused.value) {
        timerInterval = setInterval(() => {
            if (timer.value > 0) {
                timer.value -= 1;
            } else {
                clearInterval(timerInterval);
                saveQuiz(); // Auto-submit quand le temps est écoulé
            }
        }, 1000);
    }
};

const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

const toggleTimer = () => {
    if (isPaused.value) {
        isPaused.value = false;
        startTimer();
    } else {
        isPaused.value = true;
        stopTimer();
    }
};

onMounted(() => {
    dialog.value && startTimer(); // Start timer when dialog opens
});

onUnmounted(() => {
    stopTimer(); // Clean up timer when component unmounts
});

watch(
    () => dialog.value,
    (newValue) => {
        if (newValue) {
            isPaused.value = false;
            startTimer(); // Resume timer when dialog opens
        } else {
            isPaused.value = true;
            stopTimer(); // Pause timer when dialog closes
        }
    }
);

// Calculate score and determine if passed
const calculateScore = () => {
    let totalScore = 0;
    props.form.forEach((component: any) => {
        if (component.options) {
            component.options.forEach((option: any) => {
                if (option.is_correct && responses.value[component.id] === option.text) {
                    totalScore++;
                }
            });
        }
    });
    return totalScore;
};

// Calculate individual question scores
const calculateQuestionScores = () => {
    const questionScores: Record<number, number> = {};
    props.form.forEach((component: any) => {
        if (component.options) {
            const isCorrect = component.options.some(
                (option: any) => option.is_correct && responses.value[component.id] === option.text
            );
            questionScores[component.id] = isCorrect ? 1 : 0;
        }
    });
    return questionScores;
};

const saveQuiz = async () => {
    const formStatus = await quizForm.value?.validate();
    if (!formStatus.valid) {
        return;
    }

    if(!currentQuiz.value) return;

    console.log(currentQuiz.value.timer)
    console.log(currentQuiz.value.pass_grade)
    console.log(currentQuiz.value)

    // Calculate individual question scores
    const score = calculateScore();
    // Passed or faild ?
    const passed = score >= currentQuiz.value.pass_grade;
    // Calculate individual question scores
    const questionScores = calculateQuestionScores();

    const payload: OrientationQuizResult = {
        id: currentSubmission.value.id as number,
        application_id: currentSubmission.value.application_id as number,
        quiz_form_id: currentQuiz.value.current_version?.quiz_form_id as number,
        quiz_form_version_id: currentQuiz.value.current_version?.id as number,
        score,
        passed,
        responses: Object.keys(responses.value).map((questionId) => ({
            question_id: Number(questionId),
            response: responses.value[questionId],
            score: questionScores[Number(questionId)] || 0, 
            // result_id: Number(questionId),
        })),
    };

    await storeOnboarding.createOrientatoinQuizzResponse(payload);
    dialog.value = false;
};

const cancelQuiz = () => {
    stopTimer();
    dialog.value = false; // Close dialog
};

watch(
    () => responses.value,
    (newResponses) => emit('update:responses', newResponses),
    { deep: true }
);

defineExpose({
    quizForm,
});
</script>