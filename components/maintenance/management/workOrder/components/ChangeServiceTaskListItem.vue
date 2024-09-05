<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable>
        <template v-slot:activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1 text-caption">Change Service Task </span>
                    <v-icon>mdi-swap-horizontal</v-icon>
                </v-list-item-title>
            </v-list-item>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Change Service Task</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <p>Current Service Task</p>
                <p>{{ currentServiceTask?.name }}</p>

                <v-row class="mt-3">
                    <v-col cols="12">
                        <v-autocomplete variant="solo" flat density="compact" :items="serviceTaskList" item-title="name"
                            item-value="id" v-model="selectedServiceTask" label="Select Service Task"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Parts } from '~/types/maintenance/workOrder';

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
        default: -1
    }
})

const emit = defineEmits(['save'])

const selectedServiceTask = ref<number>(props.modelValue)

const dialog = ref<boolean>(false)

watch(() => props.modelValue, (newModelValue) => {
    selectedServiceTask.value = newModelValue
})

const currentServiceTask = computed(() => {
    return serviceTaskList.value.find(serviceTask => serviceTask.id == props.modelValue)
})

const closeDialog = () => {
    dialog.value = false
}

const save = () => {
    emit('save', selectedServiceTask.value)
    closeDialog()
}

</script>