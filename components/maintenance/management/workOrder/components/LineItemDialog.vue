<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="lineItemForm">
                    <v-row class="mt-2">
                        <v-col cols="12">
                            <SharedInputServiceTaskAutoCompleteInput variant="outlined" flat density="compact"
                                v-model="currentLineItem.service_task_id" :selectedItems="alreadySelectedTasks"
                                label="Service Task" :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12">
                            <v-textarea variant="outlined" flat density="compact" v-model="currentLineItem.notes"
                                label="Notes"></v-textarea>
                        </v-col>
                        <v-divider></v-divider>
                    </v-row>
                </v-form>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="text" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { LineItem } from "~/types/maintenance/workOrder";

const validation = useValidation();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    lineItem: {
        type: Object as PropType<Partial<LineItem>>,
        required: true,
        default: {} as Partial<LineItem>
    },
    alreadySelectedTasks: {
        type: Array as PropType<Number[]>,
        required: false,
        default: []
    }
})

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
    get() {
        return props.modelValue;
    }, set(value) {
        emit('update:modelValue', value)
    }
})

const title = computed(() =>
    props.lineItem.id ? 'Edit LineItem' : 'Add Line Item  '
);

// const selectedItems = computed(() => {
//     if (props.lineItem?.service_task_id) {
//         return props.alreadySelectedTasks.filter(item => item != props.lineItem.service_task_id)
//     }
//     return props.alreadySelectedTasks
// })

const lineItemForm = ref<HTMLFormElement | null>(null)
const currentLineItem = ref<Partial<LineItem>>(props.lineItem);

const save = async () => {
    const formStatus = await lineItemForm.value?.validate()
    if (!formStatus.valid) {
        return
    }
    emit('save', JSON.parse(JSON.stringify(currentLineItem.value)))
    dialog.value = false
}

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        currentLineItem.value = JSON.parse(JSON.stringify(props.lineItem))
    }
})
</script>