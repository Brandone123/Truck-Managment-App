<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card>
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
                                v-model="currentLineItem.service_task_id" label="Service Task"
                                :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field variant="outlined" :rules="[validation.required]" type="number" flat density="compact" v-model="currentLineItem.labor_cost"
                                label="Labor cost"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field variant="outlined" :rules="[validation.required]" type="number" flat density="compact" v-model="currentLineItem.parts_cost"
                                label="Part cost"></v-text-field>
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

watch(() => dialog.value,(newVal) => {
    if(newVal){
           currentLineItem.value = JSON.parse(JSON.stringify(props.lineItem))
    }
})
</script>