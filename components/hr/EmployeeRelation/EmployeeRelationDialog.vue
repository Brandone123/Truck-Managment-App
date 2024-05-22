<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    dialog: Boolean,
    relation: Object
})

const emit = defineEmits(['update:dialog'])

const editedRelation = ref({
    description: null,
    resolution: null,
})

const show = computed({
    get() {
        return props.dialog
    },
    set(val) {
        emit('update:dialog', val)
    }
})

const close = () => {
    show.value = false
}

const save = () => {
    close();
}


watch(props.dialog, (val) => {
    if (val && props.relation) {
        editedRelation.value = props.relation
    }
})

</script>

<template>
    <v-dialog v-model="show" persistent max-width="600px">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary">
                Add New Record
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact" class="d-flex justify-space-between">
                <v-toolbar-title>{{ selectedRelation ? 'Edit' : 'Add New' }} Relation Record</v-toolbar-title>
                <v-btn icon density="comfortable" @click="close"><v-icon>mdi-window-close</v-icon></v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="pb-0">
                        <v-text-field variant="solo" density="compact" v-model="editedRelation.description"
                            label="Description" required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                        <v-text-field variant="solo" density="compact" v-model="editedRelation.resolution"
                            label="Resolution" required></v-text-field>
                    </v-col>
                    <!-- Additional fields for documentation -->
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="text-none" density="comfortable" color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn class="text-none" density="comfortable" color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>