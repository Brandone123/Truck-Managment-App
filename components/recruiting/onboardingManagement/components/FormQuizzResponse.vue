<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <v-card style="display: flex; flex-direction: column; height: 100vh;">
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
                                <v-row>
                                    <v-col cols="12" v-for="(item, index) in (form as any[])" :key="index" class="pt-0">
                                        <div v-if="item.type == 'free_text'">
                                            <h3 class="text-h5 py-0">{{ item.label }}</h3>
                                            <QuillPreview :html="item.description || ''" />
                                        </div>
                                        <!-- En-tête de chaque élément -->
                                        <!-- Affichage des différents types d'éléments -->
                                        <!-- Section -->
                                        <div v-else-if="item.type === 'section'" class="py-0">
                                            <h3 class="text-h5 py-0">{{ item.label }}</h3>
                                            <v-divider></v-divider>
                                            <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                        </div>
                                        <!-- <div> -->
                                        <!-- Texte libre -->
                                        <v-text-field v-else-if="item.type === 'text_input'"
                                            v-model="responses[item.id]"
                                            :label="`${item.label} ${item.required ? ' *' : ''}`"
                                            :rules="item.required ? [validation.required] : []"
                                            :required="item.required" variant="outlined" density="comfortable"
                                            class="py-0" />


                                        <!-- Radio -->
                                        <v-radio-group v-else-if="item.type === 'radio'" v-model="responses[item.id]"
                                            density="comfortable" :label="`${item.label} ${item.required ? ' *' : ''}`"
                                            :rules="item.required ? [validation.required] : []"
                                            :required="item.required" class="mt-0 mb-1">
                                            <v-radio v-for="(option, i) in item.options" :key="i" :label="option.text"
                                                :value="option.text" color="primary" />
                                        </v-radio-group>

                                        <!-- Checkbox -->
                                        <div v-else-if="item.type === 'checkbox'">
                                            <h3> {{ `${item.label} ${item.required ? ' *' : ''}` }}</h3>
                                            <v-checkbox v-model="responses[item.id]"
                                                v-for="(option, index) in item.options" :key="index"
                                                :label="option.text" :value="option.text" color="primary"
                                                density="compact" hide-details />
                                        </div>

                                        <!-- Dropdown -->
                                        <v-select v-else-if="item.type === 'dropdown'" v-model="responses[item.id]"
                                            :rules="item.required ? [validation.required] : []"
                                            :items="item.choices.map((choice: any) => choice.text)"
                                            :label="`${item.label} ${item.required ? ' *' : ''}`" variant="outlined"
                                            density="comfortable" class="mt-0 mb-1"></v-select>

                                    </v-col>
                                </v-row>
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
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue';
import { useValidation } from '~/composables/formValidation';

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
    timer: {
        type: String,
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

const mediaStore = useMediaStore();

const responses = ref({ ...props.existingResponses });

const quizForm = ref<HTMLFormElement | null>(null)

// Timer State and Logic
const parseTimeToSeconds = (timeString: string) => {
    if (!timeString) {
        console.error("timeString is undefined or empty");
        return 0; // or another value by default
    }
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

// Set remaining time in seconds
const timer = ref(parseTimeToSeconds(props.timer));

// Format time in HH:mm:ss for display
const formattedTime = computed(() => {
    const hours = Math.floor(timer.value / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timer.value % 3600) / 60)
        .toString()
        .padStart(2, '0');
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
                submitTest(); // Auto-submit when time is up
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

// Score State and Logic
const score = ref(0);

const submitTest = () => {
    stopTimer(); // Stop the timer

    // Calculate score
    let totalScore = 0;
    props.form.forEach((component: any) => {
        if (component.choices) {
            component.choices.forEach((choice: any) => {
                if (choice.valid && choice.selected) {
                    totalScore++;
                }
            });
        }
    });
    score.value = totalScore;

    alert(`Test submitted! Your score: ${score.value}`);
};

const cancelQuiz = () => {
    stopTimer();
    dialog.value = false; // Close dialog
};

const saveQuiz = () => {
    alert('Quiz saved successfully!');
    dialog.value = false;
};


watch(
    () => responses.value,
    (newResponses) => emit('update:responses', newResponses),
    { deep: true }
);

watch(() => props.timer, (newValue) => {
    timer.value = parseTimeToSeconds(newValue || "00:00:00");
});

defineExpose({
    quizForm
})
</script>

<style scoped></style>