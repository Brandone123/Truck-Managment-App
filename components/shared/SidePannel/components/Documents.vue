<template>
    <v-sheet flat class="d-flex flex-column fill-height">
        <div style="overflow-y:auto;" class="pa-2 d-flex flex-column flex-grow-1">
            <div class="font-weight-bold pa-2">Documents</div>
            <v-list v-if="documents" variant="tonal">
                <template v-for="(document, index) in documents" :key="index">
                    <v-list-item class="mb-2" style="border-radius:10px;">
                        <a :href="document.src" class="truncate"
                            style="width: calc(100% - 40px); text-decoration:none; border-bottom: 1px dotted; "
                            target="_blank">{{
                                document.name
                            }}</a>
                        <template v-slot:append>
                            <v-menu>
                                <template v-slot:activator="{ props: menu }">
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props: tooltip }">
                                            <v-hover>
                                                <template v-slot:default="{ isHovering, props: hover }">
                                                    <v-card
                                                        class=" ml-3 custom-button d-flex justify-center align-center"
                                                        :variant="isHovering ? 'tonal' : 'flat'" density="compact" flat
                                                        v-bind="mergeProps(menu, tooltip, hover)">
                                                        <v-icon size="small">mdi-dots-horizontal</v-icon>
                                                    </v-card>
                                                </template>
                                            </v-hover>
                                        </template>
                                        <span>More Actions</span>
                                    </v-tooltip>
                                </template>
                                <v-list density="compact">
                                    <v-list-item append-icon="mdi-delete"
                                        @click="deleteDocument(document.id)">Delete</v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </v-list-item>
                    <!-- <v-divider v-if="index + 1 < documents?.length"></v-divider> -->
                </template>
            </v-list>
        </div>
        <v-divider></v-divider>
        <div class="flex-shrink-1 pa-1">
            <DropZone acceptedTypes="application/pdf" @filesSelected="uploadDocuments"
                @invalidFileType="invalidFileType" />
        </div>
    </v-sheet>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, mergeProps } from 'vue'
import type { File } from "~/types/shared/file";
import DropZone from './DropZone.vue'

const props = defineProps({
    documents: {
        type: Array as PropType<File[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['uploadDocuments', 'deleteDocument', 'invalidFileType'])

const uploadDocuments = (event: File[]) => {
    emit('uploadDocuments', event)
}

const deleteDocument = (documentId: number) => {
    emit('deleteDocument', documentId)
}
const invalidFileType = (status: boolean) => {
    emit('invalidFileType', status)
}

</script>

<style scoped>
.truncate {
    white-space: nowrap;
    /* Prevents the text from wrapping to a new line */
    overflow: hidden;
    /* Hides the overflow text */
    text-overflow: ellipsis;
    /* Displays ellipsis (...) when text overflows */
}
</style>
