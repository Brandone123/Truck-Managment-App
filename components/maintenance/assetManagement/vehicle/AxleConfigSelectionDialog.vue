<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Select Axle Configuration</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <SharedInputAxleConfigurationAutoCompleteInput variant="outlined" density="comfortable"
                            v-model="selectedConfiguration" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="error" @click="dialog = false">
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    configuration: Object
});

const emit = defineEmits(['update:modelValue', 'close', 'update:configuration']);

const dialog = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const selectedConfiguration = ref<any>(null)

watch(() => dialog.value, () => {
    if (props.configuration?.tireLayout.length) {
        selectedConfiguration.value = JSON.parse(JSON.stringify(props.configuration))
    }

})

const save = () => {
    emit('update:configuration', selectedConfiguration.value)
    dialog.value = false
}

</script>

<style scoped></style>