<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ currentTaskCategory.id ? 'Edit Task Category' : 'Add Task Category'
                    }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="taskCategoryForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field variant="outlined" flat density="compact" label="Task Category Name"
                                v-model="currentTaskCategory.name" :rules="[rules.required]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select v-model="currentTaskCategory.default_sector" :items="defaultSelect"
                                label=" Default Setup" item-title="title" item-value="title" multiple variant="outlined" flat density="compact">
                            </v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" flat density="compact" label="Description"
                                v-model="currentTaskCategory.description" auto-grow></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn @click="dialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveTask">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
import type { TaskCategory } from '@/types/recruiting/onboardingOrientation';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    task: {
        type: Object as PropType<Partial<TaskCategory>>,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const selecteddefault = ref<string[]>([]);

const defaultSelect = [
    {title: 'Company Drivers',value: 'Company Drivers'},
    {title: 'Owner Operators',value:'Owner Operators'},
    {title: 'Employees',value:'Employees'},
]

const currentTaskCategory = ref<Partial<TaskCategory>>({ ...props.task });

const rules = {
    required: (value: any) => !!value || 'Required',
};

watch(
    () => props.task,
    (newTask) => {
        currentTaskCategory.value = { ...newTask };
    },
    { immediate: true }
);

const taskCategoryForm = ref<HTMLFormElement | null>(null);

const saveTask = async () => {
    const isValid = await taskCategoryForm.value?.validate();
    if (!isValid) return;

    emit('save', currentTaskCategory.value);
};
</script>

<style scoped>
/* Add your styles here */
</style>