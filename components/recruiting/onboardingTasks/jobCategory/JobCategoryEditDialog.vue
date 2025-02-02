<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ currentJobCategory.id ? 'Edit Job Category' : 'Add Job Category'
                    }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="jobCategoryForm">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field variant="outlined" flat density="compact" label="Job Category Name"
                                v-model="currentJobCategory.name" :rules="[rules.required]" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" flat density="compact" label="Description"
                                v-model="currentJobCategory.description" auto-grow></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn @click="dialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveJob">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
import type { JobCategory } from '@/types/recruiting/jobManagement';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    job: {
        type: Object as PropType<Partial<JobCategory>>,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const currentJobCategory = ref<Partial<JobCategory>>({ ...props.job });

const jobStore = JobManagementStore();

const rules = {
    required: (value: any) => !!value || 'Required',
};

watch(
    () => props.job,
    (newJob) => {
        currentJobCategory.value = { ...newJob };
    },
    { immediate: true }
);

const jobCategoryForm = ref<HTMLFormElement | null>(null);

const saveJob = async () => {
    const isValid = await jobCategoryForm.value?.validate();
    if (!isValid) return;

    emit('save', currentJobCategory.value);
};
</script>

<style scoped>
/* Add your styles here */
</style>